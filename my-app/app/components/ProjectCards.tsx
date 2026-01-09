"use client";

import Link from "next/link";
import type { ProjectWithRelations } from "@/app/types";
import ProjectImage from "./ProjectImage";
import FavoriteButton from "./favorites/FavoriteButton";
//test
type Props = {
  project: ProjectWithRelations;
};

export default function ProjectCard({ project }: Props) {
  // plus de project.students_projects : tout est au niveau root
  const p = project;

  return (
    <div className="relative">
      <FavoriteButton projectId={project.id} />
    <Link
      href={`/project/${p.slug}`}
      className="group block bg-white rounded-xl shadow-md hover:shadow-2xl overflow-hidden transition-all duration-300 border-2 relative hover:-translate-y-1 border-white cursor-pointer"
    >
      <div className="group-hover:scale-110 transition-transform duration-500">
        <ProjectImage
          githubUrl={p.github_url}
          projectName={p.name}
          height="h-48"
        />
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="inline-block bg-ada-red text-white text-xs font-bold px-3 py-1.5 rounded  shadow-lg">
          {project.promotion?.name || "?"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-3 text-ada-dark group-hover:text-ada-red">
          {p.name}
        </h3>

        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span>📅</span>
          {p.published_at &&
            new Date(p.published_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
        </p>
         {/* ✅ AJOUT : Nombre de commentaires */}
        <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
          <span>💬</span>
          {project.comments_count}{" "}
          {project.comments_count > 1 ? "commentaires" : "commentaire"}
        </p>

        <div className="mt-4 flex items-center text-ada-red font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Voir le projet
          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </div>
      </div>
    </Link>
    </div>
  );
}