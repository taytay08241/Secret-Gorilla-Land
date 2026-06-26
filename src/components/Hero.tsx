'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function Hero() {
  const [projectCount, setProjectCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [releaseCount, setReleaseCount] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch project count
        const { count: projects } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total downloads
        const { data: projectsData } = await supabase
          .from('projects')
          .select('downloads');
        
        const downloads = projectsData?.reduce((sum, p) => sum + (p.downloads || 0), 0) || 0;

        // Fetch user count (boosted users)
        const { count: users } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        setProjectCount(projects || 0);
        setTotalDownloads(downloads);
        setMemberCount(users || 0);
        setReleaseCount(projects || 0);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="border-b border-terminal-dim py-16 px-4 crt-effect">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow">
            Secret Gorilla Land
          </h1>
          <p className="text-2xl text-terminal-dim mb-3 gradient-text">
            Private Release Hub for GT Copies & Mods
          </p>
          <div className="text-sm text-terminal-amber mb-8">
            <span className="text-terminal-dim">#</span> whoami
          </div>
          <p className="text-terminal-green max-w-2xl text-lg leading-relaxed">
            The ultimate repository for Gorilla Tag Unity copies, fangames, mods, maps, and assets.
            Access exclusive private releases by boosting our Discord server.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 md:gap-8">
          <div className="border border-terminal-dim p-6 card-hover hover-lift">
            <div className="text-4xl md:text-5xl font-bold text-terminal-green mb-2 text-glow">
              {projectCount}
            </div>
            <div className="text-sm text-terminal-dim uppercase tracking-wider">Projects</div>
          </div>
          <div className="border border-terminal-dim p-6 card-hover hover-lift">
            <div className="text-4xl md:text-5xl font-bold text-terminal-green mb-2 text-glow">
              {totalDownloads.toLocaleString()}
            </div>
            <div className="text-sm text-terminal-dim uppercase tracking-wider">Downloads</div>
          </div>
          <div className="border border-terminal-dim p-6 card-hover hover-lift">
            <div className="text-4xl md:text-5xl font-bold text-terminal-green mb-2 text-glow">
              {memberCount}
            </div>
            <div className="text-sm text-terminal-dim uppercase tracking-wider">Members</div>
          </div>
        </div>
      </div>
    </div>
  );
}
