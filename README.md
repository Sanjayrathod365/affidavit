# Affidavit App

A Next.js application for managing providers, patients, and affidavits.

## Features

- Provider Management
- Patient Management
- Affidavit Generation
- User Authentication
- HIPAA Compliance

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (PostgreSQL)
- NextAuth.js
- Winston (Logging)

## Prerequisites

- Node.js 18.17 or later
- PostgreSQL database
- npm or yarn

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd affidavit-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the database connection string and other variables

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── providers/      # Provider-related components
│   ├── patients/       # Patient-related components
│   ├── ui/             # Shared UI components
│   └── shared/         # Shared components
├── lib/                # Utility functions and configurations
│   ├── db/            # Database utilities
│   ├── auth/          # Authentication utilities
│   └── utils/         # General utilities
└── types/              # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 