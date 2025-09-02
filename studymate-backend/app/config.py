from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    database_url: str = "sqlite:///./studymate.db"

    # Storage
    upload_dir: str = "app/storage/documents"

    # Embeddings
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"

    # LLM (HF local)
    llm_model_id: str = "Qwen/Qwen2.5-7B-Instruct"
    llm_4bit: bool = True

    # Generation
    temperature: float = 0.3
    top_p: float = 0.9
    max_new_tokens: int = 300

    # API
    api_title: str = "StudyMate API"
    api_version: str = "1.0.0"

    # HF optional
    hf_token: Optional[str] = None

    class Config:
        env_file = ".env"

def _ensure_dirs(settings: "Settings"):
    import os
    os.makedirs(settings.upload_dir, exist_ok=True)
    os.makedirs("app/storage/embeddings", exist_ok=True)
    os.makedirs("app/storage/sessions", exist_ok=True)

settings = Settings()
_ensure_dirs(settings)
