'use client';

import Link from 'next/link';
import { useSupabase } from './SupabaseProvider';

export function Navbar() {
  const { user,	isBoosted, role, signInWithDiscord, signOut } = useSupabase();

  console.log('Navbar - User:', user?.id);
  console.log('Navbar - Role:', role);
  console.log('Navbar - Is Owner:', role === 'owner');

  return (
    <nav className="border-b border-terminal-dim sticky top-0 bg-terminal-bg z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-glow hover:text-terminal-amber transition-all">
            Secret Gorilla Land
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-terminal-green hover:text-glow transition-all hover-lift"
            >
              Home
            </Link>
            <Link
              href="/projects"
              className="text-sm text-terminal-green hover:text-glow transition-all hover-lift"
            >
              Projects
            </Link>

            {user ? (
              <>
                <Link
                  href="/private"
                  className={`text-sm transition-all hover-lift ${
                    isBoosted
                      ? 'text-terminal-green hover:text-glow'
                      : 'text-terminal-dim cursor-not-allowed'
                  }`}
                >
                  Private Releases {isBoosted ? '🔓' : '🔒'}
                </Link>
                {role === 'owner' && (
                  <Link
                    href="/owner"
                    className="text-sm text-terminal-amber hover:text-glow transition-all hover-lift"
                  >
                    Owner Panel
                  </Link>
                )}
                {['mod', 'admin', 'owner'].includes(role) && (
                  <Link
                    href="/staff-chat"
                    className="text-sm text-terminal-green hover:text-glow transition-all hover-lift"
                  >
                    Staff Chat
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="text-sm text-terminal-dim hover:text-terminal-green transition-all hover-lift"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={signInWithDiscord}
                className="text-sm bg-terminal-green text-black px-4 py-2 hover:bg-terminal-amber transition-all font-bold button-press border-glow"
              >
                Sign In with Discord
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
