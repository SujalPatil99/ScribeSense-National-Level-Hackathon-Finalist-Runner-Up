# from fastapi import FastAPI, File, UploadFile, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import JSONResponse
# import os
# import shutil
# from pathlib import Path
# from typing import Dict, Optional
# from google import genai
# from google.genai.errors import APIError
# from PIL import Image
# import tempfile
# import json

# # ==============================================================================
# # CONFIGURATION
# # ==============================================================================
# MY_API_KEY = "AIzaSyDDDo-W-7sCbuzRun7wRa0lswCcKDBQKh0" #Your Google Vison Api key
# UPLOAD_DIR = "uploads"
# Path(UPLOAD_DIR).mkdir(exist_ok=True)

# # ==============================================================================
# # FASTAPI APP INITIALIZATION
# # ==============================================================================
# app = FastAPI(
#     title="Handwriting Processing API",
#     description="API for processing handwritten documents using Gemini AI",
#     version="2.0.0"
# )

# # Add CORS middleware
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ==============================================================================
# # EXISTING PROCESSING FUNCTIONS (UNCHANGED)
# # ==============================================================================

# def extract_text_from_image(client, image_path):
#     """Step 1: Uses Gemini to perform OCR and extract text from the image."""
#     if not os.path.exists(image_path):
#         raise FileNotFoundError(f"Image file not found at '{image_path}'")

#     try:
#         img = Image.open(image_path)
#         prompt = "Transcribe the handwritten text in this image accurately. Do not add any commentary."
        
#         response = client.models.generate_content(
#             model="gemini-2.5-flash", 
#             contents=[prompt, img]
#         )
#         extracted_text = response.text.strip()
#         return extracted_text

#     except APIError as e:
#         raise HTTPException(status_code=500, detail=f"Gemini API Error during text extraction: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error during text extraction: {str(e)}")

# def translate_to_english_initial(client, text_to_translate):
#     """Step 2: Detects language and translates the extracted text to English."""
#     if not text_to_translate:
#         return None
    
#     translation_prompt = (
#         "Detect the language of the following text and translate it to fluent English. "
#         "Only return the English translation, without any other commentary or pre-amble. "
#         f"Text to translate: \"{text_to_translate}\""
#     )
    
#     try:
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=translation_prompt
#         )
#         translated_text = response.text.strip()
#         return translated_text
    
#     except APIError as e:
#         return text_to_translate
#     except Exception as e:
#         return text_to_translate

# def correct_and_enrich_text(client, clean_english_text):
#     """Step 3: Corrects and polishes the clean English text."""
#     if not clean_english_text:
#         return "Correction skipped: No text to process."
    
#     correction_prompt = ("You are an expert proofreader. Correct only grammatical and"
#                          "spelling errors in the following text. Do not change the tone," 
#                          "style, structure, or point of view (keep it exactly as written," 
#                          "including first person). Return only the corrected version, nothing else"
#     )
    
#     full_correction_prompt = f"{correction_prompt}\n\nText to correct: \"{clean_english_text}\""
    
#     try:
#         response = client.models.generate_content(
#             model="gemini-2.5-flash", 
#             contents=full_correction_prompt
#         )
#         corrected_text = response.text.strip()
#         return corrected_text

#     except APIError as e:
#         return "Correction failed due to API error."
#     except Exception as e:
#         return "Correction failed."

# def translate_non_english_words(text, client):
#     """Translate non-English words in the corrected text."""
#     prompt = f"""You are an expert translator with deep knowledge of multiple languages and cultural contexts.

# **TRANSLATION TASK:**

# **SOURCE TEXT:**
# {text}

# **INSTRUCTIONS:**
# 1. Identify if there are any non-English words in the text
# 2. If non-English words are found, translate the entire text to English
# 3. Maintain the original meaning and context as accurately as possible
# 4. Preserve any technical terms, names, or specific terminology
# 5. Keep the same structure and formatting (paragraphs, line breaks)
# 6. For names of people, places, or organizations, use standard English transliterations
# 7. Preserve any dates, numbers, or numerical data exactly as they appear

# **IMPORTANT:**
# - Provide ONLY the translated English text
# - Do NOT add explanations, notes, or comments
# - Do NOT mention that this is a translation
# - Output should be natural, fluent English
# - If the text is already completely in English, return it as-is

# Begin translation now:"""
    
#     try:
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=prompt
#         )
#         translated_text = response.text.strip()
#         return translated_text
#     except APIError as e:
#         return text
#     except Exception as e:
#         return text

# def generate_summary_and_keywords(text, client):
#     """Generate an adaptive summary and key concepts using Gemini API."""
#     prompt = f"""
#     You are an expert document analyst. Read and analyze the following text carefully.

#     **DOCUMENT TEXT:**
#     {text}

#     **YOUR TASK:**
#     Provide a concise, structured analysis in the following format:

#     **SUMMARY:**
#     Write a proportional summary that captures the essence of the document.  
#     - Keep the summary roughly one-third of the input text length.  
#     - If the input is short, give a short summary; if it's long, expand accordingly.  
#     - Focus on the main ideas, purpose, and tone — not every detail.

#     **IMPORTANT KEYWORDS:**
#     List key terms, names, and ideas from the document.  
#     - The number of keywords should depend on the document length (fewer for short texts, more for long ones).  
#     - For each keyword, include a one-line explanation of its significance.

