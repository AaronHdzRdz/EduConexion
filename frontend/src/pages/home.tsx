// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  bg: '#eae0d5',
  panel: '#ffffff',
  primary: '#22333b',
  accent: '#c6ac8f',
  accentDark: '#5e503f',
  textDark: '#0a0908',
  textLight: '#5e503f',
};

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.bg }}>
      {/* Hero */}
      <header
        className="flex-1 flex items-center justify-center px-6 text-center relative overflow-hidden"
      >
        {/* Decorative Waves */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(198,172,143,0.3), transparent 60%), radial-gradient(circle at bottom right, rgba(34,51,59,0.3), transparent 60%)',
          }}
        />
        <div className='my-15'>
          <div className="relative max-w-2xl">
            <img
              src="/imagotipo educonexion.svg"
              alt="Logotipo de EduConexión"
              className="mb-4 mx-auto logo-image"
            />
            <p className="text-lg mb-8 text-dark">
              La plataforma definitiva para gestionar materias y alumnos con elegancia y facilidad.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 rounded-full font-semibold transition button-accent"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 rounded-full font-semibold border-2 transition button-outline"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            ¿Qué puedes hacer en EduConexión?
          </h2>
          <p className="text-dark">
            Desde crear materias hasta llevar el seguimiento de tus alumnos, todo al alcance de un clic.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Gestionar Materias',
              desc: 'Crea y edita materias con su descripción, horarios y asignaciones.',
            },
            {
              title: 'Administrar Alumnos',
              desc: 'Registra alumnos, actualiza su información y lleva un historial.',
            },
            {
              title: 'Informes Visuales',
              desc: 'Obtén gráficos de asistencia, rendimiento y más.',
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-xl shadow-lg bg-light"
            >
              <h3 className="text-xl font-semibold mb-2 text-light">
                {f.title}
              </h3>
              <p className="text-dark">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center bg-panel">
        <p className="text-light">
          © {new Date().getFullYear()} EduConexión. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Home;
