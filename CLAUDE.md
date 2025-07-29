# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3000 with hot reload
- `npm run build` - Build the application for production to `./dist`
- `npm test` - Placeholder test command (currently exits with error)

## Project Architecture

This is a React + TypeScript application for querying and displaying I Ching hexagrams. The application allows users to input 6-bit binary codes to generate and display corresponding hexagrams with their Chinese names.

### Core Components

- **App.tsx**: Main component with hexagram input textarea and grid layout
- **HexagramList.tsx**: Displays hexagrams in grid or single focus mode, generates external search links
- **HexagramCell**: Individual hexagram display component with image and name

### Data Models

- **hexagramMap.ts**: Maps 64 hexagram indices (0-63) to Chinese names using `HexaNames` enum
- **trigramMap.ts**: Maps 8 trigram indices (0-7) to Chinese names (`TrigName`) and symbols (`TrigSymbol`)
- **Hexagram generation**: Uses binary representation where 1 = solid line, 0 = broken line

### Key Utilities

- **hexaGenerate.ts**: Core logic including:
  - `getHexaImageURL()`: Generates hexagram images using OffscreenCanvas API
  - `getTrigramsFromHexagram()`: Extracts upper/lower trigrams from hexagram index
  - `concatHexagramName()`: Formats Chinese hexagram names based on trigram composition

### Build System

- **Vite**: Modern build tool with React plugin, configured for port 3000
- **Tailwind CSS**: Utility-first CSS framework with basic configuration
- **PostCSS**: CSS processing with autoprefixer
- **GitHub Pages**: Automated deployment via GitHub Actions on main branch pushes

### External Integration

Hexagrams link to Google searches targeting `eee-learning.com` for additional information about each hexagram.

### File Structure

```
src/
├── App.tsx              # Main application component
├── HexagramList.tsx     # Hexagram display logic
├── hexaGenerate.ts      # Image generation and utilities
├── hexagramMap.ts       # Hexagram name mappings
├── trigramMap.ts        # Trigram name/symbol mappings
├── main.tsx             # React entry point
└── styles/              # CSS stylesheets
```