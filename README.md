# CasaFind

This is the public website for CasaFind. It shows properties for sale and rent and gives users a simple way to browse listings in the Philippines.

## What it does

- Displays featured properties on the home page
- Shows property details and key listing information
- Uses the same property data as the CMS
- Lets users browse available homes and rentals

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query

## Requirements

- Node.js 18+
- npm

## Local setup

1. Open the project folder
   ```bash
   cd CasaFind/frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the app
   ```bash
   npm run dev
   ```

4. Open the app in the browser
   ```text
   http://localhost:5173
   ```

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes

- The frontend reads property data from the CasaFind backend.
- The site is connected to the CMS-managed property records so listings stay in sync.
- Images and listing details come from the shared backend and database.

## License

This project is private.
