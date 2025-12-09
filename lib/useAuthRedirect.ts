import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthRedirect(redirectTo: string, formStateKey: string) {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect && window.localStorage.getItem(formStateKey)) {
      // After sign-in, restore form state and redirect
      router.replace(redirect);
    }
  }, [router, formStateKey]);
}
