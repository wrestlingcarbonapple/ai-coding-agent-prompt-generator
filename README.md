# AI Coding Prompt Generator

A lightweight, production-ready single page application for generating high-quality prompts for instructing AI agents to write professional, production-grade code.  
The app runs entirely client-side (HTML, CSS, JavaScript) and is fully compatible with GitHub Pages.

Available at [ai-coding-agent-prompt-generator](https://wrestlingcarbonapple.github.io/ai-coding-agent-prompt-generator/)

---

## Features

- Single page app with no build tools required.
- Form fields for every parameter in the reusable engineering prompt template.
- Popular preset options via datalists (frameworks, languages, architectures, patterns, test frameworks).
- Free-text entry for full flexibility.
- Automatic prompt generation in a clean, copy-friendly format.
- “Copy to clipboard” button with success/error feedback.
- Modern, responsive UI using pure CSS.
- Secure client-only execution with no backend dependencies.

---

## File Structure

    ├── index.html # Main UI and form structure
    ├── styles.css # Responsive layout and styling
    └── script.js # Prompt generator logic and clipboard handling

## Getting Started

Open `index.html` directly in any modern browser or host the files on GitHub Pages.

No build step, package manager, or server is required.

---

## Deploying to GitHub Pages

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under "Build and deployment", select:
   - Source: **Deploy from a branch**
   - Branch: e.g. **main**  
   - Folder: **/** (root)
4. Save.
5. Access the URL GitHub provides.

The application is fully static and will run immediately after deployment.

---

## Customization

You can edit:

- **Datalist values** in `index.html` to add frameworks, languages, patterns.
- **Styling tokens** in `styles.css` for colors, fonts, spacing.
- **Prompt construction rules** in `script.js` to enforce formatting styles or add new sections.

The app is designed for extension without refactoring.

---

## Browser Support

- Chrome (latest)
- Edge (latest)
- Firefox (latest)
- Safari (latest)

Clipboard API is supported in all major browsers; a fallback handler is included for older ones.
