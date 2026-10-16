import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Enviamos 'correo' y 'contrasena' para que coincidan con LoginRequestDTO.java
      const response = await api.post('/auth/login', { 
        correo: email, 
        contrasena: password 
      });
      
      // Guardamos el token de autenticación
      localStorage.setItem('token', response.data.token);
      
      // Guardamos el correo en minúsculas y sin espacios para que el Dashboard lo lea correctamente
      localStorage.setItem('correo', email.toLowerCase().trim());
      
      // Opcional: Si tu backend también devuelve el nombre o el rol en response.data, puedes guardarlos:
      if (response.data.nombre) {
        localStorage.setItem('nombre', response.data.nombre);
      }
      if (response.data.rol) {
        localStorage.setItem('rol', response.data.rol);
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas o error de conexión con el servidor.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
      
      {/* Franja Superior Institucional ITI */}
      <header style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: 'white', color: '#8C1D40', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px', fontSize: '18px' }}>
            ITI
          </div>
          <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '0.5px' }}>
            Instituto Superior Tecnológico Internacional
          </span>
        </div>
        <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', backgroundColor: '#701632', padding: '6px 12px', borderRadius: '4px' }}>
          Sistema de Anticipos
        </span>
      </header>

      {/* Contenedor Central */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '420px', width: '100%', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          
          <div style={{ backgroundColor: '#8C1D40', padding: '24px', color: 'white', textAlign: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Acceso al Sistema</h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#f3f4f6' }}>Ingrese sus credenciales institucionales autorizadas</p>
          </div>

          <form onSubmit={handleLogin} style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert style={{ width: '20px', height: '20px', color: '#ef4444', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c' }}>{error}</p>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Correo electrónico institucional
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', left: '12px', color: '#9ca3af' }}>
                  <Mail style={{ width: '18px', height: '18px' }} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@iti.edu.ec"
                  style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', left: '12px', color: '#9ca3af' }}>
                  <Lock style={{ width: '18px', height: '18px' }} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <button
                type="submit"
                style={{ width: '100%', padding: '12px', backgroundColor: '#8C1D40', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
              >
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        Instituto Superior Tecnológico Internacional ITI &copy; 2026 — Módulo de Gestión de Anticipos HH
      </footer>
    </div>
  );
};