#     Format each keyword like this:
#     - **Keyword** — one-line reason it's important.

#     Keep your response balanced, accurate, and cleanly formatted. Begin your analysis now:
#     """

    
#     try:
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=prompt
#         )
#         return response.text.strip()
#     except APIError as e:
#         return "Summarization failed due to API error."
#     except Exception as e:
#         return "Summarization failed."

# def process_uploaded_image(image_path: str) -> Dict:
#     """
#     Process an uploaded image through the complete pipeline.
#     Returns a dictionary with all processing results.
#     """
#     try:
#         client = genai.Client(api_key=MY_API_KEY)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error initializing Gemini Client: {str(e)}")
    
#     # Run the pipeline
#     extracted_text = extract_text_from_image(client, image_path)
#     if not extracted_text:
#         raise HTTPException(status_code=400, detail="Failed to extract text from image")
    
#     translated_english_text = translate_to_english_initial(client, extracted_text)
#     if not translated_english_text:
#         raise HTTPException(status_code=400, detail="Failed to translate text")

#     corrected_text = correct_and_enrich_text(client, translated_english_text)
#     fully_translated_text = translate_non_english_words(corrected_text, client)
#     final_summary = generate_summary_and_keywords(fully_translated_text, client)
    
#     # Calculate statistics
#     word_count = len(fully_translated_text.split())
#     char_count = len(fully_translated_text)
    
#     return {
#         "status": "success",
#         "data": {
#             "extracted_text": extracted_text,
#             "corrected_text": corrected_text,
#             "fully_translated_text": fully_translated_text,
#             "summary_and_keywords": final_summary,
#             "statistics": {
#                 "character_count": char_count,
#                 "word_count": word_count
#             }
#         }
#     }

# # ==============================================================================
# # NEW FEATURE FUNCTIONS (ADDITIONS)
# # ==============================================================================

# def detect_text_type(client, image_path):
#     """Detect if the text in the image is handwritten or typed."""
#     if not os.path.exists(image_path):
#         raise FileNotFoundError(f"Image file not found at '{image_path}'")
    
#     try:
#         img = Image.open(image_path)
#         prompt = """
# You are a vision expert. Look at this image and determine whether the text is:
# - Handwritten
# - Typed/Printed

# Respond ONLY with one word: "Handwritten" or "Typed".
# """
#         response = client.models.generate_content(
#             model="gemini-2.5-flash", 
#             contents=[prompt, img]
#         )
#         text_type = response.text.strip()
#         return text_type
    
#     except APIError as e:
#         raise HTTPException(status_code=500, detail=f"Gemini API Error during text type detection: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error during text type detection: {str(e)}")

# def analyze_mood_from_handwriting(client, image_path):
#     """Analyze mood and emotional state from handwriting."""
#     if not os.path.exists(image_path):
#         raise FileNotFoundError(f"Image file not found at '{image_path}'")
    
#     try:
#         img = Image.open(image_path)
#         prompt = """
# You are an expert graphologist. Analyze this handwriting image and provide:

# 1. A mood assessment based on handwriting characteristics (slant, pressure, spacing, size, etc.)
# 2. Emotional tone (e.g., calm, excited, stressed, happy, contemplative)
# 3. Energy level (low, medium, high)
# 4. A brief one-sentence overall impression

# Output your response as a JSON object with these keys:
# {
#     "mood": "brief mood description",
#     "emotional_tone": "emotional state",
#     "energy_level": "low/medium/high",
#     "overall_impression": "one sentence summary"
# }

# Return ONLY the JSON object, nothing else.
# """
#         response = client.models.generate_content(
#             model="gemini-2.5-pro", 
#             contents=[prompt, img]
#         )
        
#         # Parse JSON response
#         json_str = response.text.strip().replace("```json", "").replace("```", "").strip()
        
#         try:
#             mood_data = json.loads(json_str)
#         except json.JSONDecodeError:
#             # Try to extract JSON from text
#             start = json_str.find("{")
#             end = json_str.rfind("}") + 1
#             if start != -1 and end > start:
#                 mood_data = json.loads(json_str[start:end])
#             else:
#                 mood_data = {
#                     "mood": "Unable to parse",
#                     "emotional_tone": "Unknown",
#                     "energy_level": "Unknown",
#                     "overall_impression": json_str
#                 }
        
#         return mood_data
    
#     except APIError as e:
#         raise HTTPException(status_code=500, detail=f"Gemini API Error during mood analysis: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error during mood analysis: {str(e)}")

# def reconstruct_context(client, image_path, raw_text):
#     """Reconstruct context from incomplete or fragmented text."""
#     if not os.path.exists(image_path):
#         raise FileNotFoundError(f"Image file not found at '{image_path}'")
    
#     if not raw_text:
#         return {
#             "reconstructed_text": "",
#             "comment": "No input text provided for reconstruction.",
#             "reconstruction_performed": False
#         }
    
#     try:
#         img = Image.open(image_path)
#         prompt = f"""
# You are an expert linguist and context restorer.
# The following handwritten text may be incomplete or fragmented:
# "{raw_text}"

# Based on handwriting flow, visual context, and linguistic logic, reconstruct the most likely full intended message.
# If the text appears complete and clear, simply return it as-is and note that no reconstruction was needed.

