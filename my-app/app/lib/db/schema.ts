import { relations } from "drizzle-orm";
import { boolean, index } from "drizzle-orm/pg-core";
import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

// ========================================
// TABLES DE BASE
// ========================================

export const adaTable = pgTable("ada_projects", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
});

export const promotionsTable = pgTable("promotions", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  isAdmin: boolean("isAdmin").default(false).notNull(),
  isBanished: boolean("isBanished").default(false).notNull(),
});

export const projectsTable = pgTable("students_projects", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    github_url: text("github_url").notNull(),
    demo_url: text("demo_url"),
    promotion_id: integer("promotion_id").references(() => promotionsTable.id),
    ada_project_id: integer("ada_project_id").references(() => adaTable.id),
    user_id: text("user_id").references(() => user.id),
    published_at: timestamp("published_at"),
    created_at: timestamp("created_at").notNull().defaultNow(),
});


export const commentsTable = pgTable("comments", {
    id: serial("id").primaryKey(),
    message: text("message").notNull(),
    // ✅ CORRIGÉ : text au lieu de integer (car usersTable.id est text)
    user_id: text("user_id").references(() => user.id),
    project_id: integer("project_id").references(() => projectsTable.id),
    created_at: timestamp("created_at").notNull().defaultNow(),
});

// ========================================
// TABLES D'AUTHENTIFICATION (Better-Auth)
// ========================================

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ========================================
// RELATIONS
// ========================================

// ✅ MISE À JOUR : User a aussi des commentaires
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  comments: many(commentsTable),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const favoritesTable = pgTable("favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  projectId: integer("project_id").notNull().references(() => projectsTable.id),
  createdAt: timestamp("created_at").notNull(),
});


// // ✅ AJOUTÉ : Relations pour les projets
// export const projectRelations = relations(projectsTable, ({ one, many }) => ({
//   // Un projet appartient à UNE promotion
//   promotion: one(promotionsTable, {
//     fields: [projectsTable.promotion_id],
//     references: [promotionsTable.id],
//   }),
//   // Un projet appartient à UN ada_project
//   adaProject: one(adaTable, {
//     fields: [projectsTable.ada_project_id],
//     references: [adaTable.id],
//   }),
//   // Un projet peut avoir PLUSIEURS commentaires
//   comments: many(commentsTable),
// }));

// // ✅ AJOUTÉ : Relations pour les promotions
// export const promotionRelations = relations(promotionsTable, ({ many }) => ({
//   projects: many(projectsTable),
// }));

// // ✅ AJOUTÉ : Relations pour ada_projects
// export const adaProjectRelations = relations(adaTable, ({ many }) => ({
//   studentProjects: many(projectsTable),
// }));

// // ✅ AJOUTÉ : Relations pour les commentaires
// export const commentRelations = relations(commentsTable, ({ one }) => ({
//   // Un commentaire appartient à UN user
//   user: one(usersTable, {
//     fields: [commentsTable.user_id],
//     references: [usersTable.id],
//   }),
//   // Un commentaire appartient à UN projet
//   project: one(projectsTable, {
//     fields: [commentsTable.project_id],
//     references: [projectsTable.id],
//   }),
// }));