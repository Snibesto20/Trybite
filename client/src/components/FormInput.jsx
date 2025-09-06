// Assets imports
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function FormInput(p) {
    return (
        <div className="relative flex flex-col text-left w-full">
            <FaExclamationCircle className={`absolute text-terracotta right-3 top-10.5 ${p.inputState === "error" ? "block" : "hidden"}`} />
            <FaCheckCircle className={`absolute text-olive right-3 top-10.5 ${p.inputState === "success" ? "block" : "hidden"}`} />
            <span>
                <h3 className={`translate-y-2.5 bg-ivory ml-2 px-3 inline-block ${p.inputState === "neutral" ? "text-espresso" : p.inputState === "error" ? "text-terracotta" : "text-olive"}`}>
                    {p.label}
                </h3>
            </span>
            <input className={`outline-0 border px-5 py-3 max-h-40 min-h-12 ${p.inputState === "neutral" ? "text-espresso" : p.inputState === "error" ? "text-terracotta border-terracotta" : "text-olive border-olive"}`} type={p.type}
                maxLength={p.maxLength} onChange={e => p.onChange(e.target.value)} onFocus={p.onFocus} value={p.value} />
            <p className={`absolute -bottom-1 text-xs mt-1 h-1 ${p.inputState === "error" ? "text-terracotta" : p.inputState === "success" ? "text-olive" : "text-terracotta"}`}>
                {p.inputState === "error" || p.inputState === "success" ? p.errorMsg : ""}
            </p>
        </div>
    )
}