# Output MUST be a single, valid JSON object with these keys:
# {{
#     "reconstructed_text": "The polished, contextually complete text (same language as input)",
#     "comment": "Brief explanation of what was reconstructed or why no reconstruction was necessary",
#     "reconstruction_performed": true/false
# }}

# Return ONLY the JSON object, nothing else.
# """
#         response = client.models.generate_content(
#             model="gemini-2.5-pro", 
#             contents=[prompt, img]
#         )
        
#         # Parse JSON response
#         json_str = response.text.strip().replace("```json", "").replace("```", "").strip()
        
#         try:
#             reconstruction_data = json.loads(json_str)
#         except json.JSONDecodeError:
#             # Try to extract JSON from text
#             start = json_str.find("{")
#             end = json_str.rfind("}") + 1
#             if start != -1 and end > start:
#                 reconstruction_data = json.loads(json_str[start:end])
#             else:
#                 reconstruction_data = {
#                     "reconstructed_text": raw_text,
#                     "comment": "Could not parse reconstruction response.",
#                     "reconstruction_performed": False
#                 }
        
#         return reconstruction_data
    
#     except APIError as e:
#         raise HTTPException(status_code=500, detail=f"Gemini API Error during context reconstruction: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error during context reconstruction: {str(e)}")

# # ==============================================================================
# # NEW API ENDPOINTS (ADDITIONS)
# # ==============================================================================

# @app.post("/detect-text-type")
# async def detect_text_type_endpoint(file: UploadFile = File(...)):
#     """
#     Detect if the text in the uploaded image is handwritten or typed.
    
#     Args:
#         file: Image file (PNG, JPG, JPEG)
    
#     Returns:
#         JSON response with text type detection result
#     """
#     if not file.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="File must be an image")
    
#     tmp_file_path = None
#     try:
#         # Create temporary file
#         with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
#             shutil.copyfileobj(file.file, tmp_file)
#             tmp_file_path = tmp_file.name
        
#         # Initialize client and detect text type
#         client = genai.Client(api_key=MY_API_KEY)
#         text_type = detect_text_type(client, tmp_file_path)
        
#         return JSONResponse(content={
#             "status": "success",
#             "data": {
#                 "text_type": text_type,
#                 "filename": file.filename
#             }
#         })
    
#     except HTTPException as he:
#         raise he
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error detecting text type: {str(e)}")
#     finally:
#         if tmp_file_path and os.path.exists(tmp_file_path):
#             os.remove(tmp_file_path)

# @app.post("/analyze-mood")
# async def analyze_mood_endpoint(file: UploadFile = File(...)):
#     """
#     Analyze mood and emotional state from handwriting in the uploaded image.
    
#     Args:
#         file: Image file (PNG, JPG, JPEG) with handwritten text
    
#     Returns:
#         JSON response with mood analysis
#     """
#     if not file.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="File must be an image")
    
#     tmp_file_path = None
#     try:
#         # Create temporary file
#         with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
#             shutil.copyfileobj(file.file, tmp_file)
#             tmp_file_path = tmp_file.name
        
#         # Initialize client and analyze mood
#         client = genai.Client(api_key=MY_API_KEY)
#         mood_data = analyze_mood_from_handwriting(client, tmp_file_path)
        
#         return JSONResponse(content={
#             "status": "success",
#             "data": {
#                 "mood_analysis": mood_data,
#                 "filename": file.filename
#             }
#         })
    
#     except HTTPException as he:
#         raise he
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error analyzing mood: {str(e)}")
#     finally:
#         if tmp_file_path and os.path.exists(tmp_file_path):
#             os.remove(tmp_file_path)

# @app.post("/reconstruct-context")
# async def reconstruct_context_endpoint(file: UploadFile = File(...)):
#     """
#     Extract text from image and reconstruct context for incomplete/fragmented text.
    
#     Args:
#         file: Image file (PNG, JPG, JPEG)
    
#     Returns:
#         JSON response with original and reconstructed text
#     """
#     if not file.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="File must be an image")
    
#     tmp_file_path = None
#     try:
#         # Create temporary file
#         with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
#             shutil.copyfileobj(file.file, tmp_file)
#             tmp_file_path = tmp_file.name
        
#         # Initialize client
#         client = genai.Client(api_key=MY_API_KEY)
        
#         # First extract text
#         extracted_text = extract_text_from_image(client, tmp_file_path)
        
#         # Then reconstruct context
#         reconstruction_data = reconstruct_context(client, tmp_file_path, extracted_text)
        
#         return JSONResponse(content={
#             "status": "success",
#             "data": {
#                 "original_text": extracted_text,
#                 "reconstruction": reconstruction_data,
#                 "filename": file.filename
#             }
#         })
    
#     except HTTPException as he:
#         raise he
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error reconstructing context: {str(e)}")
#     finally:
#         if tmp_file_path and os.path.exists(tmp_file_path):
#             os.remove(tmp_file_path)

# @app.post("/process-enhanced")
# async def process_image_enhanced(file: UploadFile = File(...)):
#     """
#     Process uploaded handwritten document with ALL features including new enhancements.
    
#     Args:
#         file: Image file (PNG, JPG, JPEG)
    
#     Returns:
#         JSON response with complete analysis including:
#         - Text extraction and processing (original pipeline)
#         - Text type detection
#         - Mood analysis
#         - Context reconstruction
#     """
#     if not file.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="File must be an image")
    
