'use client';

import { Navbar } from '@/components/Navbar';
import { ShellPrompt } from '@/components/ShellPrompt';
import { useSupabase } from '@/components/SupabaseProvider';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const { user, loading, role } = useSupabase();
  const isStaff = ['mod', 'admin', 'owner'].includes(role);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    version: '1.0.0',
    category: 'Projects',
    download_url: '',
    is_private: false,
    tags: '',
    seasonal_theme: '',
  });
  const [images, setImages] = useState<string[]>(['', '', '']);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    setMessage('');

    try {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const { error } = await supabase.from('projects').insert({
        slug,
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        version: formData.version,
        category: formData.category,
        images: images.filter((img) => img !== ''),
        thumbnail: images[0] || '',
        download_url: formData.download_url,
        downloads: 0,
        likes: 0,
        views: 0,
        comments: 0,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
        is_private: formData.is_private,
        seasonal_theme: formData.seasonal_theme || null,
      });

      if (error) throw error;

      setMessage('Project uploaded successfully!');
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        version: '1.0.0',
        category: 'Projects',
        download_url: '',
        is_private: false,
        tags: '',
        seasonal_theme: '',
      });
      setImages(['', '', '']);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen grid-pattern">
        <ShellPrompt command="Loading..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid-pattern">
        <ShellPrompt command="Access Denied" />
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="border border-terminal-dim p-6 glass">
            <p className="text-terminal-amber mb-4">// You must be signed in to access this page</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-terminal-dim hover:bg-terminal-green hover:text-terminal-bg px-4 py-2 terminal-hover transition-all hover-lift border-glow"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen grid-pattern">
        <ShellPrompt command="Access Denied" />
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="border border-terminal-dim p-6 glass">
            <p className="text-terminal-amber mb-4">// You do not have staff permissions</p>
            <p className="text-terminal-dim mb-4">// Required role: mod, admin, or owner</p>
            <p className="text-terminal-dim mb-4">// Your role: {role}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-terminal-dim hover:bg-terminal-green hover:text-terminal-bg px-4 py-2 terminal-hover transition-all hover-lift border-glow"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-pattern">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 fade-in">
          <ShellPrompt command="./admin/upload-project" />
          <h1 className="text-4xl font-bold text-glow mt-4 mb-2">
            // Admin Upload
          </h1>
          <p className="text-terminal-dim text-lg">
            Upload new Gorilla Tag projects to the hub
          </p>
        </div>

        {message && (
          <div className={`border p-4 mb-6 glass fade-in ${
            message.includes('Error') ? 'border-red-500 text-red-500' : 'border-terminal-green text-terminal-green neon-border'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-terminal-dim p-6 glass card-hover fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-terminal-amber text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
              />
            </div>

            <div>
              <label className="block text-terminal-amber text-sm mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-terminal-amber text-sm mb-2">
              Description *
            </label>
            <textarea
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-terminal-amber text-sm mb-2">
                Version
              </label>
              <input
                type="text"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
              />
            </div>

            <div>
              <label className="block text-terminal-amber text-sm mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
              >
                <option value="Projects">Projects</option>
                <option value="Packages">Packages</option>
                <option value="Assets">Assets</option>
                <option value="Scripts">Scripts</option>
              </select>
            </div>

            <div>
              <label className="block text-terminal-amber text-sm mb-2">
                Download URL *
              </label>
              <input
                type="url"
                required
                value={formData.download_url}
                onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-terminal-amber text-sm mb-2">
              Image URLs (up to 3)
            </label>
            {images.map((img, index) => (
              <input
                key={index}
                type="url"
                placeholder={`Image ${index + 1} URL`}
                value={img}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = e.target.value;
                  setImages(newImages);
                }}
                className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all mb-2"
              />
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-terminal-amber text-sm mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              placeholder="featured, NEW, SEASONAL"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
            />
          </div>

          <div className="mb-4">
            <label className="block text-terminal-amber text-sm mb-2">
              Seasonal Theme (optional)
            </label>
            <input
              type="text"
              placeholder="Christmas, Summer, etc."
              value={formData.seasonal_theme}
              onChange={(e) => setFormData({ ...formData, seasonal_theme: e.target.value })}
              className="w-full bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_private}
                onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-terminal-green">Private Release (boosted users only)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={uploadLoading}
            className="w-full bg-terminal-green text-black px-6 py-3 font-bold hover:bg-terminal-amber transition-colors disabled:opacity-50 button-press border-glow"
          >
            {uploadLoading ? 'Uploading...' : 'Upload Project'}
          </button>
        </form>
      </div>
    </div>
  );
}
