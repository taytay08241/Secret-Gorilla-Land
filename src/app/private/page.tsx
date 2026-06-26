'use client';

import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { ShellPrompt } from '@/components/ShellPrompt';
import { useSupabase } from '@/components/SupabaseProvider';
import { useEffect, useState } from 'react';
import { Project } from '@/types';
import { supabase } from '@/lib/supabase';

export default function PrivatePage() {
  const { user, isBoosted } = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isBoosted) {
      loadPrivateProjects();
    } else {
      setLoading(false);
    }
  }, [user, isBoosted]);

  const loadPrivateProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_private', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data as Project[]);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ShellPrompt command="./private --auth-required" />
          <div className="border border-terminal-dim p-8 mt-4 text-center">
            <h2 className="text-2xl font-bold text-terminal-green mb-4">
              Authentication Required
            </h2>
            <p className="text-terminal-dim mb-6">
              You must sign in with Discord to access private releases.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isBoosted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ShellPrompt command="./private --boost-required" />
          <div className="border border-terminal-amber p-8 mt-4 text-center">
            <h2 className="text-2xl font-bold text-terminal-amber mb-4">
              🔒 Boost Required
            </h2>
            <p className="text-terminal-green mb-6">
              Private releases are only available to users who have boosted our Discord server.
            </p>
            <a
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-terminal-amber text-black px-6 py-3 font-bold hover:bg-terminal-green transition-colors"
            >
              Boost Our Server
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ShellPrompt command="./private --loading" />
          <p className="text-terminal-dim mt-4">Loading private releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <ShellPrompt command="./private --exclusive" />
          <h1 className="text-3xl font-bold text-terminal-green mt-4 mb-2">
            // Private Releases
          </h1>
          <p className="text-terminal-dim">
            Exclusive Gorilla Tag copies and mods for boosted users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-terminal-dim">
            <p>No private releases available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
