import React, { useState } from 'react';
import { Layers, CheckCircle, XCircle, FileText, FileCheck } from 'lucide-react';

interface TipoTramite {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'Activo' | 'Inactivo';
}

export const TiposTramite = () => {
  const [tiposTramite, setTiposTramite] = useState<TipoTramite[]>([
    {
      id: 1,
      nombre: 'Solicitud de Anticipo',
      descripcion: 'Trámite inicial mediante el cual el personal institucional solicita un adelanto de fondos o recursos económicos.',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Liquidación de Anticipos de Fondos',
      descripcion: 'Trámite obligatorio posterior a la utilización del anticipo, donde se justifican los gastos mediante facturas y comprobantes.',
      estado: 'Activo'
    }
  ]);

  const cambiarEstado = (id: number) => {
    setTiposTramite(tiposTramite.map(t => {
      if (t.id === id) {
        return { ...t, estado: t.estado === 'Activo' ? 'Inactivo' : 'Activo' };
      }
      return t;
    }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Institucional */}
      <header style={{ backgroundColor: '#8C1D40', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: 'white', color: '#8C1D40', fontWeight: 'bold', padding: '6px 12px', borderRadius: '4px', fontSize: '18px' }}>
            ITI
          </div>
          <span style={{ fontWeight: 600, fontSize: '16px', letterSpacing: '0.5px' }}>
            Sistema de Anticipos — Módulo de Tipos de Trámite (Administrador)
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: '32px 24px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box', flex: 1 }}>
        
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Tipos de Trámite</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Gestión de las categorías principales de procesos institucionales (Solicitudes y Liquidaciones).</p>
        </div>

        {/* Grid de Tipos de Trámite */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {tiposTramite.map((tipo) => (
            <div key={tipo.id} style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', color: '#8C1D40' }}>
                      {tipo.id === 1 ? <FileText style={{ width: '22px', height: '22px' }} /> : <FileCheck style={{ width: '22px', height: '22px' }} />}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>{tipo.nombre}</h3>
                  </div>
                  
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 500,
                    backgroundColor: tipo.estado === 'Activo' ? '#d1fae5' : '#fee2e2',
                    color: tipo.estado === 'Activo' ? '#065f46' : '#991b1b'
                  }}>
                    {tipo.estado === 'Activo' ? <CheckCircle style={{ width: '12px', height: '12px' }} /> : <XCircle style={{ width: '12px', height: '12px' }} />}
                    {tipo.estado}
                  </span>
                </div>

                <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
                  {tipo.descripcion}
                </p>
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>ID de Categoría: {tipo.id}</span>
                <button
                  onClick={() => cambiarEstado(tipo.id)}
                  style={{
                    padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500, cursor: 'pointer',
                    border: '1px solid #d1d5db', backgroundColor: tipo.estado === 'Activo' ? '#fff1f2' : '#f0fdf4',
                    color: tipo.estado === 'Activo' ? '#991b1b' : '#065f46'
                  }}
                >
                  {tipo.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                </button>
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