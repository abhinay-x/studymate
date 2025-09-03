from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
import os
import logging
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from gridfs import GridFS
from bson import ObjectId
import asyncio
from datetime import datetime
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="StudyMate Embedding Service", version="1.0.0")

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

# Pydantic models
class EmbeddingRequest(BaseModel):
    texts: List[str]
    
class SearchRequest(BaseModel):
    query: str
    document_ids: Optional[List[str]] = None
    limit: int = 5

class EmbeddingService:
    def __init__(self):
        # Load sentence transformer model
        self.model_name = "all-MiniLM-L6-v2"  # Lightweight but effective model
        logger.info(f"Loading embedding model: {self.model_name}")
        self.model = SentenceTransformer(self.model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        logger.info(f"Model loaded. Embedding dimension: {self.embedding_dim}")
        
        # Initialize FAISS index (will be built dynamically)
        self.index = None
        self.chunk_ids = []  # Keep track of chunk IDs corresponding to index positions
        
    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts"""
        try:
            embeddings = self.model.encode(texts, convert_to_numpy=True)
            return embeddings
        except Exception as e:
            logger.error(f"Error generating embeddings: {str(e)}")
            raise e
    
    def build_faiss_index(self, embeddings: np.ndarray) -> faiss.Index:
        """Build FAISS index from embeddings"""
        try:
            # Use IndexFlatIP for cosine similarity (after L2 normalization)
            index = faiss.IndexFlatIP(self.embedding_dim)
            
            # Normalize embeddings for cosine similarity
            faiss.normalize_L2(embeddings)
            
            # Add embeddings to index
            index.add(embeddings.astype('float32'))
            
            logger.info(f"FAISS index built with {index.ntotal} vectors")
            return index
        except Exception as e:
            logger.error(f"Error building FAISS index: {str(e)}")
            raise e
    
    async def load_document_embeddings(self, document_ids: List[str] = None):
        """Load embeddings for specific documents or all documents"""
        try:
            # Build query
            query = {}
            if document_ids:
                query["documentId"] = {"$in": [ObjectId(doc_id) for doc_id in document_ids]}
            
            # Get chunks with embeddings
            chunks = await db.documentchunks.find(
                {**query, "embedding": {"$exists": True, "$ne": []}},
                {"_id": 1, "embedding": 1}
            ).to_list(None)
            
            if not chunks:
                logger.warning("No chunks with embeddings found")
                return None, []
            
            # Extract embeddings and IDs
            embeddings = np.array([chunk["embedding"] for chunk in chunks])
            chunk_ids = [str(chunk["_id"]) for chunk in chunks]
            
            # Build FAISS index
            index = self.build_faiss_index(embeddings)
            
            return index, chunk_ids
        except Exception as e:
            logger.error(f"Error loading document embeddings: {str(e)}")
            raise e
    
    async def search_similar_chunks(self, query: str, document_ids: List[str] = None, limit: int = 5):
        """Search for similar chunks using semantic similarity"""
        try:
            # Generate query embedding
            query_embedding = self.generate_embeddings([query])
            faiss.normalize_L2(query_embedding)
            
            # Load or build index for specified documents
            index, chunk_ids = await self.load_document_embeddings(document_ids)
            
            if index is None:
                return []
            
            # Search similar vectors
            scores, indices = index.search(query_embedding.astype('float32'), min(limit, len(chunk_ids)))
            
            # Get chunk details
            similar_chunks = []
            for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
                if idx >= 0:  # Valid index
                    chunk_id = chunk_ids[idx]
                    chunk = await db.documentchunks.find_one({"_id": ObjectId(chunk_id)})
                    if chunk:
                        similar_chunks.append({
                            "chunk_id": chunk_id,
                            "content": chunk["content"],
                            "similarity_score": float(score),
                            "page_number": chunk.get("pageNumber", 1),
                            "chunk_index": chunk.get("chunkIndex", 0),
                            "document_id": str(chunk["documentId"])
                        })
            
            return similar_chunks
        except Exception as e:
            logger.error(f"Error searching similar chunks: {str(e)}")
            raise e

embedding_service = EmbeddingService()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "embedding-service",
        "model": embedding_service.model_name,
        "embedding_dim": embedding_service.embedding_dim,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/generate-embeddings")
async def generate_embeddings(request: EmbeddingRequest):
    """Generate embeddings for a list of texts"""
    try:
        if not request.texts:
            raise HTTPException(status_code=400, detail="No texts provided")
        
        embeddings = embedding_service.generate_embeddings(request.texts)
        
        return {
            "success": True,
            "embeddings": embeddings.tolist(),
            "count": len(embeddings),
            "dimension": embedding_service.embedding_dim
        }
    except Exception as e:
        logger.error(f"Error generating embeddings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed-document-chunks/{document_id}")
async def embed_document_chunks(document_id: str):
    """Generate and store embeddings for all chunks of a document"""
    try:
        # Get document chunks
        chunks = await db.documentchunks.find(
            {"documentId": ObjectId(document_id)},
            {"_id": 1, "content": 1}
        ).to_list(None)
        
        if not chunks:
            raise HTTPException(status_code=404, detail="No chunks found for document")
        
        # Extract texts
        texts = [chunk["content"] for chunk in chunks]
        chunk_ids = [chunk["_id"] for chunk in chunks]
        
        # Generate embeddings
        embeddings = embedding_service.generate_embeddings(texts)
        
        # Update chunks with embeddings
        update_operations = []
        for chunk_id, embedding in zip(chunk_ids, embeddings):
            update_operations.append({
                "updateOne": {
                    "filter": {"_id": chunk_id},
                    "update": {"$set": {"embedding": embedding.tolist()}}
                }
            })
        
        # Bulk update
        if update_operations:
            await db.documentchunks.bulk_write(update_operations)
        
        logger.info(f"Generated embeddings for {len(chunks)} chunks in document {document_id}")
        
        return {
            "success": True,
            "document_id": document_id,
            "chunks_processed": len(chunks),
            "embedding_dimension": embedding_service.embedding_dim
        }
    except Exception as e:
        logger.error(f"Error embedding document chunks: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search-similar")
async def search_similar(request: SearchRequest):
    """Search for similar chunks using semantic similarity"""
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        similar_chunks = await embedding_service.search_similar_chunks(
            request.query,
            request.document_ids,
            request.limit
        )
        
        return {
            "success": True,
            "query": request.query,
            "results": similar_chunks,
            "count": len(similar_chunks)
        }
    except Exception as e:
        logger.error(f"Error searching similar chunks: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/build-index")
async def build_search_index(document_ids: Optional[List[str]] = None):
    """Build or rebuild FAISS search index for specified documents"""
    try:
        index, chunk_ids = await embedding_service.load_document_embeddings(document_ids)
        
        if index is None:
            return {
                "success": False,
                "message": "No embeddings found to build index"
            }
        
        # Store index in service (in production, you might want to persist this)
        embedding_service.index = index
        embedding_service.chunk_ids = chunk_ids
        
        return {
            "success": True,
            "message": "Search index built successfully",
            "total_vectors": len(chunk_ids),
            "document_ids": document_ids or "all"
        }
    except Exception as e:
        logger.error(f"Error building search index: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Get embedding service statistics"""
    try:
        # Count chunks with embeddings
        total_chunks = await db.documentchunks.count_documents({})
        embedded_chunks = await db.documentchunks.count_documents({"embedding": {"$exists": True, "$ne": []}})
        
        # Count documents with embedded chunks
        pipeline = [
            {"$match": {"embedding": {"$exists": True, "$ne": []}}},
            {"$group": {"_id": "$documentId"}},
            {"$count": "total"}
        ]
        embedded_docs_result = await db.documentchunks.aggregate(pipeline).to_list(1)
        embedded_documents = embedded_docs_result[0]["total"] if embedded_docs_result else 0
        
        return {
            "total_chunks": total_chunks,
            "embedded_chunks": embedded_chunks,
            "embedded_documents": embedded_documents,
            "embedding_coverage": round((embedded_chunks / total_chunks * 100), 2) if total_chunks > 0 else 0,
            "model": embedding_service.model_name,
            "embedding_dimension": embedding_service.embedding_dim,
            "index_loaded": embedding_service.index is not None,
            "service_status": "running"
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/embeddings/{document_id}")
async def delete_document_embeddings(document_id: str):
    """Delete embeddings for a specific document"""
    try:
        result = await db.documentchunks.update_many(
            {"documentId": ObjectId(document_id)},
            {"$unset": {"embedding": ""}}
        )
        
        return {
            "success": True,
            "document_id": document_id,
            "chunks_updated": result.modified_count,
            "message": "Embeddings deleted successfully"
        }
    except Exception as e:
        logger.error(f"Error deleting embeddings: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5002)
