// academiAI Configuration
// IMPORTANT: Replace with your actual DeepSeek API key
const academiAIConfig = {
    // DeepSeek API Configuration
    deepseek: {
        apiKey: 'sk-d6cd8f0f861fb010876014034dda', // ← REPLACE THIS WITH YOUR KEY
        apiUrl: 'https://api.deepseek.com/v1/chat/completions',
        model: 'deepseek-chat',
        temperature: 0.1,
        maxTokens: 500,
    },
    
    // System prompts
    systemPrompts: {
        default: `You are academiAI, an AI assistant designed to help university students use AI tools responsibly in their studies.

CRITICAL RULES:
1. NEVER provide complete answers, solutions, or finished work
2. NEVER ask for or accept personal information
3. ALWAYS encourage critical thinking and independent learning
4. ALWAYS remind users to verify information from credible sources
5. ALWAYS maintain academic integrity in your responses

Your role is to GUIDE, not DO. Provide:
- Conceptual explanations
- Study strategies
- Ethical considerations
- Verification methods
- Critical thinking prompts

Temperature setting: 0.1 (be precise, factual, and conservative)
Format responses for easy reading with clear structure.`
    },
    
    // Limits
    limits: {
        maxMessagesPerSession: 50,
        timeoutBetweenMessages: 1000,
        maxCharactersPerMessage: 500
    }
};

// Test if API key is set
function checkAPIKey() {
    const isConfigured = academiAIConfig.deepseek.apiKey && 
                        academiAIConfig.deepseek.apiKey !== 'your-api-key-here' &&
                        academiAIConfig.deepseek.apiKey.length > 20;
    
    console.log(`API Configuration: ${isConfigured ? '✅ Ready' : '⚠️ Not Configured'}`);
    return isConfigured;
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    const apiConfigured = checkAPIKey();
    const statusElement = document.getElementById('api-status');
    const warningElement = document.getElementById('config-warning');
    
    if (statusElement) {
        statusElement.textContent = apiConfigured ? 'API: Configured ✅' : 'API: Not Configured ⚠️';
        statusElement.style.color = apiConfigured ? '#27ae60' : '#e74c3c';
    }
    
    if (warningElement) {
        warningElement.style.display = apiConfigured ? 'none' : 'block';
    }
});
