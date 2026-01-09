"use server";

import { db } from "@/app/lib/db/drizzle";
import { favoritesTable, projectsTable } from "@/app/lib/db/schema";
import { getSession } from "@/app/actions/session";
import { and, eq, sql } from "drizzle-orm";
import type { ProjectWithRelations } from "@/app/types";

export async function addFavorite(projectId: number) {
  const session = await getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté");
  }

  await db.insert(favoritesTable).values({
    id: crypto.randomUUID(),
    userId: session.id,
    projectId,
    createdAt: new Date(),
  });
}

export async function isFavorite(projectId: number) {
  const session = await getSession();

  if (!session) {
    return false;
  }

  const result = await db
    .select({ id: favoritesTable.id })
    .from(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, session.id),
        eq(favoritesTable.projectId, projectId)
      )
    )
    .limit(1);

  return result.length > 0;
}

export async function removeFavorite(projectId: number) {
  const session = await getSession();

  if (!session) {
    throw new Error("Utilisateur non connecté");
  }

  await db
    .delete(favoritesTable)
    .where(
      and(
        eq(favoritesTable.userId, session.id),
        eq(favoritesTable.projectId, projectId)
      )
    );
}

export async function getFavorites(): Promise<ProjectWithRelations[]> {
  const session = await getSession();
  if (!session) {
    throw new Error("Utilisateur non connecté");
  }

  const result = await db.execute(
    sql`
      SELECT 
        p.*,
        
        -- Infos promotion
        json_build_object(
          'id', prom.id,
          'name', prom.name
        ) as promotion,
        
        -- Infos ada_project
        json_build_object(
          'id', ada.id,
          'name', ada.name
        ) as ada_project,
        
        -- Nombre de commentaires
        COUNT(c.id) as comments_count,
        
        -- Commentaires groupés
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'message', c.message,
              'created_at', c.created_at,
              'user', json_build_object(
                'id', u.id,
                'name', u.name,
                'image', u.image,
                'isBanished', u."isBanished"
              )
            )
            ORDER BY c.created_at DESC
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as comments
        
      FROM favorites f
      INNER JOIN students_projects p ON p.id = f.project_id
      LEFT JOIN promotions prom ON prom.id = p.promotion_id
      LEFT JOIN ada_projects ada ON ada.id = p.ada_project_id
      LEFT JOIN comments c ON c.project_id = p.id
      LEFT JOIN "user" u ON u.id = c.user_id
      
      WHERE f.user_id = ${session.id}
      
      GROUP BY p.id, prom.id, prom.name, ada.id, ada.name
      ORDER BY p.published_at DESC NULLS LAST
    `
  );

  return result.rows as ProjectWithRelations[];
}

