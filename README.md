# Emotion_Detection_in_Text 😃😢😡

Emotion_Detection_in_Text is a modern web application that leverages state-of-the-art Natural Language Processing (NLP) techniques to detect emotions in text. Featuring a Python Flask backend and a React/Next.js frontend, it provides a seamless, multi-platform experience for analyzing text emotions in various languages, complete with an intuitive user interface and Progressive Web App (PWA) support.

---

## 🚀 Introduction

Understanding emotions in textual data is critical for applications like sentiment analysis, customer feedback, and mental health support. **Emotion_Detection_in_Text** automatically identifies emotions expressed in user-provided text, making it a valuable tool for developers, researchers, and businesses.

---

## ✨ Features

- **Multi-language Support**: Detects emotions in texts written in various languages using translation and language detection tools.
- **Modern NLP Backbone**: Utilizes transformer-based models for accurate emotion classification.
- **Responsive UI**: Built with React/Next.js for a smooth user experience.
- **PWA Ready**: Installable as a Progressive Web App for offline and mobile-friendly usage.
- **Dark/Light Theme**: Easily switch between themes for optimal comfort.
- **Reusable UI Components**: Includes a suite of customizable and accessible UI elements.
- **CORS Enabled API**: Seamless integration between frontend and backend.

---

## 📱 INTERFACE AND OUTPUT 

## ➡️ OUTPUT 1
<img width="1919" height="1022" alt="image" src="https://github.com/user-attachments/assets/1399d8d8-5c89-4b44-bd23-92657849419d" />

---

## ➡️ OUTPUT 2
<img width="1919" height="1019" alt="image" src="https://github.com/user-attachments/assets/3ad39084-3ae4-4e68-adb8-ce56d3e1cd2a" />

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Emotion_Detection_in_Text.git
cd Emotion_Detection_in_Text
```

### 2. Backend Setup (Python/Flask)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
# If requirements.txt not provided:
pip install flask flask-cors transformers torch deep-translator langdetect
python app.py
```

### 3. Frontend Setup (React/Next.js)

```bash
cd ../frontend
npm install
npm run dev
```

---

## 📈 Usage

1. **Run the backend** on [http://localhost:5000](http://localhost:5000).
2. **Run the frontend** on [http://localhost:3000](http://localhost:3000).
3. Enter any text (in any supported language) in the web interface.
4. Click "Analyze" to view detected emotions.
5. Install the app on your device for PWA features!

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. [Fork the repository](https://github.com/your-username/Emotion_Detection_in_Text/fork)
2. Create a new branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please review our [CONTRIBUTING.md](CONTRIBUTING.md) if available.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> **Connect, analyze, and understand emotions in text with Emotion_Detection_in_Text!**

---

## 📁 Project Structure

```text
backend/
  └── app.py                # Flask backend API for emotion detection
frontend/
  └── components/
      ├── PWAInstaller.tsx        # PWA installation prompt
      ├── theme-provider.tsx      # Theme provider for dark/light mode
      └── ui/
          ├── accordion.tsx
          ├── alert-dialog.tsx
          ├── alert.tsx
          ├── aspect-ratio.tsx
          ├── avatar.tsx
          ├── badge.tsx
          └── breadcrumb.tsx
```

---

**Made with ❤️ by the Emotion_Detection_in_Text Team**

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
🔗 GitHub Repo: https://github.com/selvaganesh19/Emotion_Detection_in_Text
