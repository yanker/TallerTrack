'use client';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded-md bg-white text-red-600 font-medium border-2 border-red-600 hover:bg-red-700 transition-colors shadow hover:shadow-md focus:outline-none focus:ring-2 hover:text-white focus:ring-red-400"
      onClick={() => void signOut()}
    >
      Cerrar sesión
    </button>
  );
}