#     tmp_file_path = None
#     try:
#         # Create temporary file
#         with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
#             shutil.copyfileobj(file.file, tmp_file)
#             tmp_file_path = tmp_file.name
        
#         # Initialize client
#         client = genai.Client(api_key=MY_API_KEY)
        
#         # Step 1: Text Type Detection
#         text_type = detect_text_type(client, tmp_file_path)
        
#         # Step 2: Text Extraction
#         extracted_text = extract_text_from_image(client, tmp_file_path)
        
#         # Step 3: Context Reconstruction
#         reconstruction_data = reconstruct_context(client, tmp_file_path, extracted_text)
#         reconstructed_text = reconstruction_data.get('reconstructed_text', extracted_text)
        
#         # Step 4: Translation and Processing (using reconstructed text)
#         translated_english_text = translate_to_english_initial(client, reconstructed_text)
#         corrected_text = correct_and_enrich_text(client, translated_english_text)
#         fully_translated_text = translate_non_english_words(corrected_text, client)
#         final_summary = generate_summary_and_keywords(fully_translated_text, client)
        
#         # Step 5: Mood Analysis (if handwritten)
#         mood_data = None
#         if "handwritten" in text_type.lower():
#             try:
#                 mood_data = analyze_mood_from_handwriting(client, tmp_file_path)
#             except Exception as e:
#                 mood_data = {"error": f"Mood analysis failed: {str(e)}"}
        
#         # Calculate statistics
#         word_count = len(fully_translated_text.split())
#         char_count = len(fully_translated_text)
        
#         return JSONResponse(content={
#             "status": "success",
#             "data": {
#                 "text_type": text_type,
#                 "extracted_text": extracted_text,
#                 "context_reconstruction": reconstruction_data,
#                 "corrected_text": corrected_text,
#                 "fully_translated_text": fully_translated_text,
#                 "summary_and_keywords": final_summary,
#                 "mood_analysis": mood_data,
#                 "statistics": {
#                     "character_count": char_count,
#                     "word_count": word_count
#                 }
#             }
#         })
    
#     except HTTPException as he:
#         raise he
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
#     finally:
#         if tmp_file_path and os.path.exists(tmp_file_path):
#             os.remove(tmp_file_path)

# # ==============================================================================
# # EXISTING ENDPOINTS (UNCHANGED)
# # ==============================================================================

# @app.get("/")
# async def root():
#     """Root endpoint with API information."""
#     return {
#         "message": "Handwriting Processing API",
#         "version": "2.0.0",
#         "endpoints": {
#             "/process": "POST - Upload and process handwritten document image (original)",
#             "/process-enhanced": "POST - Process with all new features (text type, mood, context reconstruction)",
#             "/detect-text-type": "POST - Detect if text is handwritten or typed",
#             "/analyze-mood": "POST - Analyze mood from handwriting",
#             "/reconstruct-context": "POST - Reconstruct context from fragmented text",
#             "/health": "GET - Check API health status"
#         }
#     }

# @app.get("/health")
# async def health_check():
#     """Health check endpoint."""
#     return {"status": "healthy", "service": "Handwriting Processing API v2.0"}

# @app.post("/process")
# async def process_image(file: UploadFile = File(...)):
#     """
#     Process uploaded handwritten document image (ORIGINAL ENDPOINT - UNCHANGED).
    
#     Args:
#         file: Image file (PNG, JPG, JPEG)
    
#     Returns:
#         JSON response with extracted text, translations, and summary
#     """
#     if not file.content_type.startswith("image/"):
#         raise HTTPException(status_code=400, detail="File must be an image")
    
#     tmp_file_path = None
#     try:
#         with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
#             shutil.copyfileobj(file.file, tmp_file)
#             tmp_file_path = tmp_file.name
        
#         result = process_uploaded_image(tmp_file_path)
        
#         return JSONResponse(content=result)
    
#     except HTTPException as he:
#         raise he
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
#     finally:
#         if tmp_file_path and os.path.exists(tmp_file_path):
#             os.remove(tmp_file_path)

# # ==============================================================================
# # RUN SERVER
# # ==============================================================================

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
import os
import shutil
from pathlib import Path
from typing import Dict, Optional
from google import genai
from google.genai.errors import APIError
from PIL import Image
import tempfile
import json
import asyncio
import edge_tts
import io
from pydantic import BaseModel

# ==============================================================================
# CONFIGURATION
# ==============================================================================
MY_API_KEY = "AIzaSyDDDo-W-7sCbuzRun7wRa0lswCcKDBQKho"
UPLOAD_DIR = "uploads"
Path(UPLOAD_DIR).mkdir(exist_ok=True)

