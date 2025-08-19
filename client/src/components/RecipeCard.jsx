// Core react imports
import { useState } from "react"

// Secondary package imports
import {motion} from "framer-motion"

// Assets import
import {  FaClock, FaDollarSign } from "react-icons/fa"

// RecipeCard component export
export default function RecipeCard(p) {
    // Essential variables declaration
    const [cardHovered, setCardHovered] = useState(false)

    return (
        <div className="w-full rounded-md p-4 flex flex-col h-full text-espresso" onMouseOver={() => setCardHovered(true)} onMouseOut={() => setCardHovered(false)}>
            <div className="aspect-[16/9] w-full overflow-hidden rounded-md">
            <motion.img src="/misc/pumpkin-pie.jpg" className="w-full h-full object-cover" animate={{scale: cardHovered ? 1.05 : 1}} />
            </div>
            <div className="flex justify-between items-center mt-3">
            <h1 className="text-terracotta underline text-md font-semibold">{p.title}</h1>
            <h4 className="text-xs mb-1">{p.author}</h4>
            </div>
            <div className="flex flex-col border-l-2 pl-2 mt-1 gap-3 border-espresso text-sm">
            <p>{p.title}</p>
            <div className="flex gap-2">
                <div className="flex items-center gap-1">
                    <FaClock className="text-espresso" />
                    <h4 className="font-semibold">{p.timeTaken}</h4>
                </div>
                <div className="flex items-center gap-1">
                    <FaDollarSign className="text-espresso" />
                    <h4 className="font-semibold">{p.productCost}</h4>
                </div>
            </div>
            </div>
        </div>
    )
}