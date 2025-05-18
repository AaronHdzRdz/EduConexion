// src/pages/Register.tsx
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const emailLowerCase = email.toLowerCase();

    try {
      const res = await api.post('/users', {
        name,
        email: emailLowerCase,
        password,
      });
      if (res.status === 201) {
        navigate('/login');
      } else {
        setError('Respuesta inesperada del servidor');
      }
    } catch (err: unknown) {
      const isAxiosError = (error: unknown): error is AxiosError =>
        (error as AxiosError).isAxiosError !== undefined;
      if (isAxiosError(err) && err.response) { // Verificar si hay una respuesta
        if (err.response.status === 400) {
          const errorData = err.response.data as { error: string }; // Cast to expected structure
          setError(errorData.error); // Acceder al mensaje de error del backend
        } else {
          setError('El Correo ya se encuentra registrado');
        }
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
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md p-8 rounded-xl shadow-2xl"
        style={{ backgroundColor: COLORS.panel }}
      >
        <h2
          className="text-2xl font-semibold mb-6 text-center"
          style={{ color: COLORS.textPrimary }}
        >
          Crear Cuenta
        </h2>

        <input
          type="text"
          value={name}
          onChange={e => {
            setName(e.target.value);
            setError('');
          }}
          placeholder="Nombre completo"
          required
          className="w-full mb-4 p-3 rounded-full border"
          style={{
            backgroundColor: COLORS.inputBg,
            borderColor: COLORS.inputBorder,
            color: COLORS.textPrimary,
          }}
        />

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
            color: COLORS.textPrimary,
          }}
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password} // Correcto: `value` se controla con `password`
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
              color: COLORS.textPrimary,
            }}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
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
            color: COLORS.textPrimary,
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
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <div className="flex justify-between text-xs mt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="font-medium"
            style={{ color: COLORS.textLight }}
          >
            Volver al Login
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-medium"
            style={{ color: COLORS.textLight }}
          >
            Inicio
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;