# ==============================================================================
# FASTAPI APP INITIALIZATION
# ==============================================================================
app = FastAPI(
    title="Handwriting Processing API with TTS",
    description="API for processing handwritten documents using Gemini AI with Text-to-Speech",
    version="2.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# TEXT-TO-SPEECH CLASS INTEGRATION
# ==============================================================================

class TextToSpeech:
    def __init__(self):
        # MULTILINGUAL VOICES - with proper language codes
        self.voices = {
            "english": "en-US-AriaNeural",
            "hindi": "hi-IN-MadhurNeural",      # ACTUAL Hindi voice
            "marathi": "mr-IN-AarohiNeural",    # ACTUAL Marathi voice
            "german": "de-DE-KatjaNeural",
            "french": "fr-FR-DeniseNeural",
            "spanish": "es-ES-ElviraNeural",
            "auto": "en-US-AriaNeural"
        }
        print("✅ Fixed Multilingual TTS Ready!")
    
    def detect_language(self, text: str) -> str:
        """Auto-detect language and handle mixed text"""
        # Check for Hindi/Marathi (Devanagari script)
        devanagari_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')
        total_chars = len(text.strip())
        
        # If more than 30% characters are Devanagari, treat as Hindi
        if total_chars > 0 and (devanagari_chars / total_chars) > 0.3:
            return "hindi"
        
        # Check for other languages
        german_indicators = ['ä', 'ö', 'ü', 'ß', 'und', 'der', 'die', 'das']
        if any(indicator in text.lower() for indicator in german_indicators):
            return "german"
        
        french_indicators = ['é', 'è', 'ê', 'à', 'ç', 'bonjour', 'merci']
        if any(indicator in text.lower() for indicator in french_indicators):
            return "french"
            
        spanish_indicators = ['ñ', '¡', '¿', 'hola', 'gracias']
        if any(indicator in text.lower() for indicator in spanish_indicators):
            return "spanish"
        
        return "english"
    
    def prepare_text_for_tts(self, text: str, language: str) -> str:
        """Prepare text for TTS - handle mixed languages"""
        if language == "hindi":
            # For pure Hindi, we need to use the actual Hindi voice
            # For mixed text, use English with Hindi words
            devanagari_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')
            total_chars = len(text.strip())
            
            if total_chars > 0 and (devanagari_chars / total_chars) > 0.7:
                # Mostly Hindi - use Hindi voice
                return text
            else:
                # Mixed text - use Indian English voice
                self.voices["hindi"] = "en-IN-NeerjaNeural"
                return text
        return text
    
    async def generate_audio_stream(self, text: str, language: str = "auto") -> io.BytesIO:
        """Generate audio stream from text"""
        if language == "auto":
            language = self.detect_language(text)
        
        # Prepare text based on language
        processed_text = self.prepare_text_for_tts(text, language)
        voice = self.voices.get(language, self.voices["auto"])
        
        print(f"🌍 Language: {language.upper()}")
        print(f"🎙️  Voice: {voice}")
        print(f"🔊 Generating audio for: {text[:50]}...")
        
        try:
            # Generate audio directly to memory
            communicate = edge_tts.Communicate(processed_text, voice)
            
            audio_stream = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_stream.write(chunk["data"])
            
            # Check if we got any audio data
            if audio_stream.tell() == 0:
                print("❌ No audio received. Trying fallback...")
                # Fallback to English
                communicate = edge_tts.Communicate("Text in English", "en-US-AriaNeural")
                audio_stream = io.BytesIO()
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        audio_stream.write(chunk["data"])
            
            audio_stream.seek(0)
            print("✅ Audio generated successfully!")
            return audio_stream
            
        except Exception as e:
            print(f"❌ Error: {e}")
            raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")

# Global TTS instance
tts = TextToSpeech()

# ==============================================================================
# PYDANTIC MODELS FOR TTS
# ==============================================================================

class TTSRequest(BaseModel):
    text: str
    language: str = "auto"

# ==============================================================================
# EXISTING PROCESSING FUNCTIONS (UNCHANGED)
# ==============================================================================

def extract_text_from_image(client, image_path):
    """Step 1: Uses Gemini to perform OCR and extract text from the image."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found at '{image_path}'")

    try:
        img = Image.open(image_path)
        prompt = "Transcribe the handwritten text in this image accurately. Do not add any commentary."
        
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=[prompt, img]
        )
        extracted_text = response.text.strip()
        return extracted_text

    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error during text extraction: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during text extraction: {str(e)}")

def translate_to_english_initial(client, text_to_translate):
    """Step 2: Detects language and translates the extracted text to English."""
    if not text_to_translate:
        return None
    
    translation_prompt = (
        "Detect the language of the following text and translate it to fluent English. "
        "Only return the English translation, without any other commentary or pre-amble. "
        f"Text to translate: \"{text_to_translate}\""
    )
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=translation_prompt
        )
        translated_text = response.text.strip()
        return translated_text
    
    except APIError as e:
        return text_to_translate
    except Exception as e:
        return text_to_translate

def correct_and_enrich_text(client, clean_english_text):
    """Step 3: Corrects and polishes the clean English text."""
    if not clean_english_text:
        return "Correction skipped: No text to process."
    
    correction_prompt = ("You are an expert proofreader. Correct only grammatical and"
                         "spelling errors in the following text. Do not change the tone," 
                         "style, structure, or point of view (keep it exactly as written," 
                         "including first person). Return only the corrected version, nothing else"
    )
    
    full_correction_prompt = f"{correction_prompt}\n\nText to correct: \"{clean_english_text}\""
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=full_correction_prompt
        )
        corrected_text = response.text.strip()
        return corrected_text

    except APIError as e:
        return "Correction failed due to API error."
    except Exception as e:
        return "Correction failed."

def translate_non_english_words(text, client):
    """Translate non-English words in the corrected text."""
    prompt = f"""You are an expert translator with deep knowledge of multiple languages and cultural contexts.

**TRANSLATION TASK:**

**SOURCE TEXT:**
{text}

**INSTRUCTIONS:**
1. Identify if there are any non-English words in the text
2. If non-English words are found, translate the entire text to English
3. Maintain the original meaning and context as accurately as possible
4. Preserve any technical terms, names, or specific terminology
5. Keep the same structure and formatting (paragraphs, line breaks)
6. For names of people, places, or organizations, use standard English transliterations
7. Preserve any dates, numbers, or numerical data exactly as they appear

**IMPORTANT:**
- Provide ONLY the translated English text
- Do NOT add explanations, notes, or comments
- Do NOT mention that this is a translation
- Output should be natural, fluent English
- If the text is already completely in English, return it as-is

Begin translation now:"""
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        translated_text = response.text.strip()
        return translated_text
    except APIError as e:
        return text
    except Exception as e:
        return text

def generate_summary_and_keywords(text, client):
    """Generate an adaptive summary and key concepts using Gemini API."""
    prompt = f"""
    You are an expert document analyst specializing in event and timeline extraction. Read and analyze the following text carefully.

**DOCUMENT TEXT:**
{text}

**YOUR TASK:**
Provide a clean, structured analysis highlighting both the document’s content and its chronological significance.

**SUMMARY:**
Write a proportional summary (about one-third of the document length).  
- Focus on main ideas, purpose, and tone.  
- Maintain clarity and flow.

**CHRONOLOGICAL EVENTS:**
List every important date or time reference found in the text and describe the event linked to it.  
Format:
- **[Date/Year] — [Event/Action that occurred on that date]**

Example:
- **13 January 1993 — England won the World Cup.**

**IMPORTANT KEYWORDS:**
List key terms, names, and ideas with brief explanations.  
Format:
- **Keyword** — one-line reason it’s important.

Keep the response factual, concise, and neatly formatted.
    """

    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except APIError as e:
        return "Summarization failed due to API error."
    except Exception as e:
        return "Summarization failed."

def process_uploaded_image(image_path: str) -> Dict:
    """
    Process an uploaded image through the complete pipeline.
    Returns a dictionary with all processing results.
    """
    try:
        client = genai.Client(api_key=MY_API_KEY)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error initializing Gemini Client: {str(e)}")
    
    # Run the pipeline
    extracted_text = extract_text_from_image(client, image_path)
    if not extracted_text:
        raise HTTPException(status_code=400, detail="Failed to extract text from image")
    
    translated_english_text = translate_to_english_initial(client, extracted_text)
    if not translated_english_text:
        raise HTTPException(status_code=400, detail="Failed to translate text")

    corrected_text = correct_and_enrich_text(client, translated_english_text)
    fully_translated_text = translate_non_english_words(corrected_text, client)
    final_summary = generate_summary_and_keywords(fully_translated_text, client)
    
    # Calculate statistics
    word_count = len(fully_translated_text.split())
    char_count = len(fully_translated_text)
    
    return {
        "status": "success",
        "data": {
            "extracted_text": extracted_text,
            "corrected_text": corrected_text,
            "fully_translated_text": fully_translated_text,
            "summary_and_keywords": final_summary,
            "statistics": {
                "character_count": char_count,
                "word_count": word_count
            }
        }
    }

# ==============================================================================
# NEW FEATURE FUNCTIONS (ADDITIONS)
# ==============================================================================

def detect_text_type(client, image_path):
    """Detect if the text in the image is handwritten or typed."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found at '{image_path}'")
    
    try:
        img = Image.open(image_path)
        prompt = """
You are a vision expert. Look at this image and determine whether the text is:
- Handwritten
- Typed/Printed

Respond ONLY with one word: "Handwritten" or "Typed".
"""
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=[prompt, img]
        )
        text_type = response.text.strip()
        return text_type
    
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error during text type detection: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during text type detection: {str(e)}")

