// academiAI Chat with DeepSeek Integration
class academiAIChat {
    constructor() {
        this.chatHistory = [];
        this.isProcessing = false;
        this.messageCount = 0;
        this.systemPrompt = academiAIConfig.systemPrompts.default;
        this.apiConfigured = false;
        this.init();
    }

    init() {
        this.messageContainer = document.getElementById('chat-messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.charCount = document.getElementById('char-count');
        this.tempIndicator = document.querySelector('.temp-indicator');
        this.apiStatus = document.getElementById('api-status');

        this.setupEventListeners();
        this.loadInitialGreeting();
        this.updateTemperatureDisplay();
        this.checkAPIConfig();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.userInput.addEventListener('input', () => {
            const length = this.userInput.value.length;
            this.charCount.textContent = `${length}/${academiAIConfig.limits.maxCharactersPerMessage}`;
            
            if (length > 400) {
                this.charCount.style.color = 'var(--warning-color)';
            } else {
                this.charCount.style.color = '';
            }
        });
    }

    checkAPIConfig() {
        const apiKey = academiAIConfig.deepseek.apiKey;
        this.apiConfigured = apiKey && 
                            apiKey !== 'your-api-key-here' && 
                            apiKey.length > 20;
        
        if (this.apiStatus) {
            this.apiStatus.textContent = this.apiConfigured ? 
                'API: Configured ✅' : 'API: Not Configured ⚠️';
            this.apiStatus.style.color = this.apiConfigured ? 
                'var(--success-color)' : 'var(--warning-color)';
        }
        
        console.log(`API ${this.apiConfigured ? 'configured' : 'not configured'}. Running in ${this.apiConfigured ? 'full' : 'demo'} mode.`);
    }

    loadInitialGreeting() {
        const greeting = this.apiConfigured ? 
            "Hello! I'm academiAI, powered by DeepSeek. I'm here to help you use AI tools responsibly in your studies. I'll provide guidance, explanations, and strategies, but I won't do your work for you. What would you like to learn about ethical AI use?" :
            "Hello! I'm academiAI (Demo Mode). I'm here to help you understand responsible AI use in your studies. Add your DeepSeek API key to config.js for full functionality. What would you like to know about ethical AI use?";
        
        this.addMessage(greeting, 'bot');
        this.chatHistory.push({
            role: 'assistant',
            content: greeting
        });
    }

    updateTemperatureDisplay() {
        if (this.tempIndicator) {
            this.tempIndicator.textContent = `Temperature: ${academiAIConfig.deepseek.temperature} (Precise Mode)`;
        }
    }

    async sendMessage() {
        if (this.isProcessing) {
            this.showNotification("Please wait for my response before sending another message.", 'warning');
            return;
        }

        const userMessage = this.userInput.value.trim();
        if (!userMessage) {
            this.showNotification("Please enter a message.", 'warning');
            return;
        }

        if (userMessage.length > academiAIConfig.limits.maxCharactersPerMessage) {
            this.showNotification(`Message too long. Please keep under ${academiAIConfig.limits.maxCharactersPerMessage} characters.`, 'error');
            return;
        }

        this.messageCount++;
        if (this.messageCount > academiAIConfig.limits.maxMessagesPerSession) {
            this.showNotification("You've reached the maximum number of messages for this session. Please refresh the page to continue.", 'error');
            return;
        }

        // Add user message to chat
        this.addMessage(userMessage, 'user');
        this.chatHistory.push({
            role: 'user',
            content: userMessage
        });
        
        this.userInput.value = '';
        this.charCount.textContent = `0/${academiAIConfig.limits.maxCharactersPerMessage}`;
        this.sendButton.disabled = true;

        // Show loading indicator
        const loadingId = this.showLoading();
        this.isProcessing = true;

        try {
            // Apply safety filters
            const safetyCheck = SafetyFilters.checkMessageSafety(userMessage);
            
            if (!safetyCheck.safe) {
                this.removeLoading(loadingId);
                this.addMessage(safetyCheck.message, 'bot');
                this.chatHistory.push({
                    role: 'assistant',
                    content: safetyCheck.message
                });
                this.isProcessing = false;
                this.sendButton.disabled = false;
                return;
            }

            // Get AI response
            let aiResponse;
            if (this.apiConfigured) {
                aiResponse = await this.getDeepSeekResponse(userMessage);
            } else {
                aiResponse = this.getDemoResponse(userMessage);
            }
            
            this.removeLoading(loadingId);
            
            // Process and display response
            const processedResponse = this.processAIResponse(aiResponse);
            this.addMessage(processedResponse, 'bot');
            
            this.chatHistory.push({
                role: 'assistant',
                content: processedResponse
            });

        } catch (error) {
            console.error('Error:', error);
            this.removeLoading(loadingId);
            
            const errorMessage = this.handleAPIError(error);
            this.addMessage(errorMessage, 'bot');
            
            this.chatHistory.push({
                role: 'assistant',
                content: errorMessage
            });
        } finally {
            this.isProcessing = false;
            this.sendButton.disabled = false;
        }
    }

    async getDeepSeekResponse(userMessage) {
        if (!this.apiConfigured) {
            return this.getDemoResponse(userMessage);
        }

        // Prepare messages for API
        const messages = [
            {
                role: 'system',
                content: this.systemPrompt
            },
            ...this.chatHistory.slice(-8) // Keep last 8 messages for context
        ];

        const requestBody = {
            model: academiAIConfig.deepseek.model,
            messages: messages,
            temperature: academiAIConfig.deepseek.temperature,
            max_tokens: academiAIConfig.deepseek.maxTokens,
            stream: false
        };

        try {
            const response = await fetch(academiAIConfig.deepseek.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${academiAIConfig.deepseek.apiKey}`
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices[0]) {
                return data.choices[0].message.content;
            } else {
                throw new Error('Invalid response format from API');
            }

        } catch (error) {
            console.error('DeepSeek API Error:', error);
            throw error;
        }
    }

    getDemoResponse(userMessage) {
        // Demo responses for when API is not configured
        const lowerMessage = userMessage.toLowerCase();
        
        const demoResponses = {
            ethical: `**Ethical AI Use in Academia**

In demo mode. With full API access, I'd provide detailed guidance on:

1. **Understanding Boundaries**
   - AI as a learning aid, not a shortcut
   - Where to draw the line between help and cheating
   - Institutional policies you should follow

2. **Proper Citation**
   - How to acknowledge AI assistance
   - Different citation styles for AI-generated content
   - What constitutes proper attribution

3. **Learning Enhancement**
   - Using AI for brainstorming and outlining
   - Getting explanations for difficult concepts
   - Practice questions and self-testing

**Remember**: Always verify AI-generated information with credible sources and consult your instructors about specific course policies.`,
            
            privacy: `**Privacy Protection with AI Tools**

In demo mode. With full API access, I'd explain:

1. **Never Share Personally Identifiable Information (PII)**
   - Names, addresses, phone numbers
   - Student IDs, social security numbers
   - Financial or medical information

2. **Understand Data Usage Policies**
   - How different AI platforms use your data
   - Opt-out options where available
   - Data retention periods

3. **Best Practices**
   - Use generic examples instead of personal ones
   - Assume all conversations could be reviewed
   - Be cautious with sensitive research data

**Always check the privacy policy of any AI tool before use.**`,
            
            prompting: `**Effective and Ethical Prompting**

In demo mode. With full API access, I'd teach:

**Good Prompts (Ethical):**
- "Explain the concept of photosynthesis in simple terms"
- "Suggest an outline for an essay about renewable energy"
- "What are the key arguments for and against this theory?"
- "Help me understand where I went wrong in this calculation"

**Problematic Prompts (Unethical):**
- "Write my 1000-word essay on climate change"
- "Solve all these math problems for me"
- "Do my homework assignment about Shakespeare"

**Tips:**
- Be specific about what you want to learn
- Ask for explanations, not answers
- Request step-by-step guidance, not solutions
- Focus on understanding concepts

**Good learning comes from the process, not just the product.**`,
            
            default: `**Responsible AI Use Guidelines**

In demo mode. Add your DeepSeek API key to config.js for detailed, personalized guidance.

**Core Principles:**
1. **AI as a Tool, Not a Replacement** - Use AI to enhance your learning, not replace it
2. **Critical Verification** - Always fact-check AI-generated information
3. **Academic Integrity** - Follow your institution's specific policies
4. **Privacy First** - Never share personal or sensitive information
5. **Transparent Use** - Acknowledge when and how you've used AI assistance

**Common Use Cases:**
- Brainstorming ideas and approaches
- Understanding complex concepts
- Getting feedback on your work
- Practice questions and explanations
- Research assistance and organization

**Remember**: The goal is learning and understanding, not just completing assignments. AI should help you become a better learner, not do the learning for you.`
        };

        // Keyword matching for demo responses
        if (lowerMessage.includes('ethic') || lowerMessage.includes('integrity')) {
            return demoResponses.ethical;
        } else if (lowerMessage.includes('privac') || lowerMessage.includes('personal')) {
            return demoResponses.privacy;
        } else if (lowerMessage.includes('prompt') || lowerMessage.includes('ask ai')) {
            return demoResponses.prompting;
        } else if (lowerMessage.includes('hallucinat') || lowerMessage.includes('incorrect')) {
            return "AI can sometimes generate incorrect or 'hallucinated' information. Always verify important claims using credible academic sources. Look for consensus among multiple reliable sources and check references when provided.";
        } else if (lowerMessage.includes('cite') || lowerMessage.includes('reference')) {
            return "When using AI-generated content, you should cite it. Common formats include mentioning the AI tool, date accessed, and your prompt. However, specific requirements vary by institution - always check your course guidelines.";
        } else {
            return demoResponses.default;
        }
    }

    processAIResponse(response) {
        // Post-process AI response
        let processed = response;
        
        // Clean up markdown formatting
        processed = processed.replace(/\*\*(.*?)\*\*/g, '$1');
        processed = processed.replace(/\*(.*?)\*/g, '$1');
        
        // Ensure response ends with academic integrity reminder
        const hasReminder = processed.toLowerCase().includes('verify') || 
                           processed.toLowerCase().includes('check') ||
                           processed.toLowerCase().includes('consult');
        
        if (!hasReminder && processed.length > 100 && this.apiConfigured) {
            processed += "\n\n**Remember**: Always verify important information with credible academic sources and consult your institution's specific guidelines.";
        }
        
        // Limit response length
        if (processed.length > 1500) {
            processed = processed.substring(0, 1500) + "...\n\n[Response truncated for readability. Please ask more specific questions if needed.]";
        }
        
        return processed;
    }

    handleAPIError(error) {
        console.error('API Error:', error);
        
        if (error.message.includes('401') || error.message.includes('403')) {
            return "API authentication failed. Please check your API key in config.js. Running in demo mode for now.";
        } else if (error.message.includes('429')) {
            return "Rate limit exceeded. Please wait a moment before asking another question.";
        } else if (error.message.includes('network') || error.message.includes('Failed to fetch')) {
            return "Network error. Please check your internet connection. Running in demo mode.";
        } else {
            return "I'm having trouble connecting to the AI service. This might be a temporary issue. Here's some general advice: Always verify information from credible sources, never share personal data, and use AI as a learning tool rather than a shortcut.";
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const senderLabel = document.createElement('div');
        senderLabel.className = 'sender-label';
        senderLabel.textContent = sender === 'bot' ? 'academiAI' : 'You';
        
        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        
        // Format text with proper line breaks
        const formattedText = text.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
        messageText.innerHTML = formattedText;
        
        messageDiv.appendChild(senderLabel);
        messageDiv.appendChild(messageText);
        this.messageContainer.appendChild(messageDiv);
        
        // Scroll to bottom with smooth behavior
        this.messageContainer.scrollTo({
            top: this.messageContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading';
        loadingDiv.id = 'loading-' + Date.now();
        
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = this.apiConfigured ? 
            'Thinking about responsible guidance...' : 
            'Processing in demo mode...';
        
        const dots = document.createElement('div');
        dots.className = 'loading-dots';
        dots.innerHTML = '<span></span><span></span><span></span>';
        
        loadingDiv.appendChild(loadingText);
        loadingDiv.appendChild(dots);
        
        this.messageContainer.appendChild(loadingDiv);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        
        return loadingDiv.id;
    }

    removeLoading(loadingId) {
        const loadingElement = document.getElementById(loadingId);
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    showNotification(message, type = 'info') {
        if (typeof academiAIUtils !== 'undefined' && academiAIUtils.showNotification) {
            academiAIUtils.showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for config to load
    setTimeout(() => {
        if (typeof academiAIConfig === 'undefined') {
            console.error('Configuration not loaded. Make sure config.js is included before ai-guide.js');
            return;
        }
        
        window.academiAIChat = new academiAIChat();
        console.log('academiAI Chat initialized');
    }, 100);
});