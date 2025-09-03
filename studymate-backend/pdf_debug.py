#!/usr/bin/env python3
"""
PDF Processing Debug Tool for StudyMate
Tests and diagnoses PyMuPDF PDF extraction issues
"""

import os
import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('pdf_debug.log')
    ]
)
logger = logging.getLogger(__name__)

def test_pymupdf_installation():
    """Test if PyMuPDF is properly installed and working"""
    print("🔍 Testing PyMuPDF Installation...")
    
    try:
        import fitz  # PyMuPDF
        print(f"✅ PyMuPDF imported successfully")
        print(f"   Version: {fitz.version}")
        print(f"   Build date: {fitz.VersionBind}")
        return True
    except ImportError as e:
        print(f"❌ PyMuPDF import failed: {e}")
        return False
    except Exception as e:
        print(f"❌ PyMuPDF error: {e}")
        return False

def test_pdf_file(pdf_path: str):
    """Test PDF processing with detailed debugging"""
    print(f"\n📄 Testing PDF: {pdf_path}")
    
    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        return False
    
    try:
        import fitz  # PyMuPDF
        
        # Open PDF
        print("   Opening PDF...")
        doc = fitz.open(pdf_path)
        
        # Basic info
        page_count = len(doc)
        print(f"   📊 Pages: {page_count}")
        print(f"   📊 Metadata: {doc.metadata}")
        print(f"   📊 Encrypted: {doc.is_encrypted}")
        print(f"   📊 PDF version: {doc.pdf_version()}")
        
        if doc.is_encrypted:
            print("   🔒 PDF is encrypted - this may cause extraction issues")
        
        # Test text extraction page by page
        total_chars = 0
        empty_pages = 0
        
        for page_num in range(min(3, page_count)):  # Test first 3 pages
            print(f"\n   📄 Page {page_num + 1}:")
            page = doc.load_page(page_num)
            
            # Get text
            text = page.get_text()
            char_count = len(text.strip())
            total_chars += char_count
            
            if char_count == 0:
                empty_pages += 1
                print(f"      ⚠️  No text extracted ({char_count} chars)")
                
                # Try different extraction methods
                text_dict = page.get_text("dict")
                text_blocks = page.get_text("blocks")
                
                print(f"      🔍 Dict method blocks: {len(text_dict.get('blocks', []))}")
                print(f"      🔍 Blocks method: {len(text_blocks)}")
                
                # Check if it's an image-based PDF
                image_list = page.get_images()
                print(f"      🖼️  Images on page: {len(image_list)}")
                
            else:
                print(f"      ✅ Extracted {char_count} characters")
                # Show first 100 chars as preview
                preview = text.strip()[:100].replace('\n', ' ')
                print(f"      📝 Preview: {preview}...")
        
        doc.close()
        
        # Summary
        print(f"\n   📊 Summary:")
        print(f"      Total characters: {total_chars}")
        print(f"      Empty pages: {empty_pages}/{min(3, page_count)}")
        
        if total_chars == 0:
            print("   ❌ No text extracted - possible issues:")
            print("      - PDF contains only images (scanned document)")
            print("      - PDF is encrypted or protected")
            print("      - PDF has non-standard text encoding")
            print("      - PDF is corrupted")
            return False
        else:
            print("   ✅ Text extraction successful")
            return True
            
    except Exception as e:
        print(f"   ❌ Error processing PDF: {e}")
        logger.exception("PDF processing error")
        return False

def create_test_pdf():
    """Create a simple test PDF for debugging"""
    print("\n🔧 Creating test PDF...")
    
    try:
        import fitz  # PyMuPDF
        
        # Create a simple PDF
        doc = fitz.open()  # New empty PDF
        page = doc.new_page()
        
        # Add some text
        text = """StudyMate Test Document
        
This is a test PDF created for debugging PyMuPDF extraction.

Key points:
• Text extraction should work
• Multiple lines and formatting
• Special characters: àáâãäå
• Numbers: 123456789
• Symbols: @#$%^&*()

If you can read this, PyMuPDF is working correctly!
"""
        
        # Insert text
        page.insert_text((50, 50), text, fontsize=12)
        
        # Save test PDF
        test_path = "test_document.pdf"
        doc.save(test_path)
        doc.close()
        
        print(f"   ✅ Test PDF created: {test_path}")
        return test_path
        
    except Exception as e:
        print(f"   ❌ Failed to create test PDF: {e}")
        return None

def diagnose_pdf_issues():
    """Run comprehensive PDF processing diagnosis"""
    print("🚀 StudyMate PDF Processing Diagnostics")
    print("=" * 50)
    
    # Test 1: PyMuPDF installation
    if not test_pymupdf_installation():
        print("\n💡 Fix: Install PyMuPDF with: pip install PyMuPDF")
        return
    
    # Test 2: Create and test a simple PDF
    test_pdf = create_test_pdf()
    if test_pdf:
        test_pdf_file(test_pdf)
    
    # Test 3: Check for existing PDFs in uploads directory
    uploads_dir = Path("../uploads")
    if uploads_dir.exists():
        pdf_files = list(uploads_dir.glob("*.pdf"))
        print(f"\n📁 Found {len(pdf_files)} PDF files in uploads:")
        
        for pdf_file in pdf_files[:3]:  # Test first 3 PDFs
            test_pdf_file(str(pdf_file))
    else:
        print("\n📁 No uploads directory found")
    
    print("\n" + "=" * 50)
    print("🎯 Diagnosis Complete!")
    print("Check pdf_debug.log for detailed logs")

if __name__ == "__main__":
    diagnose_pdf_issues()
