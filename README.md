# Secret Gorilla Land

Private Release Hub for Gorilla Tag Unity Copies, Fangames, Mods, Maps, and Assets.

## Features

- **Terminal/Hacker Aesthetic**: Retro Unix terminal theme with green/amber monospace text
- **Public & Private Content**: Public releases for everyone, private releases for Discord boosters
- **Discord OAuth Integration**: Sign in with Discord for seamless authentication
- **Boost-Gated Access**: Private releases only available to users who boost the Discord server
- **Project Categories**: Full Copy, Map Pack, Mod Menu, Script, Asset
- **Advanced Filtering**: Filter by category, sort by newest/trending/most downloaded/most liked
- **Search**: Full-text search across all projects
- **Download Tracking**: Automatic download, view, and like counting
- **Admin Upload System**: Easy-to-use admin form for uploading new projects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Supabase Backend**: Secure, scalable database with Row-Level Security

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth with Discord OAuth
- **Styling**: Tailwind CSS with custom terminal theme

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Supabase project created at [supabase.com](https://supabase.com)
- Discord Application created at [discord.com/developers](https://discord.com/developers)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor and run the SQL commands from `supabase/schema.sql`
3. Run the seed data from `supabase/seed.sql` (optional, for demo content)
4. Enable Discord Auth in Supabase:
   - Go to Authentication > Providers
   - Enable Discord provider
   - Add your Discord Client ID and Secret

### 3. Configure Discord OAuth

1. Create a Discord Application at [discord.com/developers](https://discord.com/developers)
2. Add a redirect URL: `https://your-domain.com/auth/callback`
3. Copy your Client ID and Client Secret
4. Add them to your Supabase Discord Auth configuration

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_SERVER_ID=your_discord_server_id
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Discord Boost Verification

To implement boost verification, you'll need to:

1. Create a Discord bot that can check server boost status
2. Add a webhook or API endpoint that receives Discord user data
3. Update the `user_profiles` table with the `is_boosted` flag
4. The app automatically checks this flag to grant private access

## Project Structure

```
secret-gorilla-land/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin upload page
│   │   ├── auth/              # Auth callback
│   │   ├── private/           # Private releases page
│   │   ├── project/[slug]/    # Project detail pages
│   │   ├── projects/          # Projects listing page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── Hero.tsx
│   │   ├── InfoBanner.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ShellPrompt.tsx
│   │   └── SupabaseProvider.tsx
│   ├── lib/                   # Utility libraries
│   │   └── supabase.ts        # Supabase client
│   └── types/                 # TypeScript types
│       └── index.ts
├── supabase/                  # Database schema
│   ├── schema.sql             # Table definitions
│   └── seed.sql               # Sample data
├── public/                    # Static assets
├── .env.local.example         # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Database Schema

### Projects Table

- `id`: UUID primary key
- `slug`: Unique URL-friendly identifier
- `title`: Project name
- `subtitle`: Short description
- `description`: Full description
- `version`: Version string
- `category`: Full Copy, Map Pack, Mod Menu, Script, or Asset
- `images`: Array of image URLs
- `thumbnail`: Thumbnail image URL
- `download_url`: Download link
- `downloads`, `likes`, `views`, `comments`: Statistics
- `created_at`: Timestamp
- `tags`: Array of tags
- `is_private`: Boolean for private releases
- `seasonal_theme`: Optional seasonal theme

### User Profiles Table

- `id`: UUID primary key
- `discord_id`: Discord user ID
- `username`: Discord username
- `avatar_url`: Discord avatar
- `is_boosted`: Boolean for boost status
- `created_at`: Timestamp

## Row-Level Security (RLS)

The database uses RLS policies to ensure:

- Public projects are visible to everyone
- Private projects are only visible to boosted users
- Users can only modify their own profiles
- Authenticated users can insert new projects

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify
- Self-hosted with Docker

## Customization

### Colors

Edit `tailwind.config.ts` to customize the terminal colors:

```typescript
colors: {
  terminal: {
    bg: '#0a0a0a',      // Background
    green: '#00ff00',    // Primary text
    amber: '#ffb000',    // Accent/highlights
    dim: '#333333',      // Secondary text
  },
}
```

### Fonts

The app uses monospace fonts for the terminal aesthetic. You can change the font family in `tailwind.config.ts`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational purposes only. All Gorilla Tag-related content is property of Another Axiom LLC.

## Disclaimer

This project is a fan-made hub for Gorilla Tag mods and copies. It is not affiliated with or endorsed by Another Axiom LLC, the creators of Gorilla Tag. All content is provided for educational purposes only.
