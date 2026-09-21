'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import { Played } from "@/types/game.types";

export function PlayedPageCLient() {
    const [Played, setPlayed] = useState<Played[]>([]);

    useEffect(() => {
        const getPlayed = async () => {
            const res = await fetch("/api/played");
            const data = await res.json();

            setPlayed(data)
        };
        getPlayed();
    }, []);

    const handleRemovePlayed = async (id: number) => {
        const res = await fetch("/api/played", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });
        const text = await res.text();

        if (!res.ok) {
            console.log("delete favorite error:", res.status, text);
            return;
        }
        setPlayed((prev) => prev.filter((game) => game.id !== id))
    }

    return(
        <div className="min-h-screen bg-linear-to-br from-purple-600/10 via-sky-600/20 to-purple-600/20 p-5 rounded-2xl">
            <h1 className="text-2xl text-center p-3">My Played</h1>
            <h2 className="text-xl m-3 text-center mx-120 py-2 px-3 bg-sky-500/40 hover:ring-2 ring-sky-400 hover:transition-colors duration-500 ease-in">Played: {Played.length}</h2>
            <div className="flex justify-end">
                <Link href={"/catalog"} className=" text-md text-gray-200  mb-5 hover:text-gray-50">Explore Games</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-4">
                {Played.map((game) => (
                    <div key={game.id} className="object-cover bg-cyan-600/5 mx-auto p-8 border-2 border-white/30 rounded-2xl">
                        <img src={game.background_image} alt={game.name} className="w-80 h-70 m-1 hover:border-cyan-500/70 hover:border-1 hover:transition-colors duration-500 hoevr:ring-noone border-transparent" />
                        <div className="text-center">
                            <h2>{game.name}</h2>
                            <p>{game.released}</p>
                        </div>
                        <button
                            onClick={() => handleRemovePlayed(game.id)}
                            className="bg-rose-600/50 p-2 hover:bg-rose-700 cursor-pointer font-extralight rounded-2xl">Remove</button>
                        <Link href={`game/${game.id}`}
                            className="px-3 py-2 m-4 bg-sky-600/50 hover:bg-sky-600 font-extralight rounded-2xl">Detail</Link>
                    </div>

                ))}
            </div>
        </div>

    )
}