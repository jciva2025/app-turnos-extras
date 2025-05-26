import { Briefcase } from 'lucide-react';

export function AppLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSizeClass = size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-3xl";
  const iconSize = size === "sm" ? 5 : size === "md" ? 6 : 7;

  return (
    <div className="flex items-center space-x-2">
      <Briefcase className={`h-${iconSize} w-${iconSize} text-primary`} />
      <h1 className={`font-bold ${textSizeClass} text-black`}>Cuarto turno mtto. Mecanizado.</h1>
    </div>
  );
}
