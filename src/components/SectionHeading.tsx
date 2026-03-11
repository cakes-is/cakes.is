interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={["mb-10", centered ? "text-center" : "", className].join(" ")}
    >
      <div
        className={[
          "mb-3 flex items-center gap-4",
          centered ? "justify-center" : "",
        ].join(" ")}
      >
        <span className="bg-rose-medium block h-px w-8 flex-shrink-0" />
        <h2 className="font-display text-brown-dark text-3xl tracking-tight sm:text-4xl">
          {title}
        </h2>
        <span className="bg-rose-medium block h-px w-8 flex-shrink-0" />
      </div>
      {subtitle && (
        <p className="text-brown mx-auto max-w-2xl text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