def analyze_mood_from_handwriting(client, image_path):
    """Analyze mood and emotional state from handwriting."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found at '{image_path}'")
    
    try:
        img = Image.open(image_path)
        prompt = """
You are an expert graphologist. Analyze this handwriting image and provide:

1. A mood assessment based on handwriting characteristics (slant, pressure, spacing, size, etc.)
2. Emotional tone (e.g., calm, excited, stressed, happy, contemplative)
3. Energy level (low, medium, high)
4. A brief one-sentence overall impression

Output your response as a JSON object with these keys:
{
    "mood": "brief mood description",
    "emotional_tone": "emotional state",
    "energy_level": "low/medium/high",
    "overall_impression": "one sentence summary"
}

Return ONLY the JSON object, nothing else.
"""
        response = client.models.generate_content(
            model="gemini-2.5-pro", 
            contents=[prompt, img]
        )
        
        # Parse JSON response
        json_str = response.text.strip().replace("```json", "").replace("```", "").strip()
        
        try:
            mood_data = json.loads(json_str)
        except json.JSONDecodeError:
            # Try to extract JSON from text
            start = json_str.find("{")
            end = json_str.rfind("}") + 1
            if start != -1 and end > start:
                mood_data = json.loads(json_str[start:end])
            else:
                mood_data = {
                    "mood": "Unable to parse",
                    "emotional_tone": "Unknown",
                    "energy_level": "Unknown",
                    "overall_impression": json_str
                }
        
        return mood_data
    
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error during mood analysis: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during mood analysis: {str(e)}")

def reconstruct_context(client, image_path, raw_text):
    """Reconstruct context from incomplete or fragmented text."""
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found at '{image_path}'")
    
    if not raw_text:
        return {
            "reconstructed_text": "",
            "comment": "No input text provided for reconstruction.",
            "reconstruction_performed": False
        }
    
    try:
        img = Image.open(image_path)
        prompt = f"""
