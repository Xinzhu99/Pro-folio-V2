"use server";

import { db } from "@/app/lib/db/drizzle";
import { favoritesTable,projectsTable } from "@/app/lib/db/schema";
import { getSession } from "@/app/actions/session";
import { and, eq,sql } from "drizzle-orm";

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

import { promotionsTable } from "@/app/lib/db/schema";

export async function getFavorites() {
  const session = await getSession();
  if (!session) {
    throw new Error("Utilisateur non connecté");
  }

  const rows = await db
    .select()
    .from(favoritesTable)
    .innerJoin(
      projectsTable,
      eq(favoritesTable.projectId, projectsTable.id)
    )
    .leftJoin(
      promotionsTable,
      eq(projectsTable.promotion_id, promotionsTable.id)
    )
    .where(eq(favoritesTable.userId, session.id));

  return rows.map((row) => ({
    ...row.students_projects,
    promotion: row.promotions,
  }));
}


