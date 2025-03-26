# FileDrop

A secure file sharing application built with React, Express, and TypeScript.

## Prerequisites

- Node.js (Latest LTS version recommended)
- Yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/stratosnet/FileDrop.git
cd FileDrop
```

2. Install dependencies:

```bash
yarn install
```

## Development

Run the development server:

```bash
yarn dev
```

This will start the backend server using tsx.

For frontend development, the Vite development server will be available at `http://localhost:5173`

## Building for Production

Build the application:

```bash
yarn build
```

This command will:

- Build the frontend using Vite
- Bundle the backend using esbuild

## Production Deployment

Start the production server:

```bash
yarn start
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn check` - Run TypeScript type checking
- `yarn db:push` - Update database schema using Drizzle

## Tech Stack

- Frontend:

  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - Radix UI Components
  - React Query

- Backend:
  - Express
  - TypeScript
  - Multer (File uploads)
  - Drizzle ORM

## File Size Limits

- Maximum file size: 100MB

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
```

## License

MIT

## Support

For support, please visit [Stratos Network](https://www.thestratos.org/)
