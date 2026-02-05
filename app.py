import os
from google import genai
from google.genai.errors import APIError
from PIL import Image

# ==============================================================================
# CONFIGURATION
# ==============================================================================
IMAGE_FILE = 'images/lincon.png'
MY_API_KEY = "AIzaSyDDDo-W-7sCbuzRun7wRa0lswCcKDBQKho"

# ==============================================================================
# STEP 1: EXTRACTION (From Script 1)
# ==============================================================================

def extract_text_from_image(client, image_path):
    """Step 1: Uses Gemini to perform OCR and extract text from the image."""
    print("\n--- STEP 1: Extracting Text (OCR) from Image ---")
    
    if not os.path.exists(image_path):
        print(f"❌ Error: Image file not found at '{image_path}'")
        return None

    try:
        img = Image.open(image_path)
        prompt = "Transcribe the handwritten text in this image accurately. Do not add any commentary."
        
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=[prompt, img]
        )
        extracted_text = response.text.strip()
        print(f"   Extracted Text: '{extracted_text}'")
        return extracted_text

    except APIError as e:
        print(f"❌ Gemini API Error during text extraction: {e}")
        return None
    except Exception as e:
        print(f"❌ General Error during text extraction: {e}")
        return None

def translate_to_english_initial(client, text_to_translate):
    """Step 2: Detects language and translates the extracted text to English."""
    if not text_to_translate:
        return None

    print("\n--- STEP 2: Translating to English ---")
    
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
        print(f"   Translated Text: '{translated_text}'")
        return translated_text
    
    except APIError as e:
        print(f"❌ Gemini API Error during translation: {e}")
        return text_to_translate
    except Exception as e:
        print(f"❌ General Error during translation: {e}")
        return text_to_translate

def correct_and_enrich_text(client, clean_english_text):
    """Step 3: Corrects and polishes the clean English text."""
    if not clean_english_text:
        return "Correction skipped: No text to process."

    print("\n--- STEP 3: Correcting and Enriching English Text ---")
    
    correction_prompt = (
        "You are a meticulous copywriter. "
        "Review the following text for factual accuracy, grammatical errors, and logical flow. "
        "Correct any issues and return a single, polished paragraph."
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
        print(f"❌ Gemini API Error during correction: {e}")
        return "Correction failed due to API error."
    except Exception as e:
        print(f"❌ General Error during correction: {e}")
        return "Correction failed."

# ==============================================================================
# STEP 2: TRANSLATOR (From Script 2)
# ==============================================================================

def translate_non_english_words(text, client):
    """Translate non-English words in the corrected text."""
    print("\n--- STEP 4: Translating Non-English Words ---")
    
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
        print(f"   Translated Text: '{translated_text}'")
        return translated_text
    except APIError as e:
        print(f"❌ Gemini API Error during word translation: {e}")
        return text
    except Exception as e:
        print(f"❌ General Error during word translation: {e}")
        return text

# ==============================================================================
# STEP 3: SUMMARIZER (From Script 3)
# ==============================================================================

def generate_summary_and_keywords(text, client):
    """Generate summary and important keywords using Gemini API."""
    print("\n--- STEP 5: Generating Summary and Keywords ---")
    
    prompt = f"""You are an expert document analyst. Analyze the following text and provide a structured summary.

**DOCUMENT TEXT:**
{text}

**YOUR TASK:**
Provide a clear, structured analysis in exactly this format:

**SUMMARY:**
Write a comprehensive 4-5 sentence summary that captures the main theme, purpose, and key takeaways of this document.

**IMPORTANT KEYWORDS:**
List 10-15 of the most important keywords, terms, and concepts as bullet points. Focus on:
- Technical terms and specialized vocabulary
- Key topics and themes
- Important names (people, places, organizations)
- Critical concepts or ideas
- Subject-specific terminology

Format each keyword as a bullet point with a brief 1-line explanation of why it's important.

Example format:
- **Keyword** - Brief explanation of its significance in the document

Keep it concise and focused. Begin your analysis now:"""
    
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except APIError as e:
        print(f"❌ Gemini API Error during summarization: {e}")
        return "Summarization failed due to API error."
    except Exception as e:
        print(f"❌ General Error during summarization: {e}")
        return "Summarization failed."

def save_final_report(extracted_text, corrected_text, translated_text, summary, output_file='final_summary_report.txt'):
    """Generate final comprehensive report."""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("="*100 + "\n")
        f.write(" "*25 + "HANDWRITTEN DOCUMENT ANALYSIS - FINAL REPORT\n")
        f.write("="*100 + "\n\n")
        
        f.write("📋 DOCUMENT INFORMATION\n")
        f.write("-"*100 + "\n")
        f.write(f"Source File: {IMAGE_FILE}\n")
        f.write(f"Text Length: {len(translated_text)} characters, {len(translated_text.split())} words\n")
        f.write("\n\n")
        
        f.write("📄 EXTRACTED TEXT\n")
        f.write("-"*100 + "\n")
        f.write(extracted_text)
        f.write("\n\n")
        
        f.write("📄 CORRECTED TEXT\n")
        f.write("-"*100 + "\n")
        f.write(corrected_text)
        f.write("\n\n")
        
        f.write("📄 FULLY TRANSLATED TEXT (English)\n")
        f.write("-"*100 + "\n")
        f.write(translated_text)
        f.write("\n\n")
        
        f.write("🤖 AI-GENERATED ANALYSIS\n")
        f.write("-"*100 + "\n")
        f.write(summary)
        f.write("\n\n")
        
        f.write("="*100 + "\n")
        f.write(" "*40 + "END OF REPORT\n")
        f.write("="*100 + "\n")

# ==============================================================================
# MAIN INTEGRATED WORKFLOW
# ==============================================================================

def main_integrated_workflow():
    """Runs the complete integrated pipeline."""
    print("="*100)
    print(" "*30 + "INTEGRATED HANDWRITING PROCESSING PIPELINE")
    print("="*100)
    
    try:
        client = genai.Client(api_key=MY_API_KEY)
    except Exception as e:
        print(f"❌ Error initializing Gemini Client: {e}")
        return
    
    # 1. Extract Text (OCR) from Script 1
    extracted_text = extract_text_from_image(client, IMAGE_FILE)
    if not extracted_text:
        return
    
    # 2. Initial Translation from Script 1
    translated_english_text = translate_to_english_initial(client, extracted_text)
    if not translated_english_text:
        return

    # 3. Correct/Enrich the English Text from Script 1
    corrected_text = correct_and_enrich_text(client, translated_english_text)
    
    # 4. Translate Non-English Words from Script 2
    fully_translated_text = translate_non_english_words(corrected_text, client)
    
    # 5. Generate Summary from Script 3
    final_summary = generate_summary_and_keywords(fully_translated_text, client)
    
    print("\n=============================================")
    print("             ✨ FINAL SUMMARY ✨")
    print("=============================================")
    print(final_summary)
    print("=============================================")
    
    # Save complete report
    save_final_report(extracted_text, corrected_text, fully_translated_text, final_summary)
    print(f"\n✓ Complete report saved to 'final_summary_report.txt'")
    
    print("\n" + "="*100)
    print(" "*35 + "🎉 PIPELINE COMPLETE! 🎉")
    print("="*100)

if __name__ == "__main__":
    main_integrated_workflow()