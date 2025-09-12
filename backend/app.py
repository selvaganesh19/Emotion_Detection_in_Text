
import gradio as gr
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from deep_translator import GoogleTranslator
from langdetect import detect
import torch

# Load model & tokenizer
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

# Sentiment labels
emotion_labels = {
    0: "Negative 😕",
    1: "Neutral 😐",
    2: "Positive 🙂"
}

# Translator
translator = GoogleTranslator(source="auto", target="en")

def analyze_sentiment(user_input):
    # Detect language
    detected_language = detect(user_input)
    
    # Translate if not English
    translated_text = translator.translate(user_input) if detected_language != "en" else user_input
    
    # Tokenize
    inputs = tokenizer(translated_text, return_tensors="pt", truncation=True, padding=True, max_length=512)

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=-1).item()
    emotion = emotion_labels.get(predicted_class, "Unknown")

    # Return only predicted sentiment
    return emotion

# Build Gradio UI
iface = gr.Interface(
    fn=analyze_sentiment,
    inputs=gr.Textbox(lines=3, placeholder="Enter text in any language..."),
    outputs=gr.Label(label="Predicted Sentiment"),
    title="🌍 Multilingual Sentiment Analysis",
    description="Enter text in any language. The system will auto-detect, translate to English, and predict sentiment (Positive/Neutral/Negative)."
)

if __name__ == "__main__":
    iface.launch()