type SwitchProps = { checked: boolean; onCheckedChange?: (v: boolean) => void; id?: string };
export function Switch({ checked, onCheckedChange, id }: SwitchProps) {
  return (
    <label htmlFor={id} style={{ cursor: "pointer" }} className="inline-flex items-center">
      <input id={id} type="checkbox" className="hidden" checked={checked} onChange={(e) => onCheckedChange?.(e.target.checked)} />
      <span className={`w-10 h-6 rounded-full transition ${checked ? "bg-[#0095da]" : "bg-neutral-300"} relative`}>
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${checked ? "translate-x-4" : ""}`}></span>
      </span>
    </label>
  );
}