# academiAI - Responsible AI Guide for Students

A functional website providing university students with guidance on using AI tools safely, responsibly, and academically honestly.

## Features
- Interactive AI assistant (DeepSeek API)
- Safety filters for academic integrity
- No personal data collection
- Interactive tutorial modules
- Responsive design (mobile & desktop)
- Privacy-first approach

## Quick Start

1. **Open in VS Code**
   - Clone or download this folder
   - Open in VS Code

2. **Install Live Server Extension**
   - Install "Live Server" by Ritwick Dey from VS Code extensions
   - Or use any local server of your choice

3. **Configure API Key**
   - Get a free API key from [DeepSeek](https://platform.deepseek.com/)
   - Open `config.js`
   - Replace `'your-api-key-here'` with your actual API key

4. **Run the Website**
   - Right-click `index.html`
   - Select "Open with Live Server"
   - Website opens at `http://localhost:5500`

## File Structure


## Pages
- **Home** (`index.html`) - AI assistant and overview
- **Tutorial** (`pages/tutorial.html`) - Interactive learning modules
- **Guidelines** (`pages/guidelines.html`) - AI usage guidelines
- **Resources** (`pages/resources.html`) - Additional resources

## API Configuration
The app uses DeepSeek API. To get started:
1. Visit https://platform.deepseek.com/
2. Sign up for free account
3. Generate API key in dashboard
4. Add key to `config.js`

## Demo Mode
If no API key is configured, the app runs in demo mode with limited responses.

## Safety Features
- Blocks requests for personal information
- Prevents providing complete answers
- Low temperature (0.1) for precise responses
- Academic integrity filters
- Rate limiting

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development
- Pure HTML/CSS/JavaScript
- No build process required
- No dependencies to install
- Works with any static file server

## License
Educational Use - Capstone Project