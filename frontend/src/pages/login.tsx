// src/pages/Login.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const COLORS = {
  bg: '#eae0d5',
  panel: '#ffffff',
  inputBg: '#f0f0f0',
  inputBorder: '#c6ac8f',
  button: '#c6ac8f',
  buttonHover: '#5e503f',
  textPrimary: '#0a0908',
  textLight: '#5e503f',
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post<{
        token: string;
        user: { id: number; name: string; email: string };
      }>('/login', {
        email: email.toLowerCase(),
        password
      });

      // 1) Guardar en localStorage
      localStorage.setItem('authToken', res.data.token);
      localStorage.setItem('authUser', JSON.stringify(res.data.user));

      // 2) Actualizar contexto
      login(res.data.token, res.data.user);

      // 3) Redirigir
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Usuario o contraseña incorrectos');
      } else {
        setError('No se pudo conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans"
      style={{ backgroundColor: COLORS.bg }}
    >
      {/* Fondo sutil */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(198, 172, 143, 0.3), transparent 60%), radial-gradient(circle at bottom right, rgba(34, 51, 59, 0.3), transparent 60%)',
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0zM20 20h20v20H20z\' fill=\'%23eae0d5\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
        }}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md p-8 rounded-xl shadow-2xl"
        style={{ backgroundColor: COLORS.panel }}
      >
        <h2
          className="text-2xl font-semibold mb-6 text-center"
          style={{ color: COLORS.textPrimary }}
        >
          Iniciar Sesión
        </h2>

        <input
          type="email"
          value={email}
          onChange={e => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="Correo electrónico"
          required
          className="w-full mb-4 p-3 rounded-full border"
          style={{
            backgroundColor: COLORS.inputBg,
            borderColor: COLORS.inputBorder,
            color: COLORS.textPrimary
          }}
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setError('');
            }}
            placeholder="Contraseña"
            required
            className="w-full p-3 rounded-full border"
            style={{
              backgroundColor: COLORS.inputBg,
              borderColor: COLORS.inputBorder,
              color: COLORS.textPrimary
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute top-1/2 right-3 -translate-y-1/2 focus:outline-none"
            style={{ color: COLORS.textLight }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {error && (
          <p
            className="mb-4 text-center text-sm"
            style={{ color: COLORS.textLight }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-full font-medium transition-colors"
          style={{
            backgroundColor: loading ? COLORS.inputBorder : COLORS.button,
            color: COLORS.textPrimary
          }}
          onMouseEnter={e => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                COLORS.buttonHover;
            }
          }}
          onMouseLeave={e => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                COLORS.button;
            }
          }}
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>

        <div className="flex justify-between text-xs mt-4">
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="font-medium"
            style={{ color: COLORS.textLight }}
          >
            Registrarse
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-medium"
            style={{ color: COLORS.textLight }}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
