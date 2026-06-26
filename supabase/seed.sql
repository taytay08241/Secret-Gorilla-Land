-- Seed data for Gorilla Tag projects

-- Public projects
INSERT INTO projects (slug, title, subtitle, description, version, category, images, thumbnail, download_url, tags, is_private, seasonal_theme) VALUES
(
  'christmas-copy-2024',
  '🦍 Christmas Copy 2024',
  'Festive Gorilla Tag with holiday maps',
  'A complete Gorilla Tag copy featuring Christmas-themed maps, snowy environments, and holiday cosmetics. Includes custom winter maps, festive monkey skins, and seasonal sound effects.',
  '2.1.0',
  'Full Copy',
  ARRAY['https://placehold.co/600x400/0a0a0a/00ff00?text=Christmas+Map+1', 'https://placehold.co/600x400/0a0a0a/00ff00?text=Christmas+Map+2', 'https://placehold.co/600x400/0a0a0a/00ff00?text=Christmas+Map+3'],
  'https://placehold.co/600x400/0a0a0a/00ff00?text=Christmas+Copy',
  'https://example.com/download/christmas-copy',
  ARRAY['featured', 'SEASONAL', 'FULL COPY'],
  false,
  'Christmas'
),
(
  'bark-mod-menu',
  '🐕 Bark Mod Menu',
  'Advanced mod menu with custom features',
  'Feature-rich mod menu for Gorilla Tag with ESP, fly mode, speed hacks, and custom cosmetics. Includes anti-ban protection and regular updates.',
  '3.5.2',
  'Mod Menu',
  ARRAY['https://placehold.co/600x400/0a0a0a/ffb000?text=Mod+Menu+UI', 'https://placehold.co/600x400/0a0a0a/ffb000?text=Features'],
  'https://placehold.co/600x400/0a0a0a/ffb000?text=Bark+Mod',
  'https://example.com/download/bark-mod',
  ARRAY['featured', 'MOD MENU', 'NEW'],
  false,
  null
),
(
  'summer-update-maps',
  '☀️ Summer Map Pack',
  'Beach and summer-themed maps',
  'Collection of 5 summer-themed maps including beach volleyball court, water park, tropical island, and more. Perfect for summer fun with friends.',
  '1.0.0',
  'Map Pack',
  ARRAY['https://placehold.co/600x400/0a0a0a/00ff00?text=Beach+Map', 'https://placehold.co/600x400/0a0a0a/00ff00?text=Water+Park'],
  'https://placehold.co/600x400/0a0a0a/00ff00?text=Summer+Maps',
  'https://example.com/download/summer-maps',
  ARRAY['MAP PACK', 'SEASONAL'],
  false,
  'Summer'
),
(
  'custom-monkey-skins',
  '🎨 Custom Monkey Skins',
  '100+ custom monkey skins',
  'Massive collection of custom monkey skins including anime characters, memes, animals, and more. Easy installation with included skin manager.',
  '1.5.0',
  'Asset',
  ARRAY['https://placehold.co/600x400/0a0a0a/00ff00?text=Skin+Preview+1', 'https://placehold.co/600x400/0a0a0a/00ff00?text=Skin+Preview+2'],
  'https://placehold.co/600x400/0a0a0a/00ff00?text=Custom+Skins',
  'https://example.com/download/skins',
  ARRAY['Asset', 'NEW'],
  false,
  null
),
(
  'ghost-cave-map',
  '👻 Ghost Cave Map',
  'Spooky underground cave map',
  'Eerie underground cave map with glowing mushrooms, ghost particles, and hidden secrets. Perfect for horror-themed gameplay.',
  '1.2.0',
  'Map Pack',
  ARRAY['https://placehold.co/600x400/0a0a0a/00ff00?text=Cave+Entrance', 'https://placehold.co/600x400/0a0a0a/00ff00?text=Underground'],
  'https://placehold.co/600x400/0a0a0a/00ff00?text=Ghost+Cave',
  'https://example.com/download/ghost-cave',
  ARRAY['MAP PACK'],
  false,
  null
),
(
  'gravity-script',
  '🌍 Gravity Script',
  'Custom gravity manipulation script',
  'Script that allows you to manipulate gravity in-game. Create zero-gravity zones, increase gravity for heavy gameplay, or reverse gravity for chaos.',
  '2.0.0',
  'Script',
  ARRAY['https://placehold.co/600x400/0a0a0a/ffb000?text=Gravity+Demo'],
  'https://placehold.co/600x400/0a0a0a/ffb000?text=Gravity+Script',
  'https://example.com/download/gravity-script',
  ARRAY['Script', 'featured'],
  false,
  null
);

