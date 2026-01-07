import { getFavorites } from "@/app/actions/favorite";
import { getSession } from "@/app/actions/session";
import ProjectCard from "../components/ProjectCards";


export default async function FavoritesPage() {
  const session = await getSession();

  if (!session) {
    return <p>Vous devez être connecté pour voir vos favoris.</p>;
  }

  const favorites = await getFavorites();

  if (favorites.length === 0) {
    return <p>Vous n’avez encore aucun favori.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {favorites.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
