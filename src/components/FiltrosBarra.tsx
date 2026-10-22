import React from 'react';

interface FiltrosBarraProps {
    filtroTipo: string;
    setFiltroTipo: (val: string) => void;
    fechaDesde: string;
    setFechaDesde: (val: string) => void;
    fechaHasta: string;
    setFechaHasta: (val: string) => void;
    filtroEstado: string;
    setFiltroEstado: (val: string) => void;
    busquedaFuncionario: string;
    setBusquedaFuncionario: (val: string) => void;
    limpiarFiltros: () => void;
    verTablaOrdenes: boolean;
}

export const FiltrosBarra = ({
    filtroTipo, setFiltroTipo,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    filtroEstado, setFiltroEstado,
    busquedaFuncionario, setBusquedaFuncionario,
    limpiarFiltros,
    verTablaOrdenes
}: FiltrosBarraProps) => {

    return (
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>

            {/* FILTRO TIPO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Tipo</label>
                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}>
                    <option value="Todas">Todas</option>
                    {verTablaOrdenes ? (
                        // Opciones para Órdenes (según tus flujos)
                        <>
                            <option value="Anticipo">Anticipo</option>
                            <option value="Reembolso">Reembolso</option>
                        </>
                    ) : (
                        // Opciones para Trámites
                        <>
                            <option value="Solicitud">Solicitud</option>
                            <option value="Liquidación">Liquidación</option>
                        </>
                    )}
                </select>
            </div>

            {/* FECHAS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Desde</label>
                <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Hasta</label>
                <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>

            {/* FILTRO ESTADO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Estado</label>
                <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}>
                    <option value="Todos">Todos</option>
                    {verTablaOrdenes ? (
                        <>
                            <option value="Generada">Generada</option>
                            <option value="Aprobada">Aprobada</option>
                        </>
                    ) : (
                        <>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Liquidación en proceso">Liquidación en proceso</option>
                            <option value="Transferido">Transferido</option>
                        </>
                    )}
                </select>
            </div>

            {/* BUSCADOR FUNCIONARIO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '200px' }}>
                <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Funcionario</label>
                <input type="text" placeholder="Nombre..." value={busquedaFuncionario} onChange={(e) => setBusquedaFuncionario(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }} />
            </div>

            <button onClick={limpiarFiltros} style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                Limpiar
            </button>
        </div>
    );
};