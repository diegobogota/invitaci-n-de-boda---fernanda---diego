/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { Send, Phone, CheckCircle, Users, Utensils, CalendarX, Smile } from 'lucide-react';
import { RSVP } from '../types';

interface RSVPFormProps {
  onRSVPSubmitted: (rsvp: RSVP) => void;
}

export default function RSVPForm({ onRSVPSubmitted }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<boolean>(true);
  const [guestsCount, setGuestsCount] = useState(1);
  const [dietary, setDietary] = useState<RSVP['dietary']>('none');
  const [dietaryDetails, setDietaryDetails] = useState('');
  const [message, setMessage] = useState('');
  const [notifyTarget, setNotifyTarget] = useState<'fernanda' | 'diego'>('fernanda');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');

  // Check if they already RSVPed on this device
  useEffect(() => {
    const existing = localStorage.getItem('wedding_rsvp_submitted');
    if (existing) {
      setIsSubmitted(true);
      setSubmittedName(existing);
    }
  }, []);

  const handleSubmit = (e: FormEvent, method: 'local' | 'whatsapp') => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRSVP: RSVP = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      phone: phone.trim() || 'No especificado',
      attending,
      guestsCount: attending ? guestsCount : 0,
      dietary,
      dietaryDetails: dietaryDetails.trim() || undefined,
      message: message.trim() || undefined,
      confirmedAt: new Date().toISOString()
    };

    // Save to local storage first
    const localRSVPsRaw = localStorage.getItem('wedding_rsvps');
    const localRSVPs: RSVP[] = localRSVPsRaw ? JSON.parse(localRSVPsRaw) : [];
    localRSVPs.push(newRSVP);
    localStorage.setItem('wedding_rsvps', JSON.stringify(localRSVPs));
    
    // Mark as submitted on this device
    localStorage.setItem('wedding_rsvp_submitted', newRSVP.name);
    
    // Notify parent component
    onRSVPSubmitted(newRSVP);

    setSubmittedName(newRSVP.name);
    setIsSubmitted(true);

    if (method === 'whatsapp') {
      sendWhatsAppNotification(newRSVP);
    }
  };

  const sendWhatsAppNotification = (rsvp: RSVP) => {
    // Phone numbers formatted for WhatsApp in Argentina: +54 9 223 ...
    const fernandaPhone = '5492235763957';
    const diegoPhone = '5492236565296';
    const targetPhone = notifyTarget === 'fernanda' ? fernandaPhone : diegoPhone;
    const targetName = notifyTarget === 'fernanda' ? 'Fernanda' : 'Diego';

    const attendanceText = rsvp.attending 
      ? `✅ ¡Sí! Confirmo mi asistencia.` 
      : `❌ Lamentablemente no podré asistir.`;

    const detailsText = rsvp.attending
      ? `\n👥 Acompañantes: ${rsvp.guestsCount}\n🍽️ Menú: ${getDietaryLabel(rsvp.dietary)}${rsvp.dietaryDetails ? ` (${rsvp.dietaryDetails})` : ''}`
      : '';

    const msgText = rsvp.message ? `\n\n💬 Mensaje:\n"${rsvp.message}"` : '';

    const text = `¡Hola ${targetName}! 👋
Quiero confirmar mi asistencia a su boda 👰‍♀️🤵‍♂️💍

📝 Nombre: ${rsvp.name}
📱 Teléfono: ${rsvp.phone}
${attendanceText}${detailsText}${msgText}

¡Nos vemos el 23 de enero de 2027! ✨🕊️`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const getDietaryLabel = (key: RSVP['dietary']) => {
    switch(key) {
      case 'none': return 'Común / Sin restricciones';
      case 'celiac': return 'Celíaco (Sin TACC)';
      case 'vegetarian': return 'Vegetariano';
      case 'vegan': return 'Vegano';
      default: return 'Otro';
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setAttending(true);
    setGuestsCount(1);
    setDietary('none');
    setDietaryDetails('');
    setMessage('');
    localStorage.removeItem('wedding_rsvp_submitted');
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl border border-olive-200/40 shadow-md p-6 sm:p-8 text-center" id="rsvp-success-card">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <CheckCircle className="w-8 h-8 animate-bounce" />
        </div>
        <h3 className="font-serif text-2xl text-olive-900 font-light mb-2">
          ¡Confirmación Recibida!
        </h3>
        <p className="font-sans text-xs text-gray-500 tracking-wider mb-6">
          Gracias <b>{submittedName}</b>, tus datos se guardaron correctamente en la invitación.
        </p>
        
        <div className="bg-olive-50 border border-olive-200/40 rounded-xl p-4 max-w-sm mx-auto text-left mb-6">
          <p className="text-xs text-olive-800 leading-relaxed font-sans text-center font-medium">
            ¿Quieres enviar también la confirmación directamente por WhatsApp para avisar al instante?
          </p>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex justify-center gap-4 mb-2">
              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  checked={notifyTarget === 'fernanda'}
                  onChange={() => setNotifyTarget('fernanda')}
                  className="text-olive-500 focus:ring-olive-500"
                />
                Avisar a Fer
              </label>
              <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  checked={notifyTarget === 'diego'}
                  onChange={() => setNotifyTarget('diego')}
                  className="text-olive-500 focus:ring-olive-500"
                />
                Avisar a Diego
              </label>
            </div>
            <button
              id="btn-whatsapp-resend"
              onClick={() => {
                const localRSVPsRaw = localStorage.getItem('wedding_rsvps');
                if (localRSVPsRaw) {
                  const localRSVPs: RSVP[] = JSON.parse(localRSVPsRaw);
                  const myRSVP = localRSVPs.find(r => r.name === submittedName) || localRSVPs[localRSVPs.length - 1];
                  if (myRSVP) sendWhatsAppNotification(myRSVP);
                }
              }}
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all"
            >
              <Phone className="w-4 h-4 fill-white text-transparent" />
              Enviar Confirmación por WhatsApp
            </button>
          </div>
        </div>

        <button
          id="btn-rsvp-change"
          onClick={handleReset}
          className="text-xs font-semibold tracking-wider uppercase text-olive-600 hover:text-olive-800 underline transition-colors"
        >
          Modificar mi confirmación
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-olive-200/40 shadow-md p-5 sm:p-8" id="rsvp-form-card">
      <div className="text-center mb-6">
        <h3 className="font-serif text-2xl text-olive-900 font-light mb-1">
          Confirmar Asistencia
        </h3>
        <p className="font-sans text-xs text-gray-500 tracking-wider">
          Por favor, completa el formulario antes de la fecha límite
        </p>
      </div>

      <form className="space-y-4" id="form-rsvp">
        {/* Attendance Toggles */}
        <div className="grid grid-cols-2 gap-3" id="rsvp-attendance-toggles">
          <button
            type="button"
            id="btn-rsvp-attending-yes"
            onClick={() => setAttending(true)}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${attending ? 'bg-olive-50 border-olive-500 text-olive-800 ring-1 ring-olive-500' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
          >
            <Smile className="w-5 h-5 mb-1 text-olive-600" />
            <span className="text-xs font-bold font-sans">¡Sí, asistiré!</span>
          </button>
          <button
            type="button"
            id="btn-rsvp-attending-no"
            onClick={() => setAttending(false)}
            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${!attending ? 'bg-rose-50/50 border-rose-300 text-rose-700 ring-1 ring-rose-300' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
          >
            <CalendarX className="w-5 h-5 mb-1 text-rose-500" />
            <span className="text-xs font-bold font-sans">No puedo asistir</span>
          </button>
        </div>

        {/* Name input */}
        <div id="rsvp-input-group-name">
          <label className="block text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-1 font-sans">
            Nombre Completo *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Juan Pérez"
            className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 bg-olive-50/20 font-sans"
          />
        </div>

        {/* Phone input */}
        <div id="rsvp-input-group-phone">
          <label className="block text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-1 font-sans">
            Teléfono de Contacto
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej: 2236565296"
            className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 bg-olive-50/20 font-sans"
          />
        </div>

        {attending && (
          <div className="space-y-4 pt-1 animate-fade-in" id="rsvp-additional-fields">
            {/* Guest count */}
            <div className="flex items-center justify-between bg-olive-50/40 p-3 rounded-xl border border-olive-200/30">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-olive-600" />
                <span className="text-xs font-semibold text-olive-900 font-sans">
                  Cantidad de Asistentes
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="btn-rsvp-guests-minus"
                  onClick={() => setGuestsCount(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-olive-50 hover:text-olive-700 transition-colors"
                >
                  -
                </button>
                <span className="font-serif text-base font-semibold text-olive-800 w-4 text-center">
                  {guestsCount}
                </span>
                <button
                  type="button"
                  id="btn-rsvp-guests-plus"
                  onClick={() => setGuestsCount(prev => Math.min(10, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-olive-50 hover:text-olive-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dietary restriction */}
            <div>
              <label className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-1.5 font-sans">
                <Utensils className="w-3.5 h-3.5 text-olive-500" />
                Menú Especial o Restricciones
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value as RSVP['dietary'])}
                className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 bg-olive-50/20 font-sans"
              >
                <option value="none">Común / Tradicional</option>
                <option value="celiac">Celíaco (Sin TACC)</option>
                <option value="vegetarian">Vegetariano</option>
                <option value="vegan">Vegano</option>
                <option value="other">Otro / Múltiples alergias</option>
              </select>

              {dietary !== 'none' && (
                <input
                  type="text"
                  required={dietary === 'other'}
                  value={dietaryDetails}
                  onChange={(e) => setDietaryDetails(e.target.value)}
                  placeholder="Ej: Alergia a los mariscos, frutos secos, etc."
                  className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 bg-olive-50/20 mt-2 font-sans animate-slide-down"
                />
              )}
            </div>
          </div>
        )}

        {/* Message to the couple */}
        <div id="rsvp-input-group-message">
          <label className="block text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-1 font-sans">
            Mensaje para los Novios (Opcional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Déjales un lindo deseo o felicitaciones..."
            rows={3}
            className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-olive-500 focus:ring-1 focus:ring-olive-500 bg-olive-50/20 font-sans"
          ></textarea>
        </div>

        {/* Select who to contact for WhatsApp confirmation */}
        <div className="bg-olive-50/30 p-3 rounded-xl border border-olive-200/20" id="rsvp-notification-config">
          <span className="block text-[10px] font-bold text-olive-800 tracking-wider uppercase mb-2 font-sans text-center">
            ¿A quién enviarás tu WhatsApp de confirmación?
          </span>
          <div className="flex justify-center gap-6">
            <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                name="whatsapp-receiver"
                checked={notifyTarget === 'fernanda'}
                onChange={() => setNotifyTarget('fernanda')}
                className="text-olive-600 focus:ring-olive-500"
              />
              A Fernanda 👩‍💼
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
              <input
                type="radio"
                name="whatsapp-receiver"
                checked={notifyTarget === 'diego'}
                onChange={() => setNotifyTarget('diego')}
                className="text-olive-600 focus:ring-olive-500"
              />
              A Diego 🧔‍♂️
            </label>
          </div>
        </div>

        {/* Actions buttons */}
        <div className="pt-2 flex flex-col gap-2" id="rsvp-action-buttons">
          <button
            type="submit"
            id="btn-rsvp-submit-whatsapp"
            onClick={(e) => handleSubmit(e, 'whatsapp')}
            disabled={!name.trim()}
            className={`w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white font-semibold font-sans text-xs tracking-wider uppercase py-3.5 px-6 rounded-xl shadow-md transition-all ${!name.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
          >
            <Phone className="w-4 h-4 fill-white text-transparent" />
            Confirmar por WhatsApp y Guardar
          </button>
          
          <button
            type="submit"
            id="btn-rsvp-submit-local"
            onClick={(e) => handleSubmit(e, 'local')}
            disabled={!name.trim()}
            className={`w-full flex items-center justify-center gap-2 bg-olive-500 hover:bg-olive-600 text-white font-semibold font-sans text-xs tracking-wider uppercase py-3.5 px-6 rounded-xl transition-all ${!name.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
          >
            <Send className="w-3.5 h-3.5" />
            Solo guardar en la Invitación
          </button>
        </div>
      </form>
    </div>
  );
}
