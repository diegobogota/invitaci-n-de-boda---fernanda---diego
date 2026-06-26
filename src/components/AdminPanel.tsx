/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { Lock, Unlock, Eye, Trash2, Download, Search, CheckCircle2, XCircle, Users, Utensils, Award } from 'lucide-react';
import { RSVP } from '../types';

interface AdminPanelProps {
  rsvps: RSVP[];
  onDeleteRSVP: (id: string) => void;
  onClearAllRSVPs: () => void;
}

export default function AdminPanel({ rsvps, onDeleteRSVP, onClearAllRSVPs }: AdminPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const CORRECT_PASSCODE = '2027'; // The wedding year

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (passcode === CORRECT_PASSCODE) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Código incorrecto. Intenta nuevamente.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    setIsOpen(false);
  };

  const exportToCSV = () => {
    if (rsvps.length === 0) return;

    const headers = ['Nombre', 'Teléfono', 'Asiste', 'Acompañantes', 'Menú', 'Detalles Menú', 'Mensaje', 'Fecha Confirmación'];
    const rows = rsvps.map(r => [
      r.name,
      r.phone,
      r.attending ? 'SÍ' : 'NO',
      r.guestsCount,
      r.dietary,
      r.dietaryDetails || '',
      r.message || '',
      new Date(r.confirmedAt).toLocaleString('es-AR')
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" // Add UTF-8 BOM
      + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lista_invitados_fernanda_y_diego_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations for KPIs
  const totalSubmissions = rsvps.length;
  const totalAttending = rsvps.filter(r => r.attending).reduce((sum, r) => sum + 1 + (r.guestsCount - 1), 0); // 1 for the main guest + guestsCount - 1 extra companions
  // Wait, in my RSVPForm, guestsCount defaults to 1 when attending. So guestsCount is the TOTAL people on that RSVP (main guest + companion). Let's use guestsCount directly!
  const totalAttendingGuests = rsvps.filter(r => r.attending).reduce((sum, r) => sum + r.guestsCount, 0);
  const totalDeclined = rsvps.filter(r => !r.attending).length;

  const dietaryStats = {
    celiac: rsvps.filter(r => r.attending && r.dietary === 'celiac').length,
    vegetarian: rsvps.filter(r => r.attending && r.dietary === 'vegetarian').length,
    vegan: rsvps.filter(r => r.attending && r.dietary === 'vegan').length,
    other: rsvps.filter(r => r.attending && r.dietary === 'other').length,
  };

  const filteredRSVPs = rsvps.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery) ||
    r.dietary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-12 pt-8 border-t border-olive-200/40 text-center" id="admin-panel-outer">
      <button
        id="btn-admin-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 text-[10px] tracking-widest font-bold uppercase text-gold-600 hover:text-gold-700 hover:scale-105 transition-all duration-200 cursor-pointer"
      >
        <Lock className="w-3.5 h-3.5" />
        Panel de Novios
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="admin-modal-overlay">
          <div className="bg-white rounded-3xl border border-olive-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative" id="admin-modal-content">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2">
                {isAuthenticated ? <Unlock className="w-5 h-5 text-gold-600" /> : <Lock className="w-5 h-5 text-gold-600" />}
                <h3 className="font-serif text-xl text-olive-950 font-medium">
                  Panel de Control - Fernanda & Diego
                </h3>
              </div>
              <button
                id="btn-admin-modal-close"
                onClick={handleLogout}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm bg-gray-50 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Authentication Form */}
            {!isAuthenticated ? (
              <form onSubmit={handleLogin} className="max-w-md mx-auto py-10 space-y-4" id="admin-login-form">
                <div className="text-center mb-6">
                  <p className="text-xs text-gray-500 font-sans leading-relaxed">
                    Ingresa el código de acceso del evento para ver la lista de confirmaciones de asistencia en tiempo real.
                  </p>
                  <p className="text-[10px] text-gold-600 font-bold mt-2 font-sans uppercase tracking-widest">
                    Pista para pruebas: El año de la boda ({CORRECT_PASSCODE})
                  </p>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Código de acceso (Ej: 2027)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full text-center tracking-widest text-lg px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500"
                  />
                  {error && <p className="text-[11px] text-rose-500 font-semibold mt-2">{error}</p>}
                </div>
                <button
                  type="submit"
                  id="btn-admin-login-submit"
                  className="w-full py-3 bg-olive-500 hover:bg-olive-600 text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Acceder al Panel
                </button>
              </form>
            ) : (
              /* Authenticated Admin Dashboard */
              <div className="space-y-6 text-left" id="admin-dashboard-view">
                {/* Dashboard KPI cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="admin-kpis">
                  <div className="bg-olive-50 border border-olive-200/40 p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] tracking-wider text-gray-400 font-bold font-sans uppercase">
                      Confirmaciones
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="font-serif text-3xl font-light text-olive-800">
                        {totalSubmissions}
                      </span>
                      <Award className="w-5 h-5 text-olive-400" />
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 border border-emerald-200/30 p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] tracking-wider text-emerald-600 font-bold font-sans uppercase">
                      Invitados Confirmados
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="font-serif text-3xl font-light text-emerald-800">
                        {totalAttendingGuests}
                      </span>
                      <Users className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>

                  <div className="bg-rose-50/40 border border-rose-200/30 p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] tracking-wider text-rose-600 font-bold font-sans uppercase">
                      No Asistirán
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="font-serif text-3xl font-light text-rose-800">
                        {totalDeclined}
                      </span>
                      <XCircle className="w-5 h-5 text-rose-400" />
                    </div>
                  </div>

                  <div className="bg-gold-100/30 border border-gold-200/30 p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] tracking-wider text-gold-700 font-bold font-sans uppercase">
                      Menús Especiales
                    </span>
                    <div className="flex items-baseline justify-between mt-2">
                      <span className="font-serif text-3xl font-light text-gold-800">
                        {dietaryStats.celiac + dietaryStats.vegetarian + dietaryStats.vegan + dietaryStats.other}
                      </span>
                      <Utensils className="w-5 h-5 text-gold-500" />
                    </div>
                  </div>
                </div>

                {/* Detailed Dietary Restrictions breakdown */}
                {(dietaryStats.celiac > 0 || dietaryStats.vegetarian > 0 || dietaryStats.vegan > 0 || dietaryStats.other > 0) && (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-wrap gap-6 items-center" id="admin-dietary-breakdown">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">
                      Detalle de Menús:
                    </span>
                    <div className="flex gap-4 text-xs font-sans">
                      {dietaryStats.celiac > 0 && <span className="bg-white border px-3 py-1.5 rounded-lg text-gray-700 font-medium">🌾 Celíaco: <b>{dietaryStats.celiac}</b></span>}
                      {dietaryStats.vegetarian > 0 && <span className="bg-white border px-3 py-1.5 rounded-lg text-gray-700 font-medium">🥗 Vegetariano: <b>{dietaryStats.vegetarian}</b></span>}
                      {dietaryStats.vegan > 0 && <span className="bg-white border px-3 py-1.5 rounded-lg text-gray-700 font-medium">🌱 Vegano: <b>{dietaryStats.vegan}</b></span>}
                      {dietaryStats.other > 0 && <span className="bg-white border px-3 py-1.5 rounded-lg text-gray-700 font-medium">🍽️ Otro/Alergias: <b>{dietaryStats.other}</b></span>}
                    </div>
                  </div>
                )}

                {/* Table search & Export */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" id="admin-table-controls">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar invitado por nombre o menú..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-olive-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-admin-export-csv"
                      onClick={exportToCSV}
                      disabled={rsvps.length === 0}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-gold-600 hover:bg-gold-700 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Exportar Excel (CSV)
                    </button>
                    <button
                      id="btn-admin-clear-all"
                      onClick={() => {
                        if (confirm('¿Estás seguro de que deseas borrar todas las confirmaciones? Esta acción es irreversible.')) {
                          onClearAllRSVPs();
                        }
                      }}
                      disabled={rsvps.length === 0}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      Borrar Todo
                    </button>
                  </div>
                </div>

                {/* RSVPs Table list */}
                <div className="overflow-x-auto rounded-xl border border-gray-100" id="admin-table-wrapper">
                  <table className="w-full text-xs font-sans text-left border-collapse" id="table-rsvps-data">
                    <thead>
                      <tr className="bg-olive-50/50 text-olive-800 font-bold border-b border-gray-200">
                        <th className="p-3">Invitado</th>
                        <th className="p-3">Teléfono</th>
                        <th className="p-3 text-center">Asiste</th>
                        <th className="p-3 text-center">Acompañantes</th>
                        <th className="p-3">Menú</th>
                        <th className="p-3">Mensaje / Dedicatoria</th>
                        <th className="p-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRSVPs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-400 italic">
                            No se encontraron confirmaciones registradas.
                          </td>
                        </tr>
                      ) : (
                        filteredRSVPs.map((r) => (
                          <tr key={r.id} className="hover:bg-olive-50/10 transition-colors" id={`admin-tr-${r.id}`}>
                            <td className="p-3 font-semibold text-gray-900">{r.name}</td>
                            <td className="p-3 text-gray-500 font-mono">{r.phone}</td>
                            <td className="p-3 text-center">
                              {r.attending ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> SÍ
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px]">
                                  <XCircle className="w-3.5 h-3.5" /> NO
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-center font-bold text-gray-700">
                              {r.attending ? r.guestsCount : '-'}
                            </td>
                            <td className="p-3">
                              {r.attending ? (
                                <div className="flex flex-col">
                                  <span className="font-semibold text-gray-700 capitalize">
                                    {r.dietary === 'none' ? 'Tradicional' : r.dietary === 'celiac' ? 'Celíaco' : r.dietary === 'vegetarian' ? 'Vegetariano' : r.dietary === 'vegan' ? 'Vegano' : 'Otro'}
                                  </span>
                                  {r.dietaryDetails && (
                                    <span className="text-[10px] text-gray-400 italic">
                                      "{r.dietaryDetails}"
                                    </span>
                                  )}
                                </div>
                              ) : '-'}
                            </td>
                            <td className="p-3 text-gray-600 italic max-w-xs truncate" title={r.message}>
                              {r.message ? `"${r.message}"` : <span className="text-gray-300">-</span>}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                id={`btn-delete-rsvp-${r.id}`}
                                onClick={() => {
                                  if (confirm(`¿Borrar confirmación de ${r.name}?`)) {
                                    onDeleteRSVP(r.id);
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                                title="Eliminar registro"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 font-sans" id="admin-footer-count">
                  <span>Mostrando {filteredRSVPs.length} de {rsvps.length} confirmaciones.</span>
                  <button
                    id="btn-admin-logout"
                    onClick={handleLogout}
                    className="text-gold-600 font-bold uppercase tracking-widest hover:underline"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
