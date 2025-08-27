# Context Mention Demo - Instructions

A Next.js prototype demonstrating mention functionality with document search, styled to match a clean "glass" design aesthetic.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   # Create database and run migrations
   npx prisma migrate dev --name init
   
   # Seed the database with example documents
   npm run db:seed
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## 📖 How to Use

### Basic Functionality

1. **Open the application** in your web browser
2. **Watch the animated placeholder** that alternates every 5 seconds between:
   - "Ask anything…"
   - "@ to add documents as context"

### Using Mentions

1. **Type `@`** in the input field
2. **A dropdown will appear** showing available documents from the database
3. **Start typing** to filter the list (case-insensitive search)
4. **Click a document** or use arrow keys + Enter to select
5. **The mention will be inserted** as `@DocumentTitle` in the input

### Submitting Messages

1. **Type your message** with or without mentions
2. **Click the send button** (up arrow) or press Enter
3. **Your message appears below** with mentions rendered as blue chips
4. **Check the browser console** to see the raw markup format: `@[Title](docId)`

### Hover Tooltips

1. **Hover over any mention chip** in a submitted message
2. **A tooltip will appear** showing the first 120 characters of the document content
3. **Move your mouse away** to hide the tooltip

## 🗄️ Pre-loaded Documents

The database comes pre-seeded with these documents:

**General Documents:**
- **Refund Policy** - Information about refund procedures and timelines
- **Shipping Guide** - Details about shipping options and international delivery
- **Onboarding SOP** - Standard operating procedures for new team members
- **Design Principles** - Guidelines for user-centered design and accessibility
- **AI Style Guide** - Best practices for working with AI tools

**ADC Components (Analog-to-Digital Converters):**
- **AD4081** - 20-Bit, 20 MSPS, Differential SAR ADC
- **AD4084** - 16-Bit, 20 MSPS, Differential SAR ADC
- **AD4080** - 20-Bit, 40 MSPS, Differential SAR ADC
- **AD9207** - 12-Bit, 6 GSPS, JESD204B/JESD204C Dual ADC
- **LTM2173-14** - 14-Bit, 80Msps Low Power Quad ADC
- **ADE9112** - Isolated, Sigma-Delta ADCs with SPI
- **ADUM7704** - 16-Bit, Isolated, Sigma-Delta Modulator
- **ADE7912** - 2-Channel, Isolated, Sigma Delta ADC with SPI
- **ADE7913** - 3-Channel, Isolated, Sigma Delta ADC with SPI

## 🛠️ Technical Features

### Database Schema
- **SQLite database** with Prisma ORM
- **Document model** with fields: `id`, `title`, `content`, `createdAt`
- **Unique titles** to prevent duplicates

### API Endpoints
- **GET `/api/docs?q=searchterm`** - Search documents by title
- **GET `/api/docs?id=docId`** - Fetch specific document for tooltips
- **Response format**: `[{ id: string, display: string }]` for search
- **Single document**: `{ id: string, title: string, content: string }`

### Mention Format
- **Display**: `@DocumentTitle`
- **Internal markup**: `@[DocumentTitle](documentId)`
- **Rendered as**: Blue chip/badge with hover tooltip

### Styling
- **Clean "glass" design** with soft shadows and rounded corners
- **Responsive layout** that works on mobile and desktop
- **Tailwind CSS** for utility-first styling
- **Custom CSS** for react-mentions styling (no default CSS import needed)

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Reseed database (if needed)
npm run db:seed

# Reset database (if needed)
npx prisma migrate reset
```

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/docs/route.ts    # Document search API
│   │   ├── globals.css          # Global styles + custom mention styling
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main page with variant toggle
│   ├── components/
│   │   └── ChatBox.tsx          # Main chat interface component
│   └── lib/
│       └── prisma.ts            # Prisma client singleton
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── seed.ts                  # Database seeding script
│   └── migrations/              # Database migrations
└── package.json                 # Dependencies and scripts
```

## 🎯 Key Features Demonstrated

### 1. Animated Placeholder & Mention Autocomplete
- Animated placeholder text that fades between two messages every 5 seconds
- Real-time document search as you type
- Keyboard navigation (up/down arrows, Enter to select, Esc to close)
- Smooth dropdown styling with proper z-indexing

### 2. Rich Message Rendering
- Mentions displayed as styled chips/badges
- Hover tooltips with document previews
- Raw markup preserved for data processing

### 3. Clean UI Design
- Matches provided screenshot specifications
- Centered layout with generous whitespace
- Soft shadows and rounded elements
- Responsive design principles

### 4. Full-Stack Integration
- Next.js App Router for modern React architecture
- Prisma ORM with SQLite for simple setup
- TypeScript for type safety
- Server-side API routes for data fetching

## 🐛 Troubleshooting

### Common Issues

**Database not found**:
```bash
npx prisma migrate dev --name init
npm run db:seed
```

**Mentions dropdown not appearing**:
- Check browser console for API errors
- Ensure development server is running
- Try refreshing the page

**Styling issues**:
- Clear browser cache
- Check that Tailwind CSS is loading properly
- Ensure react-mentions CSS is imported

**TypeScript errors**:
- Run `npm install` to ensure all dependencies are installed
- Check that Prisma client is generated: `npx prisma generate`

### Debug Tips

1. **Check browser console** for error messages and raw message logging
2. **Inspect network tab** to see API calls to `/api/docs`
3. **View database contents** with `npx prisma studio`
4. **Test API directly** by visiting `http://localhost:3000/api/docs?q=refund`

## 📝 Customization

### Adding New Documents
Edit `prisma/seed.ts` and run:
```bash
npm run db:seed
```

### Changing Mention Styling
Modify the chip styles in `src/components/ChatBox.tsx` in the `renderMessageContent` function.

### Updating API Behavior
Edit `src/app/api/docs/route.ts` to change search logic or response format.

### Modifying UI Layout
Update `src/app/page.tsx` for overall layout and `src/components/ChatBox.tsx` for the chat interface.

---

**Need help?** Check the browser console for debug information and ensure all setup steps have been completed successfully.
