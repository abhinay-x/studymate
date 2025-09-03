PDF Processor (port 5001)
powershell
# From: d:\projects\studymate\studymate-backend
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\python-services\pdf-processor\.venv\Scripts\Activate.ps1
$env:MONGODB_URI = "mongodb+srv://abhimongodb_db_user:Abhinay@cluster0.5kmqces.mongodb.net/studymate?retryWrites=true&w=majority&appName=Cluster0"

uvicorn python-services.pdf-processor.main:app --host 0.0.0.0 --port 5001
# Health check: http://localhost:5001/health
Embedding Service (port 5002)
powershell
# From: d:\projects\studymate\studymate-backend (new PowerShell window)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\python-services\embedding-service\.venv\Scripts\Activate.ps1
$env:MONGODB_URI = "mongodb+srv://abhimongodb_db_user:Abhinay@cluster0.5kmqces.mongodb.net/studymate?retryWrites=true&w=majority&appName=Cluster0"

uvicorn python-services.embedding-service.main:app --host 0.0.0.0 --port 5002
# Health check: http://localhost:5002/


Node backend reminder
Make sure Node knows where to reach the Python services:

powershell
$env:PDF_SERVICE_URL = "http://localhost:5001"
$env:EMBEDDING_SERVICE_URL = "http://localhost:5002"
$env:MONGODB_URI = "mongodb+srv://abhimongodb_db_user:Abhinay@cluster0.5kmqces.mongodb.net/studymate?retryWrites=true&w=majority&appName=Cluster0"
$env:JWT_SECRET = "your_jwt_secret_here"
$env:REFRESH_TOKEN_SECRET = "your_refresh_secret_here"
npm run start