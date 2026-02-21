# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Nach Dakwale, built as a static HTML/CSS/JavaScript site. The site showcases projects and features an interactive photo gallery. Content is shared via LinkedIn articles rather than an on-site blog.

## Development Commands

### Local Development
- **Serve locally**: Open `index.html` directly in a browser, or use any static file server
- **Simple Python server**: `python -m http.server 8000` (Python 3) or `python -m SimpleHTTPServer 8000` (Python 2)

## Architecture & Structure

### Core Architecture
- **Static Site**: Pure HTML/CSS/JavaScript with no build system or framework dependencies
- **SPA-like Navigation**: JavaScript-powered page transitions that fetch content dynamically while maintaining the appearance of a single-page application

### Key Directories
```
portfolio/
├── index.html              # Home page with photo gallery
├── projects.html           # Projects showcase with expandable details
├── styles/main.css         # All styles in a single CSS file
├── js/main.js              # All JavaScript functionality
└── images/                 # Static assets and photos
```

### JavaScript Architecture
- **Modal System**: Interactive photo gallery with keyboard navigation and smooth transitions
- **Project Interaction**: Expandable project cards with click-to-reveal details
- **Page Transitions**: Fade-in/fade-out animations between pages with dynamic content loading
- **Navigation**: Active link highlighting and browser history management

### GitHub Pages Compatibility
- Nav links use `.html` extension (e.g. `/projects.html`) for correct routing on GitHub Pages
- All asset paths are relative for portability

### CSS Architecture
- **Single File**: All styles contained in `styles/main.css`
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design
- **Animation System**: CSS keyframes for fade transitions and hover effects
- **Responsive Design**: Mobile-first approach with breakpoints for different screen sizes

## Important Implementation Details

### Navigation System
- Uses `data-` attributes for image gallery metadata
- Project cards use `data-project-id` for identification
- SPA navigation preserves state and handles browser back/forward buttons

### Image Management
- Thumbnail images for performance (cluster display)
- Full-size images loaded on demand (modal view)
- Alt text and descriptions stored in HTML data attributes
