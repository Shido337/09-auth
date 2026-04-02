"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, getMe } from "@/lib/api/clientApi";
import { usePathname, useRouter } from "next/navigation";
import css from "./AuthProvider.module.css";

interface AuthProviderProps {
  children: React.ReactNode;
}

const PRIVATE_PATHS = ["/profile", "/notes"];

const isPrivatePath = (pathname: string) => PRIVATE_PATHS.some((p) => pathname.startsWith(p));

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const result = await checkSession();
        if (result?.success) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (isPrivatePath(pathname)) {
            router.replace("/sign-in");
            return;
          }
        }
      } catch {
        clearIsAuthenticated();
        if (isPrivatePath(pathname)) {
          router.replace("/sign-in");
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [pathname, setUser, clearIsAuthenticated, router]);

  if (isLoading) {
    return <div className={css.loader}>Loading...</div>;
  }

  if (!isAuthenticated && isPrivatePath(pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
