# CasaFind PH 🏠

A modern real estate marketplace platform for the Philippines, built with React and designed to help users find their dream homes with ease.

![CasaFind PH](src/assets/casafind-logo.png)

## 🌟 Overview

CasaFind PH is a responsive, user-friendly real estate platform that connects property buyers, sellers, and renters across the Philippines. The platform features a clean, modern interface with intuitive navigation and powerful search capabilities to simplify the property hunting experience.

## ✨ Features

- **Property Search** - Advanced search functionality with location-based filtering
- **Featured Properties** - Showcase of premium real estate listings with detailed information
- **Popular Locations** - Explore properties in trending Philippine cities and neighborhoods
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Modern UI/UX** - Clean interface with smooth animations and transitions
- **SEO Optimized** - Built-in meta tags and semantic HTML for better search visibility

## 🛠️ Tech Stack

- **Frontend Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Type Safety:** [TypeScript](https://www.typescriptlang.org/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)

## 📁 Project Structure

```
src/
├── assets/          # Images, logos, and static assets
├── components/      # Reusable UI components
│   ├── ui/          # shadcn/ui base components
│   ├── Header.tsx   # Navigation header
│   ├── Footer.tsx   # Site footer
│   ├── SearchBar.tsx
│   ├── PropertyCard.tsx
│   ├── FeaturedProperties.tsx
│   ├── PopularLocations.tsx
│   ├── WhyChooseUs.tsx
│   └── CTASection.tsx
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Page components
│   ├── Index.tsx    # Home page
│   └── NotFound.tsx # 404 page
├── App.tsx          # Main app component
├── main.tsx         # Application entry point
└── index.css        # Global styles and design tokens
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd casafind-ph
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🎨 Design System

The project uses a custom design system with CSS variables for consistent theming:

- **Primary Color:** Teal (`--primary`)
- **Accent Color:** Coral (`--accent`)
- **Typography:** Plus Jakarta Sans
- **Border Radius:** Rounded corners for modern feel
- **Shadows:** Subtle elevation for depth

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📄 License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ for the Philippine real estate market
</p>
