# Samavesh

Samavesh is a modern, accessibility-focused learning platform designed to break physical and linguistic barriers using real-time AI assistance.

## Key Features
- **Live Captions:** Real-time speech-to-text with support for multiple Indian languages.
- **AI OCR & Reader:** Digital reading assistance for PDFs and handwritten diagrams.
- **Accessibility Provider:** Specialized UI controls for cognitive support and visual impairments.
- **Premium Design:** Highly interactive, glassmorphic UI with floating 3D elements.

## Tech Stack
- **Frontend:** Next.js 15, Framer Motion, TailwindCSS 4, Lucide Icons.
- **Database:** Drizzle ORM with Turso (libSQL) backend.
- **UI Components:** Radix UI and customized Shadcn components.

## Getting Started

1. **Environment Setup:**
   Ensure you have your Turso connection URL and auth token in your `.env` file.
   ```bash
   TURSO_CONNECTION_URL=your_url
   TURSO_AUTH_TOKEN=your_token
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   Generate and push your migrations using Drizzle:
   ```bash
   npx drizzle-kit push
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---
Built by Team Codeucate.
