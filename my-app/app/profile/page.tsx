import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserProjects } from "@/app/actions/project";
import ProjectCards from "@/app/components/ProjectCards";
import UserProfileCard from "@/app/components/profile/UserProfileCard";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  //récupérer les données utilisateur : user et projets
  const user = session.user;
  const userProjects = await getUserProjects(user.id);
  
  // Compter uniquement les projets publiés
  const publishedCount = userProjects.filter(p => p.published_at).length;

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Profil avec édition */}
        <UserProfileCard user={{ ...user, image: user.image ?? null }} />

        {/* Liste des Projets */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-red-500">Mes Projets</h2>
            <div className="flex gap-4 text-sm">
              <span className="bg-gray-800 px-3 py-1 rounded-full">
                {publishedCount} publié(s)
              </span>
              <span className="bg-gray-800 px-3 py-1 rounded-full">
                {userProjects.length - publishedCount} brouillon(s)
              </span>
            </div>
          </div>

          {userProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <ProjectCards key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-dashed border-gray-700">
              <p className="text-gray-500 text-lg">Vous n'avez pas encore créé de projet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}