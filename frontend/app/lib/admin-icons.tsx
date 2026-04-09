// lib/admin-icons.tsx
export const CATEGORY_ICONS = {
  tools: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M14.7 6.3a4 4 0 01-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-3 3z" /></svg >,
  hardware: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <rect x="3" y = "3" width="7" height="7" /> <rect x="14" y = "3" width="7" height="7" /> <rect x="14" y = "14" width="7" height="7" /> <rect x="3" y = "14" width="7" height="7" /> </svg>,
  pipes: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M4 7h6a3 3 0 013 3v4a3 3 0 003 3h4" /></svg >,
  fasteners: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <polygon points="12 2 15 7 21 9 17 14 18 20 12 17 6 20 7 14 3 9 9 7" /></svg >,
  electrical: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M13 2L3 14h7l-1 8 10-12h-5z" /></svg >,
  welding: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <circle cx="8" cy = "12" r="3" /> <circle cx="16" cy = "12" r="3" /> <line x1="11" y1 = "12" x2="13" y2="12" /> </svg>,
  safety: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" /></svg >,
  wrench: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M22 6.5a5.5 5.5 0 01-7.8 5.1L6 20l-2-2 8.6-8.2A5.5 5.5 0 1118 4l-3 3 4 4 3-3z" /></svg >,
  hammer: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M14 3l7 7-3 3-7-7z" /><path d="M2 22l10-10" / > </svg>,
  screwdriver: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M14 2l8 8-3 3-8-8z" /><path d="M2 22l10-10" / > </svg>,
  drill: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <rect x="3" y = "8" width="13" height="8" rx="2" /> <path d="M16 10h4l1 2-1 2h-4" /></svg >,
  cable: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M4 12h6a4 4 0 014 4v4" /><circle cx="4" cy="12" r="2" / > </svg>,
  paint: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M12 2a10 10 0 100 20c2 0 2-2 2-3s-1-2-1-3 1-2 3-2h2a4 4 0 004-4 10 10 0 00-10-8z" /></svg >,
  gloves: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M6 12V6a2 2 0 114 0v6M10 12V5a2 2 0 114 0v7M14 12V7a2 2 0 114 0v9a4 4 0 01-4 4H9a5 5 0 01-5-5v-3a2 2 0 114 0z" /></svg >,
  helmet: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M4 13a8 8 0 0116 0v3H4z" /></svg >,
  nut: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <polygon points="12 2 19 6 19 18 12 22 5 18 5 6" /><circle cx="12" cy="12" r="3" / > </svg>,
  bolt: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M13 2L6 14h5l-1 8 7-12h-5z" /></svg >,
  laser: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <circle cx="6" cy = "12" r="2" /> <line x1="8" y1 = "12" x2="22" y2="12" /> </svg>,
  gauge: <svg viewBox="0 0 24 24" fill = "none" stroke="currentColor" strokeWidth="2" > <path d="M4 14a8 8 0 0116 0" /><line x1="12" y1="14" x2="16" y2="10" / > </svg>,
} as const;

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;

export const getGradient = (key: CategoryIconKey): string => {
  const gradients: Record<CategoryIconKey, string> = {
    tools: "from-blue-400 to-blue-600", hardware: "from-purple-400 to-purple-600",
    pipes: "from-cyan-400 to-cyan-600", fasteners: "from-amber-400 to-amber-600",
    electrical: "from-yellow-400 to-yellow-600", welding: "from-orange-400 to-orange-600",
    safety: "from-red-400 to-red-600", wrench: "from-slate-400 to-slate-600",
    hammer: "from-rose-400 to-rose-600", screwdriver: "from-lime-400 to-lime-600",
    drill: "from-indigo-400 to-indigo-600", cable: "from-teal-400 to-teal-600",
    paint: "from-pink-400 to-pink-600", gloves: "from-green-400 to-green-600",
    helmet: "from-fuchsia-400 to-fuchsia-600", nut: "from-violet-400 to-violet-600",
    bolt: "from-sky-400 to-sky-600", laser: "from-red-400 to-pink-600",
    gauge: "from-emerald-400 to-emerald-600",
  };
  return gradients[key] || "from-gray-400 to-gray-600";
};

export const IconDisplay = ({ icon, size = "md" }: { icon: CategoryIconKey; size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-8 h-8", md: "w-12 h-12", lg: "w-16 h-16" };
  const iconSizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div className= {`${sizes[size]} rounded-lg bg-gradient-to-br ${getGradient(icon)} flex items-center justify-center text-white shadow-md`
}>
  <div className={ iconSizes[size] }> { CATEGORY_ICONS[icon]} </div>
    </div>
  );
};
