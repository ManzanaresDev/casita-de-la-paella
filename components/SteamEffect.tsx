// components/SteamEffect.tsx
export default function SteamEffect() {
  return (
    <div className="flex justify-center gap-3 h-6 overflow-hidden mb-2 pointer-events-none">
      {[0, 0.7, 1.4].map((delay, i) => (
        <div
          key={i}
          className="steam-particle"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </div>
  );
}
