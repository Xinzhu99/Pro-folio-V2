import { redirect } from "next/navigation";
import { auth } from "../lib/auth";
import { db } from "../lib/db/drizzle";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { user } from "@/app/lib/db/schema";
import { getAllProjects, getPromotions } from "../actions/project";
import FilterDataAdmin from "../components/admin/FilterDataAdmin";

export default async function Admin() {
    const session = await auth.api.getSession({ headers: await headers() });
    const projects = await getAllProjects();
    const promos = await getPromotions();

    if (session === null) {
        redirect("/")
    }

    const connectedUser = await db.select({ isAdmin: user.isAdmin }).from(user).where(eq(user.id, session?.user.id));

    // console.log("💩", connectedUser)

    if (connectedUser[0].isAdmin !== true) {
        redirect("/");
    }
    return (
        <div>
            <FilterDataAdmin
                projects={projects}
                promos={promos}
            />
        </div>
    )
}