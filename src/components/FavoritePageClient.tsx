'use client';

import { useEffect, useState } from 'react';
import { Favorite } from '@/types/game.types';
import Link from 'next/link';
import { GameDetailContent } from './GameDetailContent';

export function FavoritePageClient() {
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    useEffect(() => {
        const getFavorites = async () => {
            const res = await fetch("/api/favorites");
            const data = await res.json();

            setFavorites(data);
        };
        getFavorites();
    }, []);

    const handleRemoveFavorite = async (id: number) => {
        const res = await fetch("/api/favorites", {
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
        setFavorites((prev) => prev.filter((game) => game.id !== id))
    }

    return (
        <div className='p-6 bg-gradient-to-br from-indigo-800/30 via-sky-800/30 to-fuchsia-800/30  rounded-2xl'>
            <h1 className='text-2xl text-center mb-4'>My Favorites</h1>
            <h2 className='text-md bg-sky-500/40 text-center px-2 py-2 mx-120 my-2'>Favorite: {favorites.length}</h2>
            <div className="flex justify-end">
                <Link href={"/catalog"} className=" text-md text-gray-200  mb-5 hover:text-gray-50">Explore Games</Link>
            </div>
            <div className='bg-white/5 grid p-2 grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {favorites.map((game) => (
                    <div key={game.id} className='border border-white/30 px-6 py-6 bg-sky-500/10 mx-auto my-3 rounded-xl '>
                        <img src={game.background_image} alt={game.name} className='w-80 h-70 mx-1 rounded-xl' />
                        <div className='text-sm text-gray-300 text-center'>
                            <h2>{game.name}</h2>
                            <p>{game.released}</p>
                        </div>
                        <button
                            onClick={() => handleRemoveFavorite(game.id)}
                            className='bg-rose-600/50 hover:bg-rose-600 shadow-lg shadow-red-500/30 transition-colors duration-200  p-2 m-2 rounded-xl cursor-pointer'>Remove</button>
                        <Link href={`/game/${game.id}`}>
                            <button className='bg-blue-600/50 hover:bg-blue-600 p-2 px-6 rounded-xl transition-colors duration-200 cursor-pointer'>detail</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}