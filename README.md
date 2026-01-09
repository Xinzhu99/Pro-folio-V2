# 🌐 Adaverse 2.0

Plateforme collaborative de partage de projets étudiants avec système d'authentification et gestion de communauté.

**Projet de groupe (4 personnes) • 2 semaines • Ada Tech School**

---

## 🎯 Objectifs du projet

Ce projet vise à enrichir la plateforme Adaverse existante en y intégrant un écosystème complet d'authentification et de gestion de communauté. 

---

## ✨ Fonctionnalités principales

### 🔐 Système d'authentification complet
- **Inscription** : création de compte avec email et mot de passe
- **Connexion/Déconnexion** : gestion sécurisée des sessions utilisateur via cookies
- **Protection des routes** : redirection automatique selon le statut de connexion
- **Gestion des erreurs** : retours visuels clairs sur les états de chargement et les erreurs de formulaire

### 💬 Système de commentaires interactif
- **Publication** : tout utilisateur·ice connecté·e peut commenter un projet
- **Affichage dynamique** : les commentaires sont triés du plus récent au plus ancien
- **Gestion personnelle** : édition et suppression de ses propres commentaires
- **Métadonnées** : affichage de l'auteur·ice, date de publication et nombre total de commentaires par projet
- **Persistance** : sauvegarde en base de données avec liaison aux comptes utilisateurs

### 👑 Panel d'administration
- **Modération des contenus** : publication/dépublication des projets
- **Modération des commentaires** : suppression de n'importe quel commentaire
- **Gestion des utilisateur·ices** : bannissement des comptes problématiques
- **Sécurisation** : routes admin protégées avec redirection automatique

### 📱 Design responsive et accessible
- **Mobile-first** : interface adaptée à tous les écrans
- **Accessibilité** : score de 100% sur Lighthouse (accessibilité + best practices)
- **Navigation intuitive** : barre de navigation dynamique selon le statut de connexion

---

## 🛠️ Stack technique

| Catégorie | Technologie |
|-----------|-------------|
| **Framework** | Next.js 15 (App Router) |
| **Langage** | TypeScript |
| **Styling** | Tailwind CSS |
| **Base de données** | PostgreSQL (Neon) |
| **ORM** | Drizzle ORM |
| **Authentification** | Better Auth |
| **Déploiement** | Vercel |

---

## 🎓 Compétences acquises

### Architecture & Backend
✅ Mise en place d'un système d'authentification sécurisé (signup, signin, signout)  
✅ Gestion des sessions utilisateur avec cookies HTTP-only  
✅ Protection des routes et des données selon le statut de connexion  
✅ Implémentation d'un système de rôles (user/admin)  
✅ Relations entre entités en base de données (users, projects, comments)

### Frontend & UX
✅ Création de formulaires avec gestion des états (loading, error, success)  
✅ Redirections conditionnelles selon l'état d'authentification  
✅ Design responsive et accessible (mobile-first)  
✅ Interface dynamique avec mise à jour en temps réel

### Bonnes pratiques & Méthodologie
✅ Utilisation de TypeScript pour un code type-safe  
✅ Workflow Git en équipe (branches stable/bonus)  
✅ Déploiement continu sur Vercel  
✅ Architecture modulaire et maintenable

---


## 👥 Équipe

Projet réalisé en collaboration avec 3 autres développeur·euses en formation à Ada Tech School.

---
