"use client";

import { ComponentType, FC, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

const withRole = <T extends object>(
  WrappedComponent: ComponentType<T>,
  requiredRole: string
) => {
  const AuthenticatedRole = (props: T) => {
    const router = useRouter();
    const { user, loading } = useUser()
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
      if (!loading && !redirecting) {
       if (!user) {
  setRedirecting(true);
  router.replace("Authen/login");
  return;
} else if (user.role !== requiredRole) {
  setRedirecting(true);
  router.replace("/aboutHOC");
  return;
}
      }

    }, [user, loading, router, redirecting]);

    // tampilkan loading selama user belum tersedia atau sedang redirect
    if (loading || redirecting) return <div>Loading...</div>;

    // jika role cocok, render component
    return <WrappedComponent {...props} />;
  }; 
  return AuthenticatedRole;
  
}

export default withRole;
