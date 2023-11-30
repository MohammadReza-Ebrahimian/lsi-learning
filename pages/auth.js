import { useEffect } from "react";
import AuthForm from "../components/auth/auth-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function AuthPage() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") {
    router.replace("/");
  }
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <AuthForm />;
  }
}

export default AuthPage;
