'use client';
import { useState } from 'react';
import GradientCard from "./GradientCard";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function CraftGrid({ crafts }) {
    const { user, token } = useAuth();
    const router = useRouter();
    const [savingStates, setSavingStates] = useState({});

    const handleSave = async (craft) => {
        if (!user) {
            toast.error("Please log in to save crafts!");
            router.push('/login');
            return;
        }

        if (savingStates[craft.id] === 'saved' || savingStates[craft.id] === 'saving') return;

        setSavingStates(prev => ({ ...prev, [craft.id]: 'saving' }));

        try {
            const response = await fetch(`${API_URL}/crafts`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: craft.title,
                    emoji: craft.emoji,
                    gradient: craft.gradient
                }),
            });

            if (response.ok) {
                setSavingStates(prev => ({ ...prev, [craft.id]: 'saved' }));
                toast.success(`Saved "${craft.title}"!`);
            } else {
                setSavingStates(prev => ({ ...prev, [craft.id]: 'error' }));
                toast.error(`Could not save "${craft.title}".`);
            }
        } catch (err) {
            setSavingStates(prev => ({ ...prev, [craft.id]: 'error' }));
            toast.error("Network error while saving.");
        }
    };

    const handleSaveAll = async () => {
        if (!user) {
            toast.error("Please log in to save crafts!");
            router.push('/login');
            return;
        }

        const unsavedCrafts = crafts.filter(c => savingStates[c.id] !== 'saved');
        if (unsavedCrafts.length === 0) {
            toast("All ideas are already saved!");
            return;
        }

        let successCount = 0;
        
        // Update all to saving state
        const newStates = { ...savingStates };
        unsavedCrafts.forEach(c => { newStates[c.id] = 'saving'; });
        setSavingStates(newStates);

        for (const craft of unsavedCrafts) {
            try {
                const response = await fetch(`${API_URL}/crafts`, {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        title: craft.title,
                        emoji: craft.emoji,
                        gradient: craft.gradient
                    }),
                });

                if (response.ok) {
                    successCount++;
                    setSavingStates(prev => ({ ...prev, [craft.id]: 'saved' }));
                } else {
                    setSavingStates(prev => ({ ...prev, [craft.id]: 'error' }));
                }
            } catch (err) {
                setSavingStates(prev => ({ ...prev, [craft.id]: 'error' }));
            }
        }

        if (successCount === unsavedCrafts.length) {
            toast.success("Successfully saved all ideas!");
        } else if (successCount > 0) {
            toast.success(`Saved ${successCount} of ${unsavedCrafts.length} ideas.`);
        } else {
            toast.error("Failed to save ideas.");
        }
    };

    if (!crafts.length) {
        return (
            <div className="text-center text-gray-500 font-medium py-8">
                No ideas yet, click "Generate Craft Ideas 🎨" above!
            </div>
        );
    }
    
    return (
        <section>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black">Generated Ideas</h2>
                <button 
                    onClick={handleSaveAll}
                    className="bg-black text-white font-bold py-2 px-4 border-4 border-black hover:bg-white hover:text-black transition-colors text-sm"
                >
                    Save All Ideas ✨
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {crafts.map((craft) => {
                    const state = savingStates[craft.id];
                    return (
                        <div key={craft.id} className="bg-white border-4 border-black overflow-hidden hover:translate-x-1 hover:-translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                            <GradientCard emoji={craft.emoji} gradient={craft.gradient} size="sm" className="border-b-4 border-black" />
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="text-lg font-black mb-2 flex-grow">{craft.title}</h3>
                                <button 
                                    onClick={() => handleSave(craft)}
                                    disabled={state === 'saved' || state === 'saving'}
                                    className={`w-full font-bold py-2 border-2 border-black transition-colors mt-4
                                        ${state === 'saved' 
                                            ? "bg-gray-200 cursor-default" 
                                            : state === 'saving'
                                                ? "bg-yellow-200"
                                                : "bg-green-300 hover:bg-green-400"
                                        }`}
                                >
                                    {state === 'saved' ? "Saved ✓" : state === 'saving' ? "Saving..." : "Save Idea 💾"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}