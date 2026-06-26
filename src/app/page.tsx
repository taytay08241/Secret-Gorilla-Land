import { Hero } from '@/components/Hero';
import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { ShellPrompt } from '@/components/ShellPrompt';
import { InfoBanner } from '@/components/InfoBanner';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';

async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_private', false)
    .order('likes', { ascending: false })
    .limit(6);

  if (error) return [];
  return data as Project[];
}

async function getRecentProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_private', false)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) return [];
  return data as Project[];
}

export default async function Home() {
  const [featuredProjects, recentProjects] = await Promise.all([
    getFeaturedProjects(),
    getRecentProjects(),
  ]);

  return (
    <div className="min-h-screen grid-pattern">
      <Navbar />
      <Hero />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <InfoBanner />

        {/* Featured Section */}
        <section className="mb-12 fade-in">
          <div className="mb-6">
            <ShellPrompt command="./featured --sort=trending" />
            <h2 className="text-3xl font-bold text-glow mt-4 mb-2">
              // Featured Projects
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <div className="section-divider"></div>

        {/* Recent Section */}
        <section className="mb-12 fade-in">
          <div className="mb-6">
            <ShellPrompt command="./recent --sort=newest" />
            <h2 className="text-3xl font-bold text-glow mt-4 mb-2">
              // Recent Releases
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border border-terminal-dim p-12 text-center glass card-hover fade-in neon-border">
          <h2 className="text-3xl font-bold text-glow mb-4">
            🔓 Unlock Private Releases
          </h2>
          <p className="text-terminal-dim mb-6 text-lg">
            Boost our Discord server to access exclusive Gorilla Tag copies, premium mods, and early releases.
          </p>
          <a
            href="https://discord.gg/your-server"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-terminal-green text-black px-8 py-4 font-bold hover:bg-terminal-amber transition-all button-press border-glow text-lg"
          >
            Join Discord & Boost
          </a>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-terminal-dim mt-12 py-8 px-4 glass">
        <div className="max-w-6xl mx-auto text-center text-terminal-dim text-sm">
          <p className="mb-2">
            <span className="text-terminal-amber font-bold">sul@hub</span>:~$ cat README.txt
          </p>
          <p className="text-terminal-green">
            Secret Gorilla Land — Private Release Hub for GT Copies & Mods
          </p>
          <p className="mt-2 text-xs text-terminal-dim">
            // All content is for educational purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}
