import { Layout } from "@/components/Layout";
import { RecipeGenerator } from "@/components/RecipeGenerator";
import { motion } from "framer-motion";

export default function Recipes() {
  return (
    <Layout>
      <div className="space-y-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            Recipe Explorer
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover AI-generated recipes tailored to your preferences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RecipeGenerator />
        </motion.div>
      </div>
    </Layout>
  );
}
