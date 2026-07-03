from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os

# ======================================
# Membaca file .env
# ======================================

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if api_key is None:
    raise Exception("API Key tidak ditemukan. Periksa file .env")

client = OpenAI(api_key=api_key)

# ======================================
# Membuat aplikasi FastAPI
# ======================================

app = FastAPI(
    title="Santonius AI Chatbot",
    version="1.0"
)

# ======================================
# Mengizinkan frontend mengakses backend
# ======================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================
# Model Request
# ======================================

class ChatRequest(BaseModel):
    message: str

# ======================================
# Halaman Home
# ======================================

@app.get("/")
def home():

    return {
        "status": "Backend berjalan",
        "developer": "Santonius Hasibuan"
    }

# ======================================
# Endpoint Chat
# ======================================

@app.post("/chat")
def chat(data: ChatRequest):

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Kamu adalah AI Assistant yang ramah, profesional, "
                    "dan membantu pengguna dengan bahasa Indonesia."
                )
            },
            {
                "role": "user",
                "content": data.message
            }
        ]
    )

    return {
        "reply": response.choices[0].message.content
    }