You are an expert linguist and context restorer.
The following handwritten text may be incomplete or fragmented:
"{raw_text}"

Based on handwriting flow, visual context, and linguistic logic, reconstruct the most likely full intended message.
If the text appears complete and clear, simply return it as-is and note that no reconstruction was needed.

Output MUST be a single, valid JSON object with these keys:
{{
    "reconstructed_text": "The polished, contextually complete text (same language as input)",
    "comment": "Brief explanation of what was reconstructed or why no reconstruction was necessary",
    "reconstruction_performed": true/false
}}

Return ONLY the JSON object, nothing else.
"""
        response = client.models.generate_content(
            model="gemini-2.5-pro", 
            contents=[prompt, img]
        )
        
        # Parse JSON response
        json_str = response.text.strip().replace("```json", "").replace("```", "").strip()
        
        try:
            reconstruction_data = json.loads(json_str)
        except json.JSONDecodeError:
            # Try to extract JSON from text
            start = json_str.find("{")
            end = json_str.rfind("}") + 1
            if start != -1 and end > start:
                reconstruction_data = json.loads(json_str[start:end])
            else:
                reconstruction_data = {
                    "reconstructed_text": raw_text,
                    "comment": "Could not parse reconstruction response.",
                    "reconstruction_performed": False
                }
        
        return reconstruction_data
    
    except APIError as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error during context reconstruction: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during context reconstruction: {str(e)}")

# ==============================================================================
# NEW TTS ENDPOINTS
# ==============================================================================

@app.post("/tts/generate")
async def generate_tts(request: TTSRequest):
    """
    Generate audio from text using Text-to-Speech.
    
    Args:
        request: TTSRequest with text and optional language
    
    Returns:
        Streaming audio response (MP3 format)
    """
    try:
        audio_stream = await tts.generate_audio_stream(request.text, request.language)
        
        return StreamingResponse(
            audio_stream,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=speech.mp3"
            }
        )
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating TTS: {str(e)}")

@app.post("/tts/detect-language")
async def detect_language_endpoint(request: TTSRequest):
    """
    Detect the language of the given text.
    
    Args:
        request: TTSRequest with text
    
    Returns:
        JSON response with detected language
    """
    try:
        detected_language = tts.detect_language(request.text)
        
        return JSONResponse(content={
            "status": "success",
            "data": {
                "text": request.text[:100] + "..." if len(request.text) > 100 else request.text,
                "detected_language": detected_language,
                "available_voices": list(tts.voices.keys())
            }
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting language: {str(e)}")

@app.get("/tts/voices")
async def get_available_voices():
    """
    Get list of available TTS voices.
    
    Returns:
        JSON response with available voices
    """
    try:
        return JSONResponse(content={
            "status": "success",
            "data": {
                "voices": tts.voices,
                "supported_languages": list(tts.voices.keys())
            }
        })
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

# ==============================================================================
# ENHANCED PROCESSING WITH TTS
# ==============================================================================

@app.post("/process-with-tts")
async def process_image_with_tts(file: UploadFile = File(...), generate_audio: bool = True, audio_language: str = "auto"):
    """
    Process uploaded handwritten document and optionally generate TTS audio.
    
    Args:
        file: Image file (PNG, JPG, JPEG)
        generate_audio: Whether to generate audio (default: True)
        audio_language: Language for TTS (default: "auto")
    
    Returns:
        JSON response with processing results and optional audio URL
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    tmp_file_path = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_file_path = tmp_file.name
        
        # Process image
        result = process_uploaded_image(tmp_file_path)
        
        # Generate audio if requested
        audio_data = None
        if generate_audio and result["status"] == "success":
            text_to_speak = result["data"]["fully_translated_text"]
            audio_stream = await tts.generate_audio_stream(text_to_speak, audio_language)
            
            # Convert to base64 for embedding in JSON response
            import base64
            audio_bytes = audio_stream.read()
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            
            audio_data = {
                "audio_base64": audio_base64,
                "language": audio_language,
                "format": "mp3"
            }
        
        # Add audio data to response
        if audio_data:
            result["data"]["audio"] = audio_data
        
        return JSONResponse(content=result)
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)

# ==============================================================================
# NEW API ENDPOINTS (ADDITIONS)
# ==============================================================================

@app.post("/detect-text-type")
async def detect_text_type_endpoint(file: UploadFile = File(...)):
    """
    Detect if the text in the uploaded image is handwritten or typed.
    
    Args:
        file: Image file (PNG, JPG, JPEG)
    
    Returns:
        JSON response with text type detection result
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    tmp_file_path = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_file_path = tmp_file.name
        
        # Initialize client and detect text type
        client = genai.Client(api_key=MY_API_KEY)
        text_type = detect_text_type(client, tmp_file_path)
        
        return JSONResponse(content={
            "status": "success",
            "data": {
                "text_type": text_type,
                "filename": file.filename
            }
        })
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting text type: {str(e)}")
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)

@app.post("/analyze-mood")
async def analyze_mood_endpoint(file: UploadFile = File(...)):
    """
    Analyze mood and emotional state from handwriting in the uploaded image.
    
    Args:
        file: Image file (PNG, JPG, JPEG) with handwritten text
    
    Returns:
        JSON response with mood analysis
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    tmp_file_path = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_file_path = tmp_file.name
        
        # Initialize client and analyze mood
        client = genai.Client(api_key=MY_API_KEY)
        mood_data = analyze_mood_from_handwriting(client, tmp_file_path)
        
        return JSONResponse(content={
            "status": "success",
            "data": {
                "mood_analysis": mood_data,
                "filename": file.filename
            }
        })
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing mood: {str(e)}")
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)

