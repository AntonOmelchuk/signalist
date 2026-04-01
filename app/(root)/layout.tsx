import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  if (!auth) redirect("/sign-in");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) redirect("/sign-in");

  const {
    user: { id, name, email },
  } = session;

  const user = { id, name, email };

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default Layout;
