// academiAI Interactive Tutorial
class InteractiveTutorial {
    constructor() {
        this.currentModule = 1;
        this.totalModules = 4;
        this.score = 0;
        this.completed = false;
        this.init();
    }

    init() {
        this.progressBar = document.getElementById('progress-bar');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.completeBtn = document.getElementById('complete-btn');

        this.setupEventListeners();
        this.updateProgress();
        this.showModule(this.currentModule);
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevModule());
        this.nextBtn.addEventListener('click', () => this.nextModule());
        this.completeBtn.addEventListener('click', () => this.completeTutorial());

        // Option button listeners
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.handleOptionClick(e);
            }
        });
    }

    showModule(moduleNumber) {
        // Hide all modules
        document.querySelectorAll('.tutorial-module').forEach(module => {
            module.classList.add('hidden');
        });

        // Show current module
        const currentModule = document.getElementById(`module-${moduleNumber}`);
        if (currentModule) {
            currentModule.classList.remove('hidden');
        }

        // Update button states
        this.prevBtn.disabled = moduleNumber === 1;
        
        if (moduleNumber === this.totalModules) {
            this.nextBtn.classList.add('hidden');
            this.completeBtn.classList.remove('hidden');
        } else {
            this.nextBtn.classList.remove('hidden');
            this.completeBtn.classList.add('hidden');
        }

        this.updateProgress();
    }

    handleOptionClick(event) {
        if (this.completed) return;
        
        const button = event.target;
        const isCorrect = button.getAttribute('data-correct') === 'true';
        const moduleId = button.closest('.tutorial-module').id;
        const moduleNum = parseInt(moduleId.split('-')[1]);
        const feedbackId = `feedback-${moduleNum}`;
        const feedback = document.getElementById(feedbackId);

        // Disable all options in this question after selection
        const options = button.parentElement.querySelectorAll('.option-btn');
        options.forEach(btn => {
            btn.disabled = true;
            btn.classList.remove('correct', 'incorrect');
            if (btn.getAttribute('data-correct') === 'true') {
                btn.classList.add('correct');
            } else if (btn === button) {
                btn.classList.add('incorrect');
            }
        });

        // Show feedback
        if (isCorrect) {
            feedback.textContent = this.getPositiveFeedback();
            feedback.className = 'feedback correct';
            this.score++;
        } else {
            feedback.textContent = this.getConstructiveFeedback();
            feedback.className = 'feedback incorrect';
        }

        // Mark module as completed
        this.markModuleCompleted(moduleNum);
    }

    getPositiveFeedback() {
        const feedbacks = [
            "Excellent choice! This demonstrates responsible AI use while maintaining academic integrity.",
            "Great thinking! This approach uses AI as a learning tool rather than a shortcut.",
            "Correct! You're showing good judgment about ethical AI boundaries.",
            "Well done! This is an example of using AI responsibly to enhance learning.",
            "Perfect! This maintains academic honesty while leveraging AI assistance."
        ];
        return feedbacks[Math.floor(Math.random() * feedbacks.length)];
    }

    getConstructiveFeedback() {
        const feedbacks = [
            "Let's think about this differently. Consider how you can use AI to learn, not to avoid learning.",
            "This approach might compromise academic integrity. Think about how to use AI as a guide rather than a solution provider.",
            "There's a more ethical approach. Remember: AI should help you understand, not do the work for you.",
            "Consider the learning outcome. Using AI this way might prevent you from developing important skills.",
            "Think about academic integrity. A better approach would focus on using AI to enhance your understanding."
        ];
        return feedbacks[Math.floor(Math.random() * feedbacks.length)];
    }

    markModuleCompleted(moduleNum) {
        const moduleElement = document.getElementById(`module-${moduleNum}`);
        if (moduleElement) {
            moduleElement.classList.add('completed');
            
            // Update progress indicator
            const progressLabel = document.querySelectorAll('.progress-labels span')[moduleNum - 1];
            if (progressLabel) {
                progressLabel.style.color = 'var(--success-color)';
                progressLabel.style.fontWeight = 'bold';
            }
        }
    }

    prevModule() {
        if (this.currentModule > 1) {
            this.currentModule--;
            this.showModule(this.currentModule);
        }
    }

    nextModule() {
        if (this.currentModule < this.totalModules) {
            this.currentModule++;
            this.showModule(this.currentModule);
        }
    }

    updateProgress() {
        const progressPercentage = (this.currentModule / this.totalModules) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progressPercentage}%`;
        }
    }

    completeTutorial() {
        if (this.completed) return;
        
        this.completed = true;
        this.completeBtn.disabled = true;
        this.completeBtn.textContent = 'Completed!';
        
        // Calculate percentage score
        const percentage = Math.round((this.score / this.totalModules) * 100);
        
        // Create completion message
        const completionHTML = `
            <div class="completion-message">
                <h3>Tutorial Complete! 🎓</h3>
                <div class="score">${percentage}%</div>
                <p>You answered ${this.score} out of ${this.totalModules} scenarios correctly.</p>
                
                <div class="key-points">
                    <h4>Key Takeaways:</h4>
                    <ul>
                        <li><strong>AI is a tool, not a replacement</strong> for learning and critical thinking</li>
                        <li><strong>Always verify</strong> AI-generated information with credible sources</li>
                        <li><strong>Never share personal or sensitive information</strong> with AI tools</li>
                        <li><strong>Use AI to enhance understanding</strong>, not to bypass learning</li>
                        <li><strong>Follow your institution's specific policies</strong> on AI use</li>
                    </ul>
                </div>
                
                <p style="margin-top: 2rem;">
                    <a href="../index.html" class="cta-button">Return to Home</a>
                    <a href="guidelines.html" class="cta-button" style="background: var(--primary-color); margin-left: 1rem;">Review Guidelines</a>
                </p>
            </div>
        `;
        
        // Insert completion message
        const tutorialContent = document.querySelector('.tutorial-content .container');
        if (tutorialContent) {
            tutorialContent.insertAdjacentHTML('beforeend', completionHTML);
            
            // Scroll to completion message
            setTimeout(() => {
                const completionElement = document.querySelector('.completion-message');
                if (completionElement) {
                    completionElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
        
        // Play success sound if available
        this.playCompletionSound();
        
        // Log completion
        console.log(`Tutorial completed with score: ${this.score}/${this.totalModules} (${percentage}%)`);
    }

    playCompletionSound() {
        // Create a simple success sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            // Audio not supported or blocked - silent fail
        }
    }
}

// Initialize tutorial when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tutorial = new InteractiveTutorial();
    console.log('Interactive Tutorial initialized');
});