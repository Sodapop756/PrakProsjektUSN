// academiAI Safety Filters
const SafetyFilters = {
    blockedTerms: [
        // Personal information
        'my social security', 'social security number', 'ssn',
        'my credit card', 'credit card number', 'ccn',
        'my password', 'my email password',
        'my address is', 'home address',
        'phone number', 'mobile number',
        'student id', 'university id',
        
        // Academic dishonesty
        'do my homework', 'write my essay', 'complete my assignment',
        'take my exam', 'cheat on', 'plagiarize',
        'write this paper for me', 'do this for me',
        'give me the answer', 'provide the solution',
        
        // Dangerous/inappropriate
        'how to hack', 'make a bomb', 'illegal drugs',
        'harmful instructions', 'dangerous content',
        
        // Sensitive topics beyond scope
        'medical advice', 'medical diagnosis',
        'legal advice', 'legal consultation',
        'financial advice', 'investment advice',
        'therapeutic advice', 'counseling'
    ],

    redFlagPatterns: [
        /(?:write|create|make).{0,30}(?:entire|complete|full).{0,30}(?:essay|paper|thesis|dissertation|assignment|homework)/i,
        /(?:solve|answer).{0,30}(?:entire|complete|full).{0,30}(?:problem|question|exam|test).{0,30}for me/i,
        /(?:do|complete).{0,30}(?:my|this).{0,30}(?:work|task|assignment).{0,30}for me/i,
        /(?:give|tell|show).{0,30}me.{0,30}(?:all|the|every).{0,30}(?:answers?|solutions?)/i,
        /i (?:need|want).{0,30}(?:you to|someone to).{0,30}(?:write|create|make|do)/i
    ],

    checkMessageSafety(message) {
        const lowerMessage = message.toLowerCase().trim();
        
        // Check for empty or very short messages
        if (!message || message.trim().length < 2) {
            return {
                safe: false,
                reason: 'empty_message',
                message: "Please enter a meaningful question about responsible AI use."
            };
        }
        
        // Check blocked terms
        for (const term of this.blockedTerms) {
            if (lowerMessage.includes(term)) {
                return {
                    safe: false,
                    reason: 'blocked_term',
                    message: `I cannot process requests involving ${term}. Please ask about ethical AI use, study strategies, or academic guidelines instead.`
                };
            }
        }

        // Check red flag patterns
        for (const pattern of this.redFlagPatterns) {
            if (pattern.test(message)) {
                return {
                    safe: false,
                    reason: 'red_flag',
                    message: "I'm here to guide your learning, not do the work for you. Could you rephrase your question to focus on understanding concepts or learning strategies?"
                };
            }
        }

        // Check message length
        if (message.length > 500) {
            return {
                safe: false,
                reason: 'too_long',
                message: "Your message is too long. Please keep questions under 500 characters and focus on one topic at a time."
            };
        }

        // Check for excessive special characters (potential spam)
        const specialCharCount = (message.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
        if (specialCharCount > 10) {
            return {
                safe: false,
                reason: 'excessive_special_chars',
                message: "Your message contains too many special characters. Please rephrase your question clearly."
            };
        }

        // Check for repeated characters (potential spam)
        const repeatedPattern = /(.)\1{5,}/;
        if (repeatedPattern.test(message)) {
            return {
                safe: false,
                reason: 'repeated_chars',
                message: "Please rephrase your question without repeated characters."
            };
        }

        return { safe: true };
    },

    sanitizeInput(input) {
        // Basic HTML sanitization
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    },
    
    containsPersonalInfo(text) {
        const personalInfoPatterns = [
            // Email patterns
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
            
            // Phone number patterns
            /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,
            /\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/,
            /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/, // SSN-like
            
            // Explicit sharing patterns
            /\b(?:name|address|phone|email|id|password|ssn|credit card)\s*[:=]\s*.+/i,
            
            // Common personal identifiers
            /\b\d{4}\s*\d{4}\s*\d{4}\s*\d{4}\b/, // Credit card-like
            /\b\d{3}-\d{2}-\d{4}\b/ // SSN format
        ];
        
        return personalInfoPatterns.some(pattern => pattern.test(text));
    }
};

// Test function for development
if (typeof window !== 'undefined') {
    window.SafetyFilters = SafetyFilters;
    
    // Run self-test on load
    window.addEventListener('DOMContentLoaded', () => {
        console.log('Safety Filters loaded successfully');
        console.log('Running self-test...');
        
        const testCases = [
            { input: "What's your email?", expected: false },
            { input: "Do my homework please", expected: false },
            { input: "How can I use AI ethically?", expected: true }
        ];
        
        let passed = 0;
        testCases.forEach(test => {
            const result = SafetyFilters.checkMessageSafety(test.input);
            const success = (result.safe === test.expected);
            if (success) passed++;
            
            console.log(
                `${success ? '✅' : '❌'} "${test.input.substring(0, 20)}..." - ` +
                `Expected: ${test.expected}, Got: ${result.safe}`
            );
        });
        
        console.log(`Self-test: ${passed}/${testCases.length} passed`);
    });
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SafetyFilters;
}