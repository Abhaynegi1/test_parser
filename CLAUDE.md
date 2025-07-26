# DXF Parser for Geberit Elements

## Project Overview

This is a React-based web application designed to parse DXF (Drawing Exchange Format) files and extract Geberit-specific elements and article codes. The application provides a user-friendly interface for uploading DXF files, parsing their contents, and displaying relevant Geberit data in a structured format.

Just to reiterate:
- Extract all RAW data from dxf file
- Go through the elements or blocks and filter out the ones with "GEB" or "GEBERIT"
- Using these blocks, we need to do some special processing (TBD) - this is the current feature section below.

## Current Feature
- The special processing part is already done in a different C# code
- We need to look through this code and list out all the processing rules being applied
- No coding needed, just reverse engineering the existing logic from that code and writing it to this markdown file
- The C# project is also extracting/detecting the GEBERIT layers, then mapping it based on an article number, and also identifyin where the "bends" in the pipes are. Note that all GEBERIT layers are defining pipes in a 2d autocad tool. The DXF file is the final output of these drawings.

Check file `detection-rules.md`


## Technology Stack

- **Frontend**: React 19.1.0 with Vite 7.0.4
- **Styling**: Tailwind CSS 3.4.17 with PostCSS
- **Icons**: Lucide React 0.525.0
- **DXF Processing**: dxf-parser 1.1.2, @mlightcad/libredwg-web 0.1.5
- **Excel Export**: XLSX 0.18.5
- **Development**: ESLint 9.30.1, Vite dev server

## Key Features

- **DXF File Upload**: Secure file validation and upload handling
- **Geberit Element Extraction**: Specialized parsing for Geberit article codes, blocks, layers, and entities
- **Data Visualization**: Collapsible sections for organized data display
- **Excel Export**: Export parsed data to Excel format
- **Error Handling**: Comprehensive error reporting and user feedback

## Architecture

### Core Components

- **App.jsx**: Main application component orchestrating the DXF parsing workflow
- **FileUpload.jsx**: Handles file selection and validation
- **DataDisplay.jsx**: Renders parsed DXF data in organized sections
- **StatusMessage.jsx**: Displays loading, error, and success states
- **CollapsibleSection.jsx**: Reusable component for expandable content sections

### Services & Utilities

- **dxfParserService.js**: Core DXF parsing logic using dxf-parser library
- **dxfUtils.js**: Utility functions for DXF text cleaning and Geberit element extraction
- **excelUtils.js**: Excel export functionality
- **useDxfParser.js**: Custom React hook managing parsing state and operations

### Key Functions

#### DXF Processing
- `validateDxfFile()`: File validation (extension, size limits)
- `cleanDxfText()`: Removes DXF formatting codes and escape sequences
- `extractGebElements()`: Specialized extraction of Geberit-related data

#### State Management
- `useDxfParser()`: Centralized hook for file handling, parsing state, and UI interactions

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## File Structure

```
src/
├── components/          # React components
│   ├── CollapsibleSection.jsx
│   ├── DataDisplay.jsx
│   ├── FileUpload.jsx
│   └── StatusMessage.jsx
├── hooks/              # Custom React hooks
│   └── useDxfParser.js
├── services/           # Business logic services
│   └── dxfParserService.js
├── utils/              # Utility functions
│   ├── dxfUtils.js
│   └── excelUtils.js
├── assets/             # Static assets
└── App.jsx             # Main application component
```

## Geberit-Specific Features

The application includes specialized logic for extracting Geberit-related information:
- **Pattern Matching**: Searches for "GEBRIT" and "GEB" patterns in text, layers, and blocks
- **Article Code Extraction**: Extracts and cleans Geberit article codes from DXF text elements
- **Layer Filtering**: Identifies and processes Geberit-specific layers
- **Block Processing**: Handles Geberit blocks and their nested entities

## Testing & Quality

- ESLint rules enforce code quality standards
- File validation prevents processing of invalid or oversized files
- Error boundaries handle parsing failures gracefully
- Responsive design ensures compatibility across devices