"use client";

import { ComponentType, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";

function withRole<T extends object>(
  WrappedComponent: ComponentType<T>,
  requiredRole: string
) {
  const AuthenticatedRole = (props: T) => {
    const router = useRouter();
    const { user, loading } = useContext(UserContext);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      if (!loading && !redirecting) {
        if (!user) {
          setRedirecting(true);
          router.replace("/login");
        } else if (user.role !== requiredRole) {
          setRedirecting(true);
          router.replace("/landing");
        }
      }
    }, [user, loading, router, redirecting]);

    // tampilkan loading selama user belum tersedia atau sedang redirect
    if (loading || redirecting) return <div>Loading...</div>;

    // jika role cocok, render component
    return <WrappedComponent {...props} />;
  };

  // beri displayName supaya mudah debug
  AuthenticatedRole.displayName = `withRole(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return AuthenticatedRole;
}

export default withRole;
