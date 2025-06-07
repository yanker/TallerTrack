'use client';
import { useAuthActions } from '@convex-dev/auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set('flow', flow);
          void signIn('password', formData).catch((error) => {
            let toastTitle = '';
            if (error.message.includes('Invalid password')) {
              toastTitle = 'Incorrect password. Please try again.';
            } else {
              toastTitle = flow === 'signIn' ? 'No se pudo iniciar sesión, ¿quiso registrarse?' : 'No se pudo registrar, ¿quiso iniciar sesión?';
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <input className="auth-input-field" type="email" name="email" placeholder="Email" required />
        <input className="auth-input-field" type="password" name="password" placeholder="Password" required />
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === 'signIn' ? 'Iniciar sesión' : 'REGISTRARSE'}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>{flow === 'signIn' ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}</span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
          >
            {flow === 'signIn' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>
      </form>
      <div className="mt-8 text-center">
        <a
          href="/USAGE_GUIDE.md"
          target="_blank"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
        >
          📖 Consulta nuestra guía de usuario
        </a>
      </div>
    </div>
  );
}
