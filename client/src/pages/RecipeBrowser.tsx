// Core react imports
import { useEffect } from "react";

// React component imports
import RecipeCard from "../components/RecipeCard";
import RecipeNavbar from "../components/RecipeNavbar"

// Secondary package imports
import {motion} from "framer-motion"

// RecipeBrowser component export
export default function RecipeBrowser() {
  return (
    <motion.div className="bg-ivory h-screen"
        initial={{opacity: 0.6}}
        animate={{opacity: 1}}
        transition={{duration: 2}}
    >
      <RecipeNavbar />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-15 xl:gap-15 lg:px-10 xl:px-20 xl:pt-18 auto-rows-fr pt-20">
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
          <RecipeCard title="Pumpkin pie" description ="A lovely pie to warm any dinner. Excellent for thanksgiving and other occasions." timeTaken="15 min." productCost="7" author="@baker_grandma" />
      </div>
    </motion.div>
  )
}