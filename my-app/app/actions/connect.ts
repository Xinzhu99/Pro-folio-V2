"use server";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/app/lib/db/drizzle";
import { user } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";

export const signup = async (formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    redirect("/?form=signup&error=name-missing");
  }

  const response = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
    asResponse: true,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log("ERREUR API :", errorData);
    if (errorData.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
      console.error("Ce compte existe déjà");
      redirect("/?form=signup&error=USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL");
    } else if (errorData.code === "PASSWORD_TOO_SHORT") {
      console.error("Mot de passe trop court ");
      redirect("/?form=signup&error='PASSWORD_TOO_SHORT'");
    } else {
      console.error("Echec de l'inscription:", errorData.message);
      redirect("/?form=signup&error=generic");
    }
  }

  redirect("/"); // on redirige vers la home page une fois connecté
};

export const signin = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email) redirect("/?form=signin&error=email-missing");
  if (!password) redirect("/?form=signin&error=password-missing");

  // ✅ ÉTAPE 1 : Vérifier le ban AVANT la connexion
  const userData = await db
    .select({
      isBanished: user.isBanished,
      name: user.name,
    })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  // ✅ Si banni, refuser AVANT la connexion (avec le nom dans l'URL)
  if (userData.length > 0 && userData[0].isBanished) {
    const userName = encodeURIComponent(userData[0].name || "");
    redirect(`/?form=signin&error=account-banned&user=${userName}`);
  }

  // ✅ ÉTAPE 2 : Connexion normale (vérifie aussi le mot de passe)
  const response = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log("ERREUR API :", errorData);

    // ⚠️ IMPORTANT : Ne pas révéler si le compte est banni en cas d'erreur
    if (errorData.code === "INVALID_EMAIL_OR_PASSWORD") {
      redirect("/?form=signin&error=invalid-credentials");
    } else {
      console.error("Echec de la connexion:", errorData.message);
      redirect("/?form=signin&error=generic");
    }
  }

  // 2️⃣ Récupérer l'utilisateur AVANT que la session soit créée
  const fullUser = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  if (!fullUser) {
    console.error("Utilisateur introuvable en base");
    redirect("/?form=signin&error=user-not-found");
  }

  const isAdmin = fullUser.isAdmin;
  console.log("isAdmin =", isAdmin);

  // 3️⃣ Redirection immédiate (la session sera active sur la page suivante)
  if (isAdmin) {
    redirect("/admin");
  }

  redirect("/");
};

export const signout = async () => {
  await auth.api.signOut({ headers: await headers() }); // attention à bien passer les headers!
  redirect("/");
};
