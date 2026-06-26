'use client';

import { useSupabase } from '@/components/SupabaseProvider';
import { ShellPrompt } from '@/components/ShellPrompt';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from '@/types';

export default function OwnerPage() {
  const { user, loading, role } = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (role === 'owner') {
      fetchProjects();
      fetchUsers();
    }
  }, [role]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProjects(data as Project[]);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data);
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (!error) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    if (!error) {
      fetchUsers();
    }
  };

  const isStaff = (userRole: string) => {
    return ['mod', 'admin', 'owner'].includes(userRole);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-green p-8">
        <ShellPrompt command="Loading..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-green p-8">
        <ShellPrompt command="Access Denied" />
        <div className="mt-4 border border-terminal-dim p-4">
          <p className="text-terminal-amber mb-4">// You must be signed in to access this page</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-terminal-dim hover:bg-terminal-green hover:text-terminal-bg px-4 py-2 terminal-hover transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (role !== 'owner') {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-green p-8">
        <ShellPrompt command="Access Denied" />
        <div className="mt-4 border border-terminal-dim p-4">
          <p className="text-terminal-amber mb-4">// You do not have owner permissions</p>
          <p className="text-terminal-dim mb-4">// Required role: owner</p>
          <p className="text-terminal-dim mb-4">// Your role: {role}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-terminal-dim hover:bg-terminal-green hover:text-terminal-bg px-4 py-2 terminal-hover transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-pattern">
      <ShellPrompt command="owner@secret-gorilla-land:~$ sudo ./admin-panel" />
      
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <h1 className="text-4xl font-bold mb-6 text-glow"># Owner Dashboard</h1>
        
        <div className="mb-8 border border-terminal-dim p-6 glass card-hover fade-in">
          <h2 className="text-2xl font-bold mb-4 text-glow">## User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-terminal-dim">
                  <th className="text-left py-2 px-2 text-terminal-amber">Username</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Discord ID</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Role</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Boosted</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Staff</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userProfile) => (
                  <tr key={userProfile.id} className="border-b border-terminal-dim hover:bg-terminal-dim/10 transition-colors">
                    <td className="py-2 px-2 text-terminal-green">{userProfile.username}</td>
                    <td className="py-2 px-2 text-terminal-dim">{userProfile.discord_id}</td>
                    <td className="py-2 px-2">
                      <select
                        value={userProfile.role}
                        onChange={(e) => updateUserRole(userProfile.id, e.target.value)}
                        className="bg-terminal-bg border border-terminal-dim text-terminal-green px-2 py-1 focus:border-terminal-green focus:outline-none"
                      >
                        <option value="user">user</option>
                        <option value="mod">mod</option>
                        <option value="admin">admin</option>
                        <option value="owner">owner</option>
                      </select>
                    </td>
                    <td className="py-2 px-2">
                      {userProfile.is_boosted ? (
                        <span className="text-terminal-green">✓</span>
                      ) : (
                        <span className="text-terminal-dim">✗</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      {isStaff(userProfile.role) && (
                        <span className="text-terminal-amber text-xs font-bold">STAFF</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => updateUserRole(userProfile.id, 'owner')}
                        className="text-terminal-amber hover:text-glow hover:underline mr-2 transition-colors"
                      >
                        Make Owner
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-terminal-dim p-6 glass card-hover fade-in">
          <h2 className="text-2xl font-bold mb-4 text-glow">## Project Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-terminal-dim">
                  <th className="text-left py-2 px-2 text-terminal-amber">Title</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Category</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Downloads</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Private</th>
                  <th className="text-left py-2 px-2 text-terminal-amber">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-terminal-dim hover:bg-terminal-dim/10 transition-colors">
                    <td className="py-2 px-2 text-terminal-green">{project.title}</td>
                    <td className="py-2 px-2 text-terminal-green">{project.category}</td>
                    <td className="py-2 px-2 text-terminal-amber">{project.stats?.downloads || 0}</td>
                    <td className="py-2 px-2">
                      {project.is_private ? (
                        <span className="text-terminal-amber">Yes</span>
                      ) : (
                        <span className="text-terminal-green">No</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => window.location.href = `/project/${project.slug}`}
                        className="text-terminal-green hover:text-glow hover:underline mr-2 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="text-terminal-amber hover:text-glow hover:underline transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 border border-terminal-dim p-6 glass card-hover fade-in">
          <h2 className="text-2xl font-bold mb-4 text-glow">## Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => window.location.href = '/admin'}
              className="bg-terminal-dim hover:bg-terminal-green hover:text-terminal-bg px-4 py-2 terminal-hover transition-all hover-lift border-glow"
            >
              Upload New Project
            </button>
            <button
              onClick={() => window.location.href = '/staff-chat'}
              className="bg-terminal-dim hover:bg-terminal-green hover:text-terminal-bg px-4 py-2 terminal-hover transition-all hover-lift border-glow"
            >
              Staff Chat
            </button>
            <button
              onClick={() => window.location.href = '/projects'}
              className="bg-terminal-dim hover:bg-terminal-green hover:text-terminal-bg px-4 py-2 terminal-hover transition-all hover-lift border-glow"
            >
              View All Projects
            </button>
            <button
              onClick={() => window.location.href = '/private'}
              className="bg-terminal-dim hover:bg-terminal-green hover:text-terminal-bg px-4 py-2 terminal-hover transition-all hover-lift border-glow"
            >
              View Private Releases
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
