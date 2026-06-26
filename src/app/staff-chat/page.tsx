'use client';

import { useSupabase } from '@/components/SupabaseProvider';
import { ShellPrompt } from '@/components/ShellPrompt';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  username: string;
  role: string;
}

export default function StaffChatPage() {
  const { user, loading, role } = useSupabase();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');

  const isStaff = ['mod', 'admin', 'owner'].includes(role);

  useEffect(() => {
    if (isStaff && user) {
      fetchMessages();
      fetchUsername();
      
      // Subscribe to new messages
      const subscription = supabase
        .channel('staff_chat')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'staff_chat' }, (payload) => {
          fetchMessages();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isStaff, user]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('staff_chat')
      .select(`
        *,
        user_profiles!inner(username, role)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        user_id: msg.user_id,
        message: msg.message,
        created_at: msg.created_at,
        username: msg.user_profiles.username,
        role: msg.user_profiles.role,
      }));
      setMessages(formattedMessages.reverse());
    }
  };

  const fetchUsername = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('id', user.id)
      .single();
    if (data) setUsername(data.username);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from('staff_chat')
      .insert({
        user_id: user.id,
        message: newMessage.trim(),
      });

    if (!error) {
      setNewMessage('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-green p-8 grid-pattern">
        <ShellPrompt command="Loading..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-green p-8 grid-pattern">
        <ShellPrompt command="Access Denied" />
        <div className="mt-4 border border-terminal-dim p-4 glass">
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

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-terminal-bg text-terminal-green p-8 grid-pattern">
        <ShellPrompt command="Access Denied" />
        <div className="mt-4 border border-terminal-dim p-4 glass">
          <p className="text-terminal-amber mb-4">// You do not have staff permissions</p>
          <p className="text-terminal-dim mb-4">// Required role: mod, admin, or owner</p>
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
    <div className="min-h-screen bg-terminal-bg text-terminal-green p-8 grid-pattern">
      <ShellPrompt command="staff@secret-gorilla-land:~$ ./staff-chat" />
      
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6 text-glow"># Staff Chat</h1>
        
        <div className="border border-terminal-dim p-6 glass mb-6">
          <div className="h-96 overflow-y-auto mb-4 p-4 border border-terminal-dim bg-terminal-bg">
            {messages.length === 0 ? (
              <p className="text-terminal-dim text-center">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-bold ${
                      msg.role === 'owner' ? 'text-terminal-amber' :
                      msg.role === 'admin' ? 'text-terminal-green' :
                      msg.role === 'mod' ? 'text-terminal-green' : 'text-terminal-dim'
                    }`}>
                      {msg.username}
                    </span>
                    <span className="text-xs text-terminal-dim">
                      {msg.role.toUpperCase()}
                    </span>
                    <span className="text-xs text-terminal-dim ml-auto">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-terminal-green pl-2 border-l-2 border-terminal-dim">
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-terminal-bg border border-terminal-dim px-4 py-2 text-terminal-green focus:border-terminal-green focus:outline-none focus:neon-border transition-all"
            />
            <button
              type="submit"
              className="bg-terminal-green text-black px-6 py-2 font-bold hover:bg-terminal-amber transition-all button-press border-glow"
            >
              Send
            </button>
          </form>
        </div>

        <div className="border border-terminal-dim p-4 glass">
          <h2 className="text-xl font-bold mb-4 text-terminal-green">## Staff Members Online</h2>
          <p className="text-terminal-dim">
            <span className="text-terminal-amber">You are logged in as:</span> {username} ({role})
          </p>
        </div>
      </div>
    </div>
  );
}
