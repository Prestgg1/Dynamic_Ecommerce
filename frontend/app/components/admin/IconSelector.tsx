// components/admin/IconSelector.tsx
import { CATEGORY_ICONS, getGradient, type CategoryIconKey } from "~/lib/admin-icons";

export function IconSelector({ selected, onSelect, onClose }: { selected: CategoryIconKey; onSelect: (icon: CategoryIconKey) => void; onClose: () => void }) {
  const icons = Object.keys(CATEGORY_ICONS) as CategoryIconKey[];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="p-4 border-b flex justify-between">
          <h3 className="font-bold">Select Icon</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-4 grid grid-cols-4 md:grid-cols-6 gap-3 max-h-[60vh] overflow-auto">
          {icons.map(icon => (
            <button key={icon} onClick={() => onSelect(icon)} className={`p-3 rounded-lg border-2 transition-all ${selected === icon ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}>
              <div className={`w-12 h-12 mx-auto rounded-lg bg-gradient-to-br ${getGradient(icon)} flex items-center justify-center text-white`}>
                <div className="w-6 h-6">{CATEGORY_ICONS[icon]}</div>
              </div>
              <p className="text-xs text-center mt-2 capitalize">{icon}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
