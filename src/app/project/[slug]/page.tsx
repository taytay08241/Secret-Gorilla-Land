import { Navbar } from '@/components/Navbar';
import { ShellPrompt } from '@/components/ShellPrompt';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';
import { notFound } from 'next/navigation';

async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as Project;
}

async function incrementViews(projectId: string) {
  await supabase.rpc('increment_views', { project_id: projectId });
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  // Increment view count
  await incrementViews(project.id);

  const daysAgo = Math.floor(
    (Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen grid-pattern">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <ShellPrompt command={`cat ./projects/${project.slug}.md`} />
        </div>

        {/* Project Header */}
        <div className="border border-terminal-dim p-6 mb-8 glass card-hover fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-glow mb-2">
                {project.title}
              </h1>
              <p className="text-terminal-dim text-lg">{project.subtitle}</p>
            </div>
            {project.is_private && (
              <span className="bg-terminal-amber text-black px-3 py-1 font-bold text-sm neon-border">
                PRIVATE
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm mb-4">
            <span className="text-terminal-amber font-bold">v{project.version}</span>
            <span className="text-terminal-dim">•</span>
            <span className="text-terminal-green">{project.category}</span>
            <span className="text-terminal-dim">•</span>
            <span className="text-terminal-dim">{daysAgo} days ago</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border border-terminal-dim px-2 py-1 text-terminal-green hover:border-terminal-green transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-terminal-green border-t border-terminal-dim pt-4">
            <span className="text-terminal-amber">⬇ {project.stats.downloads} downloads</span>
            <span className="text-terminal-amber">♥ {project.stats.likes} likes</span>
            <span className="text-terminal-amber">👁 {project.stats.views} views</span>
            <span className="text-terminal-amber">💬 {project.stats.comments} comments</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8 fade-in">
          <h2 className="text-2xl font-bold text-glow mb-4">
            // Screenshots
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.map((image, index) => (
              <div key={index} className="border border-terminal-dim overflow-hidden glass card-hover">
                <img
                  src={image}
                  alt={`${project.title} screenshot ${index + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="section-divider"></div>

        {/* Description */}
        <div className="mb-8 fade-in">
          <h2 className="text-2xl font-bold text-glow mb-4">
            // Description
          </h2>
          <div className="border border-terminal-dim p-6 text-terminal-green whitespace-pre-wrap glass">
            {project.description}
          </div>
        </div>

        {/* Download Button */}
        <div className="border border-terminal-green p-8 text-center glass card-hover neon-border fade-in">
          <a
            href={project.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-terminal-green text-black px-8 py-4 font-bold text-lg hover:bg-terminal-amber transition-all button-press border-glow"
            onClick={async () => {
              await supabase.rpc('increment_downloads', { project_id: project.id });
            }}
          >
            ⬇ Download {project.title}
          </a>
          <p className="text-terminal-dim text-sm mt-2">
            v{project.version} • {project.category}
          </p>
        </div>

        {/* Seasonal Theme */}
        {project.seasonal_theme && (
          <div className="mt-4 text-center fade-in">
            <span className="text-terminal-amber text-sm">
              🎄 Seasonal Theme: {project.seasonal_theme}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
