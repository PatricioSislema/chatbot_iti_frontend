import React, { useState } from 'react';
import { Shield, CheckCircle, Lock, Users, FileText, Settings } from 'lucide-react';

interface RolSistema {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: string[];
  colorBadge: string;
}

export const Roles = () => {
  const [roles] = useState<RolSistema[]>([
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Control total del sistema institucional. Permite gestionar usuarios, aprobar/rechazar trámites, configurar roles y tipos de trámite.',
      permisos: ['Gestión de Usuarios', 'Gestión de Trámites', 'Configuración de Roles', 'Tipos de Trámite', 'Reportes y Métricas'],
      colorBadge: '#8C1D40'
    },
    {
      id: 2,
      nombre: 'Analista',
      descripcion: 'Encargado de la revisión, validación y gestión operativa de las solicitudes de anticipos presentadas por los funcionarios.',
      permisos: ['Consulta de Trámites', 'Aprobación / Rechazo Operativo', 'Visualización de Reportes'],
      colorBadge: '#0284c7'
    },
    {
      id: 3,
      nombre: 'Solicitante',
      descripcion: 'Rol asignado al personal institucional para el registro y seguimiento de sus propias solicitudes de anticipos de fondos.',
      permisos: ['Creación de Solicitudes', 'Seguimiento de Trámites Propios', 'Consulta de Estado'],
      colorBadge: '#059669'
    }
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Institucional */}
      <header style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: 'white', color: '#8C1D40', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px', fontSize: '18px' }}>
            ITI
          </div>
          <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '0.5px' }}>
            Sistema de Anticipos — Módulo de Roles (Administrador)
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: '32px 24px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box', flex: 1 }}>
        
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Roles y Permisos del Sistema</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Visualización de los perfiles de acceso autorizados y sus privilegios dentro de la plataforma institucional.</p>
        </div>

        {/* Grid de Roles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {roles.map((rol) => (
            <div key={rol.id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ backgroundColor: '#f3f4f6', padding: '10px', borderRadius: '8px', color: rol.colorBadge }}>
                      <Shield style={{ width: '22px', height: '22px' }} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>{rol.nombre}</h3>
                  </div>
                  <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: '#f3f4f6', color: '#4b5563', fontWeight: 600 }}>
                    ID: {rol.id}
                  </span>
                </div>

                <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px' }}>
                  {rol.descripcion}
                </p>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    Permisos Asociados:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {rol.permisos.map((permiso, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                        <CheckCircle style={{ width: '15px', height: '15px', color: '#059669', flexShrink: 0 }} />
                        <span>{permiso}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af' }}>
                <span>Restringido por seguridad</span>
                <span style={{ fontWeight: 500, color: rol.colorBadge }}>Activo en Base de Datos</span>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e5e7eb', padding: '16px', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
        Instituto Superior Tecnológico Internacional ITI &copy; 2026 — Módulo de Gestión de Anticipos HH
      </footer>
    </div>
  );
};