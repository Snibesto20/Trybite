// Assets imports
import { FaExclamationCircle } from 'react-icons/fa';

export default function FormInput(p) {
    return (
        <div className="relative flex flex-col text-left w-full">
            <FaExclamationCircle className={`absolute text-terracotta right-3 top-10.5 ${p.inputState === 'neutral' ? 'hidden' : 'block'}`} />
            <span>
                <h3
                    className={`translate-y-2.5 bg-ivory ml-2 px-3 inline-block ${p.inputState === 'neutral' ? 'text-espresso' : 'text-terracotta'}`}>
                    {p.label}
                </h3>
            </span>
            <input className={`outline-0 border px-5 py-3 max-h-40 min-h-12 ${p.inputState === 'neutral' ? 'text-espresso' : 'text-terracotta border-terracotta'}`} type={p.type}
                maxLength={p.maxLength} onChange={e => p.onChange(e.target.value)} value={p.value} />
                <p className={`absolute -bottom-1 text-xs text-terracotta mt-1 h-1 ${p.inputState === 'neutral' ? 'visible' : 'visible'}`}>{p.errorMsg}</p>
            </div>
        )
}