@app.post("/reconstruct-context")
async def reconstruct_context_endpoint(file: UploadFile = File(...)):
    """
    Extract text from image and reconstruct context for incomplete/fragmented text.
    
    Args:
        file: Image file (PNG, JPG, JPEG)
    
    Returns:
        JSON response with original and reconstructed text
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    tmp_file_path = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_file_path = tmp_file.name
        
        # Initialize client
        client = genai.Client(api_key=MY_API_KEY)
        
        # First extract text
        extracted_text = extract_text_from_image(client, tmp_file_path)
        
        # Then reconstruct context
        reconstruction_data = reconstruct_context(client, tmp_file_path, extracted_text)
        
        return JSONResponse(content={
            "status": "success",
            "data": {
                "original_text": extracted_text,
                "reconstruction": reconstruction_data,
                "filename": file.filename
            }
        })
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reconstructing context: {str(e)}")
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)

@app.post("/process-enhanced")
async def process_image_enhanced(file: UploadFile = File(...)):
    """
    Process uploaded handwritten document with ALL features including new enhancements.
    
    Args:
        file: Image file (PNG, JPG, JPEG)
    
    Returns:
        JSON response with complete analysis including:
        - Text extraction and processing (original pipeline)
        - Text type detection
        - Mood analysis
        - Context reconstruction
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    tmp_file_path = None
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_file_path = tmp_file.name
        
        # Initialize client
        client = genai.Client(api_key=MY_API_KEY)
        
        # Step 1: Text Type Detection
        text_type = detect_text_type(client, tmp_file_path)
        
        # Step 2: Text Extraction
        extracted_text = extract_text_from_image(client, tmp_file_path)
        
        # Step 3: Context Reconstruction
        reconstruction_data = reconstruct_context(client, tmp_file_path, extracted_text)
        reconstructed_text = reconstruction_data.get('reconstructed_text', extracted_text)
        
        # Step 4: Translation and Processing (using reconstructed text)
        translated_english_text = translate_to_english_initial(client, reconstructed_text)
        corrected_text = correct_and_enrich_text(client, translated_english_text)
        fully_translated_text = translate_non_english_words(corrected_text, client)
        final_summary = generate_summary_and_keywords(fully_translated_text, client)
        
        # Step 5: Mood Analysis (if handwritten)
        mood_data = None
        if "handwritten" in text_type.lower():
            try:
                mood_data = analyze_mood_from_handwriting(client, tmp_file_path)
            except Exception as e:
                mood_data = {"error": f"Mood analysis failed: {str(e)}"}
        
        # Calculate statistics
        word_count = len(fully_translated_text.split())
        char_count = len(fully_translated_text)
        
        return JSONResponse(content={
            "status": "success",
            "data": {
                "text_type": text_type,
                "extracted_text": extracted_text,
                "context_reconstruction": reconstruction_data,
                "corrected_text": corrected_text,
                "fully_translated_text": fully_translated_text,
                "summary_and_keywords": final_summary,
                "mood_analysis": mood_data,
                "statistics": {
                    "character_count": char_count,
                    "word_count": word_count
                }
            }
        })
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)

# ==============================================================================
# EXISTING ENDPOINTS (UNCHANGED)
# ==============================================================================

@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Handwriting Processing API with TTS",
        "version": "2.1.0",
        "endpoints": {
            "/process": "POST - Upload and process handwritten document image (original)",
            "/process-enhanced": "POST - Process with all new features (text type, mood, context reconstruction)",
            "/process-with-tts": "POST - Process image and generate audio",
            "/detect-text-type": "POST - Detect if text is handwritten or typed",
            "/analyze-mood": "POST - Analyze mood from handwriting",
            "/reconstruct-context": "POST - Reconstruct context from fragmented text",
            "/tts/generate": "POST - Generate audio from text",
            "/tts/detect-language": "POST - Detect language of text",
            "/tts/voices": "GET - Get available TTS voices",
            "/health": "GET - Check API health status"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "Handwriting Processing API with TTS v2.1"}

@app.post("/process")
async def process_image(file: UploadFile = File(...)):
    """
    Process uploaded handwritten document image (ORIGINAL ENDPOINT - UNCHANGED).
    
    Args:
        file: Image file (PNG, JPG, JPEG)
    
    Returns:
        JSON response with extracted text, translations, and summary
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    tmp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            shutil.copyfileobj(file.file, tmp_file)
            tmp_file_path = tmp_file.name
        
        result = process_uploaded_image(tmp_file_path)
        
        return JSONResponse(content=result)
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    finally:
        if tmp_file_path and os.path.exists(tmp_file_path):
            os.remove(tmp_file_path)

# ==============================================================================
# RUN SERVER
# ==============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
                
