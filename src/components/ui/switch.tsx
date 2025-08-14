type SwitchProps = { checked: boolean; onCheckedChange?: (v: boolean) => void; id?: string; disabled?: boolean };
export function Switch({ checked, onCheckedChange, id, disabled }: SwitchProps) {
  return (
    <label htmlFor={id} style={{ cursor: "pointer" }} className="inline-flex items-center">
      <input id={id} type="checkbox" className="hidden" checked={checked} disabled={disabled} onChange={(e) => onCheckedChange?.(e.target.checked)} />
      <span className={`w-10 h-6 rounded-full transition ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${checked ? "bg-[#0095da]" : "bg-neutral-300"} relative`}>
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${checked ? "translate-x-4" : ""}`}></span>
      </span>
    </label>
  );
}