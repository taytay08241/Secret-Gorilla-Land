export function InfoBanner() {
  return (
    <div className="bg-terminal-dim border-l-4 border-terminal-amber p-4 mb-8 border-glow-amber fade-in">
      <div className="flex items-start gap-3">
        <span className="text-terminal-amber font-bold text-sm pulse">[info]</span>
        <p className="text-sm text-terminal-green">
          Adding more Gorilla Tag copies and maps soon... Stay tuned for exclusive releases!
        </p>
      </div>
    </div>
  );
}
