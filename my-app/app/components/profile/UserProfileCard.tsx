"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { updateUserProfile, updateUserImage } from "@/app/actions/users";
import type { UserProfileCardProps } from "@/app/types";


export default function UserProfileCard({ user }: UserProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Gestion de l'upload d'image
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setError("Veuillez sélectionner une image valide");
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Créer un FormData pour l'upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload vers un service (exemple avec Cloudinary, Uploadthing, etc.)
      // Pour l'instant, on utilise un service gratuit comme imgbb ou on convertit en base64
      
      // Convertir en base64 (simple mais pas idéal pour de vraies applis)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        
        // Sauvegarder dans la base de données
        await updateUserImage(base64String);
      };
      reader.readAsDataURL(file);


    } catch (err) {
      setError("Erreur lors du téléchargement de l'image");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;

    // Vérifier que si on veut changer le mot de passe, l'ancien est fourni
    if (newPassword && !currentPassword) {
      setError("Veuillez entrer votre mot de passe actuel");
      setIsLoading(false);
      return;
    }

    try {
      await updateUserProfile(formData);
      setIsEditing(false);
      
      // Recharger la page pour voir les changements
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-6 mb-12 border-b border-gray-800 pb-8">
      {/* Avatar avec possibilité de changement */}
      <div className="relative group">
        <img 
          src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=96&background=DC2626&color=fff`}
          alt={user.name} 
          className="w-20 h-20 rounded-full border-2 border-red-500 object-cover"
        />
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="absolute bottom-0 right-0 bg-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
          title="Changer la photo"
        >
          {isLoading ? (
            <Loader2 size={16} className="text-white animate-spin" />
          ) : (
            <Camera size={16} className="text-white" />
          )}
        </button>
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Infos utilisateur */}
      <div className="flex-1">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        {!isEditing ? (
          <>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-red-500 hover:text-red-400 underline"
              >
                Éditer le profil
              </button>
            </div>
            <p className="text-gray-400">{user.email}</p>
          </>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nom</label>
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                required
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full max-w-md text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={user.email}
                required
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full max-w-md text-white"
              />
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-sm font-semibold mb-3 text-gray-300">Changer le mot de passe</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Mot de passe actuel *
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="Requis pour changer le mot de passe"
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full max-w-md text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Laisser vide pour ne pas changer"
                    minLength={8}
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-2 w-full max-w-md text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 caractères</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                disabled={isLoading}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}