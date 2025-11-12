"use client";

import { ComponentType, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

const withAllRole = <T extends object>(
  WrappedComponent: ComponentType<T>,
  allowedRoles: string[] // contoh: ['ADMIN'], ['USER', 'ADMIN']
) => {
  const AuthenticatedRole = (props: T) => {
    const router = useRouter();
    const { user, loading } = useUser();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      if (loading || redirecting) return;

      if (!user) {
        setRedirecting(true);
        router.replace("Authen/login");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        setRedirecting(true);
        router.replace("/aboutHOC");
        return;
      }
    }, [user, loading, router, redirecting]);

    // ⏳ tampilkan loader selama proses
    if (loading || redirecting) {
      return (
        <div className="flex items-center justify-center h-screen text-xl font-semibold text-gray-600">
          Loading...
        </div>
      );
    }

    // ✅ jika role cocok, render halaman
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedRole;
};

export default withAllRole;
