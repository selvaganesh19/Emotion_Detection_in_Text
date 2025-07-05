from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from deep_translator import GoogleTranslator
from langdetect import detect
import torch
import os

app = Flask(__name__)
CORS(app)

# Load the model and tokenizer
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)

# Emotion labels based on model output
emotion_labels = {
    0: "Negative 😕",
    1: "Neutral 😐",
    2: "Positive 🙂"
}

# Translator
translator = GoogleTranslator(source='auto', target='en')

# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    data = request.get_json()
    user_input = data.get('text', '')

    detected_language = detect(user_input)
    if detected_language != 'en':
        translated_text = translator.translate(user_input)
    else:
        translated_text = user_input

    inputs = tokenizer(translated_text, return_tensors="pt", truncation=True, padding=True, max_length=512)

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_class = torch.argmax(logits, dim=-1).item()

    emotion = emotion_labels.get(predicted_class, "Unknown")

    return jsonify({
        "original_text": user_input,
        "translated_text": translated_text,
        "detected_language": detected_language,
        "predicted_sentiment": emotion
    })

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory('.', 'manifest.json')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7071))  # Use the PORT environment variable provided by Render
    app.run(debug=True, host='0.0.0.0', port=port)