-- Private projects (boosted users only)
INSERT INTO projects (slug, title, subtitle, description, version, category, images, thumbnail, download_url, tags, is_private, seasonal_theme) VALUES
(
  'exclusive-halloween-copy',
  '🎃 Exclusive Halloween Copy',
  'Premium Halloween-themed full copy',
  'EXCLUSIVE: Complete Gorilla Tag copy with extensive Halloween content. Includes haunted mansion map, zombie monkey skins, horror sound effects, and special Halloween events. Only available for boosted users.',
  '1.0.0',
  'Full Copy',
  ARRAY['https://placehold.co/600x400/0a0a0a/ff6600?text=Haunted+Mansion', 'https://placehold.co/600x400/0a0a0a/ff6600?text=Zombie+Skins'],
  'https://placehold.co/600x400/0a0a0a/ff6600?text=Exclusive+Halloween',
  'https://example.com/download/exclusive-halloween',
  ARRAY['PRIVATE', 'FULL COPY', 'SEASONAL', 'EXCLUSIVE'],
  true,
  'Halloween'
),
(
  'pro-mod-menu-v4',
  '💎 Pro Mod Menu V4',
  'Premium mod menu with exclusive features',
  'PREMIUM: Advanced mod menu with exclusive features not available in free versions. Includes cloud config sync, custom UI themes, advanced ESP options, and priority support. Boosted users only.',
  '4.0.0',
  'Mod Menu',
  ARRAY['https://placehold.co/600x400/0a0a0a/ff6600?text=Pro+UI', 'https://placehold.co/600x400/0a0a0a/ff6600?text=Exclusive+Features'],
  'https://placehold.co/600x400/0a0a0a/ff6600?text=Pro+Mod+Menu',
  'https://example.com/download/pro-mod',
  ARRAY['PRIVATE', 'MOD MENU', 'EXCLUSIVE', 'PREMIUM'],
  true,
  null
),
(
  'early-access-fangame',
  '🚀 Early Access Fangame',
  'New Gorilla Tag fangame - early access',
  'EARLY ACCESS: Be the first to play this new Gorilla Tag fangame with innovative gameplay mechanics. Includes exclusive early-bird cosmetics and priority feature requests. Boosted users get early access before public release.',
  '0.5.0',
  'Full Copy',
  ARRAY['https://placehold.co/600x400/0a0a0a/ff6600?text=New+Gameplay', 'https://placehold.co/600x400/0a0a0a/ff6600?text=Exclusive+Content'],
  'https://placehold.co/600x400/0a0a0a/ff6600?text=Early+Access',
  'https://example.com/download/early-access',
  ARRAY['PRIVATE', 'FULL COPY', 'EARLY ACCESS', 'EXCLUSIVE'],
  true,
  null
);

-- Update stats for demo purposes
UPDATE projects SET downloads = FLOOR(RANDOM() * 5000) + 100;
UPDATE projects SET likes = FLOOR(RANDOM() * 500) + 50;
UPDATE projects SET views = FLOOR(RANDOM() * 10000) + 500;
UPDATE projects SET comments = FLOOR(RANDOM() * 50) + 5;
