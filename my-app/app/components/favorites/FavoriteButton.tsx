"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  addFavorite, removeFavorite, isFavorite,} from "@/app/actions/favorite";

type Props = {
  projectId: number;
};

export default function FavoriteButton({ projectId }: Props) {
  const [favorite, setFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  //  Vérifier AU CHARGEMENT si le projet est déjà favori
  useEffect(() => {
    async function checkFavorite() {
      const result = await isFavorite(projectId);
      setFavorite(result);
    }
    checkFavorite();
  }, [projectId]);

  //  Gérer le clic (ajout / suppression)
  async function handleClick() {
    setLoading(true);

    try {
      if (favorite) {
        await removeFavorite(projectId);
        setFavorite(false);
      } else {
        await addFavorite(projectId);
        setFavorite(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="absolute top-3 left-3 z-20 bg-white/90 rounded-full p-2 shadow"
    >
      <Heart
        className={`w-6 h-6 transition-colors ${
          favorite ? "text-red-500 fill-red-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}
