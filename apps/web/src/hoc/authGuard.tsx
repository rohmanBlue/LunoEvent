import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { ComponentType, useContext, useEffect } from 'react';

const withAuth = (WrappedComponent: ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
      console.log(user);

      if (!user) {
        router.replace('Authen/login');
      } else {
        if (user.role === 'ADMIN') {
          router.replace('/');
        } else {
          router.replace('/aboutHOC');
        }
      }
    }, [router, user]);

    if (user?.email) {
      return <WrappedComponent {...props} />;
    } else {
      return null;
    }
  };
  return AuthenticatedComponent;
};

export default withAuth;
