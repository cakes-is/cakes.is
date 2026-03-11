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
      className={[
        "mb-10",
        centered ? "text-center" : "",
        className,
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-4 mb-3",
          centered ? "justify-center" : "",
        ].join(" ")}
      >
        <span className="block h-px w-8 bg-rose-medium flex-shrink-0" />
        <h2 className="font-display text-3xl sm:text-4xl text-brown-dark tracking-tight">
          {title}
        </h2>
        <span className="block h-px w-8 bg-rose-medium flex-shrink-0" />
      </div>
      {subtitle && (
        <p className="text-brown text-lg leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
