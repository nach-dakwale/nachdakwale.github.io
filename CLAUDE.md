# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Nach Dakwale, built as a static HTML/CSS/JavaScript site with a Python-based blog management system. The site showcases projects, includes a blog, and features an interactive photo gallery.

## Development Commands

### Blog Management
- **Generate blog index**: `python build_blog_index.py` - Scans the `posts/` directory and automatically updates `blog.html` with a list of all blog posts, sorted by date

### Local Development
- **Serve locally**: Open `index.html` directly in a browser, or use any static file server
- **Simple Python server**: `python -m http.server 8000` (Python 3) or `python -m SimpleHTTPServer 8000` (Python 2)

## Architecture & Structure

### Core Architecture
- **Static Site**: Pure HTML/CSS/JavaScript with no build system or framework dependencies
- **SPA-like Navigation**: JavaScript-powered page transitions that fetch content dynamically while maintaining the appearance of a single-page application
- **Blog System**: Python script automatically generates blog index from individual HTML post files

### Key Directories
```
portfolio/
├── index.html              # Home page with photo gallery
├── projects.html           # Projects showcase with expandable details
├── blog.html              # Blog index (auto-generated)
├── posts/                 # Individual blog post HTML files
├── styles/main.css        # All styles in a single CSS file
├── js/main.js            # All JavaScript functionality
├── images/               # Static assets and photos
└── build_blog_index.py   # Blog index generator script
```

### JavaScript Architecture
- **Modal System**: Interactive photo gallery with keyboard navigation and smooth transitions
- **Project Interaction**: Expandable project cards with click-to-reveal details
- **Page Transitions**: Fade-in/fade-out animations between pages with dynamic content loading
- **Navigation**: Active link highlighting and browser history management

### Blog System Workflow
1. Create new blog posts using `_blog_post_template.html` as a template
2. Place completed posts in the `posts/` directory
3. Run `python build_blog_index.py` to update the blog index
4. Posts require specific metadata: `<h1 class="post-full-title">`, `<p class="post-full-date">`, and `<meta name="excerpt">`

### CSS Architecture
- **Single File**: All styles contained in `styles/main.css`
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design
- **Animation System**: CSS keyframes for fade transitions and hover effects
- **Responsive Design**: Mobile-first approach with breakpoints for different screen sizes

## Important Implementation Details

### Blog Post Requirements
- Posts must include `<h1 class="post-full-title">` for the title
- Posts must include `<p class="post-full-date">` with format "Month Day, Year" (e.g., "May 12, 2025")
- Posts should include `<meta name="excerpt" content="...">` for blog list previews
- Post filenames should be URL-friendly (lowercase, hyphens for spaces)

### Navigation System
- Uses `data-` attributes for image gallery metadata
- Project cards use `data-project-id` for identification
- SPA navigation preserves state and handles browser back/forward buttons

### Image Management
- Thumbnail images for performance (cluster display)
- Full-size images loaded on demand (modal view)
- Alt text and descriptions stored in HTML data attributes