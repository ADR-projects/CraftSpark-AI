export default function GradientCard({ emoji, gradient, size = "md", className = "" }) {
  const sizeMap = {
    sm: { container: "py-10", emoji: "text-5xl" },
    md: { container: "py-16", emoji: "text-6xl md:text-8xl" },
    lg: { container: "h-64 md:h-96", emoji: "text-[8rem] md:text-[12rem]" },
  };
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`w-full flex items-center justify-center ${s.container} ${className}`}
      style={{
        background:
          gradient && gradient.length === 2
            ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
            : "linear-gradient(135deg, #f6d365, #fda085)",
      }}
    >
      <span className={`${s.emoji} drop-shadow-lg select-none`}>
        {emoji || "🎨"}
      </span>
    </div>
  );
}
