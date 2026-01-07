"use client"

import React, { useState } from "react"

type Props = {
  githubUrl: string
  projectName: string
  height?: string
}

export default function ProjectImage({ githubUrl, projectName, height = "h-48" }: Props) {
  const [imageError, setImageError] = useState(false)

  const getThumbnailUrl = (url?: string) => {
    if (!url) return '/folder-code.svg';
    // ✅ Convertir l'URL GitHub en URL raw correcte
    // De: https://github.com/user/repo
    // À:  https://raw.githubusercontent.com/user/repo/main/thumbnail.png
    
    try {
      const cleanUrl = url.replace(/\/$/, '').replace(/\.git$/i, ''); // Enlever / final et .git
      if (!cleanUrl.includes('github.com')) return '/folder-code.svg';
      const rawUrl = cleanUrl
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/'); // Supprimer /blob/ si présent

      // Essayer d'abord avec 'main', sinon 'master'
      return `${rawUrl}/main/thumbnail.png`;
    } catch (e) {
      return '/folder-code.svg';
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Essayer avec 'master' si 'main' échoue, sinon basculer sur l'icône par défaut
    const img = e.currentTarget;
    if (img && img.src.includes('/main/')) {
      img.src = img.src.replace('/main/', '/master/');
    } else {
      setImageError(true);
    }
  }

  return (
    <div className={`relative ${height} overflow-hidden bg-gray-100`}>
      {imageError ? (
        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <img
              className="text-gray-500 w-18 h-18 object-contain justify-center mx-auto"
              src="/folder-code.svg"
              alt="Icône dossier"
            />
            <p className="text-gray-700 text-sm md:text-lg font-semibold mt-2 md:mt-4">
              Aucune image disponible
            </p>
          </div>
        </div>
      ) : (
        <img
          src={getThumbnailUrl(githubUrl)}
          alt={projectName}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      )}
    </div>
  )
}