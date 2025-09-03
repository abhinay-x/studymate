from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import fitz  # PyMuPDF
import os
import tempfile
import logging
from typing import List, Dict, Any
import requests
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
from bson import ObjectId
import asyncio
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="StudyMate PDF Processor", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/studymate")
client = AsyncIOMotorClient(MONGODB_URI)
db = client.studymate

class PDFProcessor:
    def __init__(self):
        self.chunk_size = 1000  # Characters per chunk
        self.overlap = 200      # Character overlap between chunks
    
    def extract_text_from_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """Extract text from PDF file"""
        try:
            doc = fitz.open(pdf_path)
            pages_text = []
            total_text = ""
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                text = page.get_text()
                pages_text.append({
                    "page_number": page_num + 1,
                    "text": text,
                    "char_count": len(text)
                })
                total_text += text + "\n"
            
            doc.close()
            
            return {
                "success": True,
                "total_pages": len(pages_text),
                "pages": pages_text,
                "total_text": total_text,
                "total_characters": len(total_text)
            }
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def create_chunks(self, text: str, page_number: int = 1) -> List[Dict[str, Any]]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        chunk_index = 0
        
        while start < len(text):
            end = start + self.chunk_size
            
            # If this isn't the last chunk, try to break at a sentence or word boundary
            if end < len(text):
                # Look for sentence boundary
                sentence_end = text.rfind('.', start, end)
                if sentence_end > start + self.chunk_size // 2:
                    end = sentence_end + 1
                else:
                    # Look for word boundary
                    word_end = text.rfind(' ', start, end)
                    if word_end > start + self.chunk_size // 2:
                        end = word_end
            
            chunk_text = text[start:end].strip()
            
            if chunk_text:
                chunks.append({
                    "content": chunk_text,
                    "chunk_index": chunk_index,
                    "page_number": page_number,
                    "start_position": start,
                    "end_position": end,
                    "metadata": {
                        "word_count": len(chunk_text.split()),
                        "character_count": len(chunk_text),
                        "confidence": 1.0
                    }
                })
                chunk_index += 1
            
            # Move start position with overlap
            start = max(start + 1, end - self.overlap)
            
            if start >= len(text):
                break
        
        return chunks
    
    def process_pdf_pages(self, pages_data: List[Dict]) -> List[Dict[str, Any]]:
        """Process all pages and create chunks"""
        all_chunks = []
        global_chunk_index = 0
        
        for page_data in pages_data:
            page_chunks = self.create_chunks(
                page_data["text"], 
                page_data["page_number"]
            )
            
            # Update global chunk indices
            for chunk in page_chunks:
                chunk["chunk_index"] = global_chunk_index
                global_chunk_index += 1
            
            all_chunks.extend(page_chunks)
        
        return all_chunks

pdf_processor = PDFProcessor()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "pdf-processor",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...)):
    """Process uploaded PDF file"""
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Extract text from PDF
        extraction_result = pdf_processor.extract_text_from_pdf(temp_file_path)
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        if not extraction_result["success"]:
            raise HTTPException(status_code=500, detail=extraction_result["error"])
        
        # Create chunks from extracted text
        chunks = pdf_processor.process_pdf_pages(extraction_result["pages"])
        
        return {
            "success": True,
            "filename": file.filename,
            "total_pages": extraction_result["total_pages"],
            "total_characters": extraction_result["total_characters"],
            "total_chunks": len(chunks),
            "chunks": chunks,
            "processing_time": "calculated_by_caller"
        }
    
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/process-document/{document_id}")
async def process_document_by_id(document_id: str):
    """Process document by MongoDB document ID"""
    try:
        # Get document from MongoDB
        document = await db.documents.find_one({"_id": ObjectId(document_id)})
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get file from GridFS
        fs = AsyncIOMotorGridFS(db, collection="uploads")
        file_data = await fs.open_download_stream(document["fileId"])
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            async for chunk in file_data:
                temp_file.write(chunk)
            temp_file_path = temp_file.name
        
        # Process PDF
        extraction_result = pdf_processor.extract_text_from_pdf(temp_file_path)
        os.unlink(temp_file_path)
        
        if not extraction_result["success"]:
            # Mark document as failed
            await db.documents.update_one(
                {"_id": ObjectId(document_id)},
                {"$set": {"status": "failed"}}
            )
            raise HTTPException(status_code=500, detail=extraction_result["error"])
        
        # Create chunks
        chunks = pdf_processor.process_pdf_pages(extraction_result["pages"])
        
        # Save chunks to MongoDB
        chunk_documents = []
        for chunk in chunks:
            chunk_doc = {
                "documentId": ObjectId(document_id),
                "content": chunk["content"],
                "chunkIndex": chunk["chunk_index"],
                "pageNumber": chunk["page_number"],
                "startPosition": chunk["start_position"],
                "endPosition": chunk["end_position"],
                "metadata": chunk["metadata"],
                "createdAt": datetime.utcnow()
            }
            chunk_documents.append(chunk_doc)
        
        if chunk_documents:
            await db.documentchunks.insert_many(chunk_documents)
        
        # Update document status
        await db.documents.update_one(
            {"_id": ObjectId(document_id)},
            {
                "$set": {
                    "status": "ready",
                    "chunkCount": len(chunks),
                    "metadata.pages": extraction_result["total_pages"],
                    "metadata.extractedText": True,
                    "metadata.processingTime": 0  # Would be calculated in real implementation
                }
            }
        )
        
        return {
            "success": True,
            "document_id": document_id,
            "total_pages": extraction_result["total_pages"],
            "total_chunks": len(chunks),
            "message": "Document processed successfully"
        }
    
    except Exception as e:
        logger.error(f"Error processing document {document_id}: {str(e)}")
        # Mark document as failed
        try:
            await db.documents.update_one(
                {"_id": ObjectId(document_id)},
                {"$set": {"status": "failed"}}
            )
        except:
            pass
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Get processing statistics"""
    try:
        total_documents = await db.documents.count_documents({})
        processing_documents = await db.documents.count_documents({"status": "processing"})
        ready_documents = await db.documents.count_documents({"status": "ready"})
        failed_documents = await db.documents.count_documents({"status": "failed"})
        
        return {
            "total_documents": total_documents,
            "processing": processing_documents,
            "ready": ready_documents,
            "failed": failed_documents,
            "service_status": "running"
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
