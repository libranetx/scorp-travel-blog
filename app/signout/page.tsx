'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    // Sign out and redirect to homepage
    signOut({ 
      redirect: false, // We handle redirect manually
    }).then(() => {
      router.push('/'); // Redirect after sign-out
    });
  }, [router]);

  return (
   <div className="flex items-center justify-center min-h-screen">
  <div className="flex items-center space-x-2">
    <div className="relative">
      <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
      </div>
    </div>
    <p className="text-gray-600 animate-pulse">Signing out...</p>
  </div>
</div>
  );
}