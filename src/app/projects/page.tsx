import { Navbar } from '@/components/Navbar';
import { ProjectCard } from '@/components/ProjectCard';
import { ShellPrompt } from '@/components/ShellPrompt';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';

interface ProjectsPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
  };
}

async function getProjects(filters: ProjectsPageProps['searchParams']): Promise<Project[]> {
  let query = supabase.from('projects').select('*').eq('is_private', false);

  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category);
  }

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  switch (filters.sort) {
    case 'trending':
      query = query.order('likes', { ascending: false });
      break;
    case 'most_downloaded':
      query = query.order('downloads', { ascending: false });
      break;
    case 'most_liked':
      query = query.order('likes', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) return [];
  return data as Project[];
}

const categories = ['All', 'Projects', 'Packages', 'Assets', 'Scripts'];
const sortOptions = ['newest', 'trending', 'most_downloaded', 'most_liked'];

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const projects = await getProjects(searchParams);

  return (
    <div className="min-h-screen grid-pattern">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 fade-in">
          <ShellPrompt command="ls ./gorilla-projects" />
          <h1 className="text-4xl font-bold text-glow mt-4 mb-2">
            // Projects
          </h1>
          <p className="text-terminal-dim text-lg">
            Browse all Gorilla Tag copies, mods, maps, and assets
          </p>
        </div>

        {/* Filters */}
        <div className="border border-terminal-dim p-6 mb-8 glass card-hover fade-in">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-terminal-amber text-sm font-bold">Category:</span>
              {categories.map((cat) => (
                <a
                  key={cat}
                  href={`/projects?category=${cat}&sort=${searchParams.sort || 'newest'}`}
                  className={`text-sm px-4 py-2 border transition-all hover-lift ${
                    searchParams.category === cat
                      ? 'border-terminal-green text-terminal-green neon-border'
                      : 'border-terminal-dim text-terminal-dim hover:border-terminal-green hover:text-terminal-green'
                  }`}
                >
                  {cat}
                </a>
              ))}
            </div>

            {/* Sort Filter */}
            <div className="flex flex-wrap gap-2 ml-auto">
              <span className="text-terminal-amber text-sm font-bold">Sort:</span>
              {sortOptions.map((sort) => (
                <a
                  key={sort}
                  href={`/projects?category=${searchParams.category || 'All'}&sort=${sort}`}
                  className={`text-sm px-4 py-2 border transition-all hover-lift ${
                    searchParams.sort === sort
                      ? 'border-terminal-green text-terminal-green'
                      : 'border-terminal-dim text-terminal-dim hover:border-terminal-green hover:text-terminal-green'
                  }`}
                >
                  {sort.replace('_', ' ')}
                </a>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search projects..."
              defaultValue={searchParams.search}
              className="w-full bg-terminal-bg border border-terminal-dim px-4 py-3 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
              formAction="/projects"
              name="search"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12 text-terminal-dim glass">
            <p className="text-xl">No projects found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
