# AIGuideBook

Responsible AI guidance for university students — Capstone Project PRO1000.

## Purpose
A functional website giving students simple, trustworthy guidance on how to use AI tools safely, responsibly, and with academic integrity.

## Pages
- **Home** (`index.html`) — Overview and quick navigation
- **Tutorial** (`pages/tutorial.html`) — Four interactive scenario-based modules
- **Guidelines** (`pages/guidelines.html`) — Dos & don'ts, checklist, prompting examples
- **Resources** (`pages/resources.html`) — Curated external links and full FAQ

## Running the Site
1. Open the `AIGuideBook/` folder in VS Code
2. Install the **Live Server** extension (Ritwick Dey)
3. Right-click `index.html` → **Open with Live Server**
4. Site opens at `http://localhost:5500`

No build process, no dependencies, no API keys required.

## Folder Structure
```
AIGuideBook/
├── index.html              # Home page
├── README.md
├── pages/
│   ├── tutorial.html       # Interactive tutorial (4 modules)
│   ├── guidelines.html     # AI usage guidelines
│   └── resources.html      # Resources & FAQ
├── styles/
│   ├── main.css            # Base styles, variables, nav, footer
│   ├── components.css      # Page-specific components
│   └── responsive.css      # Media queries
├── scripts/
│   ├── main.js             # Nav, FAQ, accordion, checklist, footer year
│   ├── tutorial.js         # Tutorial module navigation & quiz logic
│   └── nav.js              # Reserved for future nav enhancements
├── assets/
│   ├── images/             # Images (placeholder — add as needed)
│   └── icons/              # Icons (placeholder — add as needed)
└── data/
    ├── faq-content.json    # FAQ content reference
    └── quiz-content.json   # Tutorial scenario content reference
```

> **Note on data/ folder:** The JSON files document content structure for reference. Content is currently written directly into HTML for simplicity and Live Server compatibility (no local fetch() issues). If the project moves to a server or build pipeline, these can be used to dynamically populate content.

## Additions vs. Task 4.2 Folder Structure
The following were added beyond the base 4.2 spec:
- `styles/responsive.css` — Separated from main.css for clarity
- `scripts/tutorial.js` — Tutorial-specific logic (module nav, quiz scoring)
- `data/` folder — JSON content reference files
- `styles/components.css` — Page-specific and reusable component styles

## Design Principles Applied
- **Gestalt:** Proximity (grouped related links), Similarity (consistent card styles), Figure/Ground (dark nav + light content), Continuity (consistent scroll layout)
- **UX Laws:** Fitts's Law (large CTA buttons), Hick's Law (minimal navigation choices), Jakob's Law (familiar nav pattern)
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigable, sufficient colour contrast

## Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## Team
Capstone project — PRO1000 Practical Project Work
