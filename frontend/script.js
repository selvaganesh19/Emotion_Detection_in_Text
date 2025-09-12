class EmotionApp {
    constructor() {
        this.deferredPrompt = null;
        this.gradioClient = null;
        this.initElements();
        this.attachListeners();
        this.initPWA();
        this.initGradioClient();
    }

    async initGradioClient() {
        try {
            const { Client } = await import('https://cdn.jsdelivr.net/npm/@gradio/client@1.18.0/+esm');
            this.gradioClient = await Client.connect("selva1909/Emotion-Detection-in-Text");
            console.log('AI model connected successfully');
            this.showNotification('AI model ready!', 'success');
        } catch (error) {
            console.log('Failed to connect to AI model:', error);
            this.gradioClient = null;
            this.showNotification('AI model unavailable. Please try again later.', 'error');
        }
    }

    initElements() {
        this.textInput = document.getElementById('textInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.btnText = document.getElementById('btnText');
        this.spinner = document.getElementById('loadingSpinner');
        this.charCount = document.getElementById('charCount');
        this.results = document.getElementById('results');
        this.emotionResult = document.getElementById('emotionResult');
        this.confidenceScore = document.getElementById('confidenceScore');
        this.emotionIcon = document.getElementById('emotionIcon');
        this.installBtn = document.getElementById('installBtn');
        this.installToast = document.getElementById('installToast');
        this.installToastBtn = document.getElementById('installToastBtn');
        this.dismissToastBtn = document.getElementById('dismissToastBtn');
    }

    attachListeners() {
        this.textInput.addEventListener('input', () => this.handleInput());
        this.analyzeBtn.addEventListener('click', () => this.analyzeEmotion());

        if (this.installBtn) this.installBtn.addEventListener('click', () => this.installApp());
        if (this.installToastBtn) this.installToastBtn.addEventListener('click', () => this.installApp());
        if (this.dismissToastBtn) this.dismissToastBtn.addEventListener('click', () => this.hideToast());

        window.addEventListener('online', () => this.handleOnline());
    }

    handleInput() {
        const text = this.textInput.value.trim();
        const length = text.length;
        
        this.charCount.textContent = length;
        
        if (length > 450) {
            this.charCount.style.color = '#f56565';
        } else if (length > 350) {
            this.charCount.style.color = '#ed8936';
        } else {
            this.charCount.style.color = '#718096';
        }
        
        this.analyzeBtn.disabled = length === 0;
        
        if (length === 0) {
            this.hideResults();
        }
    }

    async analyzeEmotion() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showNotification('Please enter some text to analyze.', 'warning');
            return;
        }

        if (!this.gradioClient) {
            this.showNotification('AI model not available. Please refresh the page.', 'error');
            return;
        }

        this.setLoading(true);
        this.hideResults();

        try {
            const result = await this.callGradioAPI(text);
            this.displayResults(result);
            this.showNotification('Analysis completed successfully!', 'success');
        } catch (error) {
            console.error('Analysis failed:', error);
            this.showNotification('Analysis failed. Please try again.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    async callGradioAPI(text) {
        try {
            const result = await this.gradioClient.predict("/predict", { 
                user_input: text 
            });
            
            console.log('Raw API Response:', result.data);
            
            let emotion = 'neutral';
            let confidence = 0.0;
            
            if (result.data && result.data.length > 0) {
                const prediction = result.data[0];
                console.log('Prediction:', prediction);
                
                // Handle different response formats
                if (typeof prediction === 'string') {
                    emotion = this.parseEmotion(prediction);
                    confidence = 0.85; // Default confidence for string responses
                } else if (typeof prediction === 'object') {
                    // If it's an object with emotion data
                    if (prediction.label) {
                        emotion = this.parseEmotion(prediction.label);
                        confidence = prediction.score || prediction.confidence || 0.8;
                    } else if (prediction.emotion) {
                        emotion = this.parseEmotion(prediction.emotion);
                        confidence = prediction.confidence || 0.8;
                    } else {
                        // If it's an array of predictions, take the highest confidence
                        const topPrediction = this.getTopPrediction(prediction);
                        emotion = topPrediction.emotion;
                        confidence = topPrediction.confidence;
                    }
                } else if (Array.isArray(prediction)) {
                    // If prediction is an array of emotion scores
                    const topPrediction = this.getTopPrediction(prediction);
                    emotion = topPrediction.emotion;
                    confidence = topPrediction.confidence;
                }
            }
            
            return {
                emotion: emotion,
                confidence: confidence,
                source: 'AI Model',
                rawResponse: result.data
            };
        } catch (error) {
            console.error('Gradio API Error:', error);
            throw new Error('AI analysis failed: ' + error.message);
        }
    }

    getTopPrediction(predictions) {
        // Handle array of predictions or object with emotion scores
        let maxScore = 0;
        let topEmotion = 'neutral';
        
        if (Array.isArray(predictions)) {
            predictions.forEach(pred => {
                if (pred.score > maxScore) {
                    maxScore = pred.score;
                    topEmotion = pred.label || pred.emotion;
                }
            });
        } else if (typeof predictions === 'object') {
            Object.entries(predictions).forEach(([emotion, score]) => {
                if (score > maxScore) {
                    maxScore = score;
                    topEmotion = emotion;
                }
            });
        }
        
        return {
            emotion: this.parseEmotion(topEmotion),
            confidence: maxScore
        };
    }

    parseEmotion(emotionString) {
        if (!emotionString) return 'neutral';
        
        const emotion = emotionString.toString().toLowerCase().trim();
        
        // Enhanced emotion mapping for common emotion detection models
        const emotionMappings = {
            // Positive emotions
            'joy': 'happy',
            'happiness': 'happy',
            'happy': 'happy',
            'positive': 'happy',
            'optimism': 'happy',
            'love': 'happy',
            'excitement': 'happy',
            'enthusiasm': 'happy',
            'gratitude': 'happy',
            'satisfaction': 'happy',
            'delight': 'happy',
            'pleasure': 'happy',
            
            // Negative emotions
            'sadness': 'sad',
            'sad': 'sad',
            'sorrow': 'sad',
            'grief': 'sad',
            'melancholy': 'sad',
            'depression': 'sad',
            'disappointment': 'sad',
            'despair': 'sad',
            'loneliness': 'sad',
            'negative': 'sad',
            
            // Anger emotions
            'anger': 'angry',
            'angry': 'angry',
            'rage': 'angry',
            'fury': 'angry',
            'irritation': 'angry',
            'annoyance': 'angry',
            'frustration': 'angry',
            'hostility': 'angry',
            'resentment': 'angry',
            'disgust': 'angry',
            'contempt': 'angry',
            'hate': 'angry',
            
            // Fear emotions
            'fear': 'fear',
            'afraid': 'fear',
            'anxiety': 'fear',
            'worry': 'fear',
            'panic': 'fear',
            'terror': 'fear',
            'dread': 'fear',
            'nervousness': 'fear',
            'apprehension': 'fear',
            'concern': 'fear',
            
            // Surprise emotions
            'surprise': 'surprise',
            'surprised': 'surprise',
            'amazement': 'surprise',
            'astonishment': 'surprise',
            'wonder': 'surprise',
            'shock': 'surprise',
            'bewilderment': 'surprise',
            
            // Neutral
            'neutral': 'neutral',
            'calm': 'neutral',
            'peaceful': 'neutral',
            'indifferent': 'neutral'
        };
        
        // Direct mapping first
        if (emotionMappings[emotion]) {
            return emotionMappings[emotion];
        }
        
        // Partial matching for compound emotions or variations
        for (const [key, value] of Object.entries(emotionMappings)) {
            if (emotion.includes(key) || key.includes(emotion)) {
                return value;
            }
        }
        
        // If no match found, return neutral
        return 'neutral';
    }

    displayResults(result) {
        const { emotion, confidence, source, rawResponse } = result;
        
        console.log('Displaying results:', { emotion, confidence, source });
        
        const emotionIcons = {
            happy: '😊',
            sad: '😢',
            angry: '😠',
            fear: '😨',
            surprise: '😲',
            neutral: '😐'
        };

        const emotionLabels = {
            happy: 'Happy/Positive',
            sad: 'Sad/Negative',
            angry: 'Angry',
            fear: 'Fear/Anxiety',
            surprise: 'Surprise',
            neutral: 'Neutral'
        };

        this.emotionResult.textContent = emotionLabels[emotion] || this.capitalize(emotion);
        this.emotionResult.className = `emotion-result emotion-${emotion}`;
        
        const confidencePercent = Math.round(confidence * 100);
        this.confidenceScore.textContent = `Confidence: ${confidencePercent}% (${source})`;
        this.emotionIcon.textContent = emotionIcons[emotion] || '🤔';
        
        this.showResults();
    }

    showResults() {
        this.results.classList.remove('hidden');
        this.results.style.opacity = '0';
        this.results.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            this.results.style.transition = 'all 0.4s ease';
            this.results.style.opacity = '1';
            this.results.style.transform = 'translateY(0)';
        }, 10);
    }

    hideResults() {
        this.results.classList.add('hidden');
    }

    setLoading(isLoading) {
        if (isLoading) {
            this.analyzeBtn.disabled = true;
            this.btnText.textContent = '🤖 Analyzing...';
            this.spinner.classList.remove('hidden');
        } else {
            this.analyzeBtn.disabled = this.textInput.value.trim().length === 0;
            this.btnText.textContent = '🔍 Analyze Emotion';
            this.spinner.classList.add('hidden');
        }
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            warning: '#ed8936',
            info: '#4299e1'
        };

        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1001;
            animation: slideInDown 0.3s ease;
            max-width: 300px;
            font-weight: 500;
            font-size: 0.9rem;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    initPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('PWA ready'))
                .catch(err => console.log('PWA registration failed'));
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            if (this.installBtn) this.installBtn.classList.remove('hidden');
            
            setTimeout(() => {
                if (!this.isInstalled() && this.installToast) {
                    this.installToast.classList.remove('hidden');
                }
            }, 10000);
        });

        window.addEventListener('appinstalled', () => {
            this.hideInstallElements();
            this.showNotification('App installed successfully!', 'success');
        });

        if (this.isInstalled()) {
            this.hideInstallElements();
        }
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const choiceResult = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
            this.hideInstallElements();
        }
    }

    hideInstallElements() {
        if (this.installBtn) this.installBtn.classList.add('hidden');
        this.hideToast();
    }

    hideToast() {
        if (this.installToast) this.installToast.classList.add('hidden');
    }

    isInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone;
    }

    handleOnline() {
        if (!this.gradioClient) {
            this.initGradioClient();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new EmotionApp();
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(style);