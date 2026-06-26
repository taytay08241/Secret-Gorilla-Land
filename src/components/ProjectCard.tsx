'use client';

import { Project } from '@/types';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const daysAgo = Math.floor(
    (Date.now() - new Date(project.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link href={`/project/${project.slug}`}>
      <div className="border border-terminal-dim card-hover cursor-pointer group fade-in">
        {/* Preview Images */}
        <div className="grid grid-cols-3 gap-0.5 h-40 overflow-hidden">
          {project.images.slice(0, 3).map((image, index) => (
            <div
              key={index}
              className="bg-terminal-dim overflow-hidden"
              style={{
                gridColumn: project.images.length === 1 ? 'span 3' : 
                           project.images.length === 2 && index === 0 ? 'span 2' : 'span 1'
              }}
            >
              <img
                src={image}
                alt={`${project.title} shot ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-terminal-green group-hover:text-glow transition-all">
              {project.title}
            </h3>
            {project.is_private && (
              <span className="text-xs bg-terminal-amber text-black px-2 py-1 font-bold border-glow-amber">
                PRIVATE
              </span>
            )}
          </div>

          <p className="text-sm text-terminal-dim mb-3 leading-relaxed">{project.subtitle}</p>

          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="text-terminal-amber font-bold">v{project.version}</span>
            <span className="text-terminal-dim">•</span>
            <span className="text-terminal-dim">{project.category}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs border border-terminal-dim px-2 py-1 text-terminal-dim hover:border-terminal-green hover:text-terminal-green transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-terminal-dim border-t border-terminal-dim pt-3">
            <span className="hover:text-terminal-green transition-colors">⬇ {project.stats.downloads}</span>
            <span className="hover:text-terminal-green transition-colors">♥ {project.stats.likes}</span>
            <span className="hover:text-terminal-green transition-colors">💬 {project.stats.comments}</span>
            <span className="ml-auto">{daysAgo}d ago</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
