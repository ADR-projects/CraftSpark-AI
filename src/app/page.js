'use client';

import { useState } from "react";
import toast from 'react-hot-toast';
import Header from '../components/Header.jsx'
import ProfileSection from '@/components/ProfileSection.jsx';
import MaterialsSection from '@/components/Materials.jsx';
import CraftsGrid from '@/components/CraftsGrid.jsx';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function Home() {
  const [skills, setSkills] = useState("Painting, Origami");
  const [themes, setThemes] = useState("Eco-friendly, Cutesy");
  const [wantToTry, setWantToTry] = useState("Clay-modelling");
  const [materials, setMaterials] = useState(["clay", "plastic bottle", "waste paper"]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCrafts, setGeneratedCrafts] = useState([]);

  const generateCraftIdeas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/generate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, themes, wantToTry, materials }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.craftsData) {
        const processed = Object.entries(data.craftsData).map(([id, craft]) => ({
          id: Number(id),
          title: craft.title,
          emoji: craft.emoji,
          gradient: craft.gradient,
        }));
        setGeneratedCrafts(processed);
        localStorage.setItem("generatedCrafts", JSON.stringify(processed));
        toast.success(`Generated ${processed.length} craft ideas!`);
      } else {
        toast.error("No ideas returned — try different materials!");
      }
    } catch (e) {
      toast.error("Could not reach the AI — is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-amber-50">
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-6">
        <Header />
        <ProfileSection
          skills={skills}
          setSkills={setSkills}
          themes={themes}
          setThemes={setThemes}
          wantToTry={wantToTry}
          setWantToTry={setWantToTry}
        />

        <MaterialsSection materials={materials} setMaterials={setMaterials} />

        <div className="text-center mb-8">
          <button
            onClick={generateCraftIdeas}
            disabled={isLoading}
            className={
              `font-bold py-3 px-6 border-4 border-black transition-all
     shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
     ${isLoading
                ? "bg-gray-400 cursor-not-allowed shadow-none"
                : "bg-slate-900 text-white hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              }`
            }
          >
            {isLoading ? "Generating..." : "Generate Craft Ideas 🎨"}
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pb-15 px-4"><CraftsGrid crafts={generatedCrafts} /></div>
    </main>
  );
}
