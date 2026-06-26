export function ShellPrompt({ command }: { command: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-mono">
      <span className="text-terminal-amber font-bold">sul@hub</span>
      <span className="text-terminal-dim">:</span>
      <span className="text-terminal-green font-bold">~$</span>
      <span className="text-terminal-green ml-2 text-glow">{command}</span>
      <span className="cursor-blink text-terminal-green">▊</span>
    </div>
  );
}
