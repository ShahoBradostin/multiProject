export default function ImagePlaceholder({
  className = "",
  label = "Image placeholder",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/60 px-4 text-center text-sm text-muted ${className}`}
    >
      {label}
    </div>
  );
}
