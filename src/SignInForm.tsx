'use client';
import { useAuthActions } from '@convex-dev/auth/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { HtmlContent } from './components/HtmlContent';
import { Modal } from './components/Modal';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [submitting, setSubmitting] = useState(false);
  const [guideContent, setGuideContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetch('/USAGE_GUIDE.md')
      .then((response) => response.text())
      .then((content) => setGuideContent(content))
      .catch((error) => console.error('Error loading guide:', error));
  }, []);
  const validatePassword = (password: string) => {
    if (flow === 'signUp') {
      if (password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
      if (!/^(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
        return 'La contraseña debe contener al menos una letra y un número';
      }
    }
    return '';
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-form-field"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const password = formData.get('password') as string;

          const error = validatePassword(password);
          if (error) {
            setPasswordError(error);
            return;
          }

          setSubmitting(true);
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
        <div>
          <input
            className={`auth-input-field w-full ${passwordError ? 'border-red-500' : ''}`}
            type="password"
            name="password"
            placeholder="Contraseña"
            required
            onChange={(e) => {
              const error = validatePassword(e.target.value);
              setPasswordError(error);
            }}
          />
          {passwordError && flow === 'signUp' && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          {flow === 'signUp' && !passwordError && <p className="text-gray-500 text-sm mt-1">Mínimo 6 caracteres, debe incluir letras y números</p>}
        </div>
        <button
          className={`w-full px-4 py-3 rounded font-semibold text-white shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
            flow === 'signUp' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-primary hover:bg-primary-hover'
          }`}
          type="submit"
          disabled={submitting}
        >
          {flow === 'signIn' ? 'Iniciar sesión' : 'REGISTRARSE'}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>{flow === 'signIn' ? '¿No tienes una cuenta? ' : '¿Ya tienes una cuenta? '}</span>
          <button
            type="button"
            className={`font-medium cursor-pointer hover:underline ${
              flow === 'signIn' ? 'text-blue-600 hover:text-blue-800' : 'text-purple-600 hover:text-purple-800'
            }`}
            onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
          >
            {flow === 'signIn' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>
      </form>{' '}
      <div className="mt-6 text-center flex flex-col gap-2">
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">¿Quieres probar la aplicación? Usa la cuenta demo:</p>
          <p className="text-sm font-mono bg-white p-2 rounded border">
            Email: <span className="text-blue-600">demo@demo.com</span>
            <br />
            Contraseña: <span className="text-blue-600">123456789</span>
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm text-gray-600 hover:text-gray-800 hover:underline flex items-center justify-center gap-2 mx-auto"
        >
          <span>📖</span>
          ¿Cómo usar TallerTracker?
        </button>
        <a href="/guide" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
          Ver manual en nueva pestaña ↗️
        </a>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Manual de usuario - TallerTracker">
        <div className="prose prose-sm max-w-none">
          <HtmlContent markdown={guideContent} />
        </div>
      </Modal>
    </div>
  );
}
