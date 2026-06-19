interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({ title, subtitle, centered = true, light = false }: SectionHeaderProps) {
  return (
    <div className={`mb-12 md:mb-16 ${centered ? "text-center" : ""} max-w-3xl ${centered ? "mx-auto" : ""}`}>
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${light ? "text-white" : "text-slate-900"}`}>{title}</h2>
      {subtitle && <p className={`text-lg md:text-xl ${light ? "text-white/80" : "text-slate-600"}`}>{subtitle}</p>}
    </div>
  );
}
