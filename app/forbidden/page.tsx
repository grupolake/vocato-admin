import { SignOutButton } from "@clerk/nextjs";
import { Suspense } from "react";

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-start justify-center gap-4 px-6">
      <p className="lf-eyebrow">Acesso negado</p>
      <h1 className="text-3xl font-extrabold tracking-tight text-strong">
        Sua conta não tem acesso ao painel
      </h1>
      <p>
        Peça para um administrador liberar o role <code>admin</code> no seu
        usuário e entre de novo.
      </p>
      <Suspense>
        <SignOutButton>
          <button className="h-10 rounded-full bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover">
            Sair
          </button>
        </SignOutButton>
      </Suspense>
    </main>
  );
}
