# AI Image Gallery with Flux Image Editor

A React-based image gallery with infinite scroll and AI-powered image editing using Black Forest Labs Flux API.

## Features

- 📸 Infinite scroll image gallery
- 🎨 AI-powered image editing with Flux models
- 🖼️ Local image effects (vintage, enhance, warm/cool tones, etc.)
- 📱 Responsive design with modern UI
- 🔄 Edit history with undo/redo functionality
- 💾 Download edited images

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Flux API Key:**

   - Get your API key from [Black Forest Labs API](https://api.bfl.ai/)
   - Create a `.env` file in the root directory:
     ```bash
     VITE_BFL_API_KEY=your-bfl-api-key-here
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

## Flux AI Image Editing

The image editor uses Black Forest Labs Flux API for advanced AI image editing:

- **Flux Kontext Pro**: Professional image editing with context awareness
- **Flux Schnell**: Fast image editing
- **Flux Dev**: Development model for experimental features

### Local Effects (No API Key Required)

The following effects work locally without requiring an API key:

- Enhance colors and contrast
- Vintage/sepia effects
- Warm and cool color tones
- Grayscale conversion
- Brightness/darkness adjustments
- Color inversion
- Blur and sharpen effects

### AI Effects (Requires API Key)

Complex effects like style transfer, object removal, and creative transformations use the Flux API.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Icons
- Black Forest Labs Flux API

## Development

This template uses:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) with [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) with [SWC](https://swc.rs/) for Fast Refresh
