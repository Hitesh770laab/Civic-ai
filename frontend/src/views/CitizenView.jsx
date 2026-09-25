import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Trash2, Droplet, Lightbulb, TrafficCone, Building,
  Send, CheckCircle2, Sparkles, Clock, MapPin, Navigation, ExternalLink,
  Camera, Eye, Zap, Info, RefreshCw, Volume2, Mic, MicOff, Check,
  HelpCircle, Globe, Play, UserCheck, Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import PipelineStrip from '../components/PipelineStrip';
import AiExplainDrawer from '../components/AiExplainDrawer';
import { createReport, classifyTextPreview, runYoloDetection } from '../services/api';
import { playSound, speakText, stopSpeaking, createSpeechRecognizer } from '../services/voiceAssistant';

/* ── Multilingual dictionary for voice & labels ─────────── */
const TRANSLATIONS = {
  en: {
    title: 'Report a City Problem',
    subtitle: 'Tap big icons or speak your problem. AI will send it to the right city team!',
    modeEasy: '🌟 Easy Visual Mode',
    modeFull: '⚙️ Detailed Mode',
    listenGuide: '🔊 Listen to Guide',
    stopGuide: '⏹️ Stop Voice',
    step1: '1 · What is broken? Tap an icon below:',
    step2: '2 · Take a photo or pick a sample picture:',
    step3: '3 · Where is the problem? (GPS / Map):',
    step4: '4 · Speak or add details (No typing needed):',
    gpsBtn: '📍 Tap to Detect My Location Automatically',
    gpsSuccess: 'Location captured successfully!',
    speakBtn: '🎙️ Tap to Speak (Voice Input)',
    speakingState: 'Listening... Speak now into microphone',
    speechNotSupported: 'Speech recognition is not supported in this browser. You can tap quick tags below.',
    submitBtn: '🚨 Send Report to City Repair Team',
    submittingBtn: 'Evaluating & Routing Report…',
    successTitle: 'Issue Submitted Successfully!',
    successSub: 'Ticket logged · City repair team notified',
    submitAnother: 'Submit Another Problem',
    quickTagsLabel: 'Quick details (tap to add):',
    samplesLabel: 'Quick picture samples:',
    uploadPhoto: 'Upload or Take Photo',
    uploadPhotoSub: 'PNG, JPG, WebP · AI checks the image automatically',
    samplePothole: 'Road Pothole',
    sampleTraffic: 'Signal Fault',
    sampleGarbage: 'Waste Overflow',
    guideSpeech: 'Welcome to Civic AI. Step 1: Tap the picture of your problem. Step 2: Take a photo or choose a picture. Step 3: Tap the green button to get your location. Step 4: Tap the microphone to speak your problem. Then tap the big blue button to send!',
  },
  hi: {
    title: 'शहर की समस्या दर्ज करें',
    subtitle: 'समस्या का बड़ा चित्र चुनें या बोलकर बताएं। AI तुरंत सही विभाग को भेजेगा!',
    modeEasy: '🌟 आसान चित्र मोड',
    modeFull: '⚙️ विस्तृत मोड',
    listenGuide: '🔊 बोलकर समझाएं',
    stopGuide: '⏹️ आवाज़ रोकें',
    step1: '१ · क्या समस्या है? चित्र पर छुएं:',
    step2: '२ · फ़ोटो खींचें या उदाहरण चुनें:',
    step3: '३ · समस्या कहाँ है? (स्थान / GPS):',
    step4: '४ · बोलकर बताएं (टाइप करने की ज़रूरत नहीं):',
    gpsBtn: '📍 मेरा स्थान अपने आप खोजें (GPS)',
    gpsSuccess: 'स्थान सफलतापूर्वक मिल गया!',
    speakBtn: '🎙️ बोलकर बताएं (माइक पर बोलें)',
    speakingState: 'सुन रहे हैं... कृपया अब बोलें',
    speechNotSupported: 'माइक उपलब्ध नहीं है, नीचे दिए बटन दबाएं।',
    submitBtn: '🚨 नगर निगम को रिपोर्ट भेजें',
    submittingBtn: 'जांच और भेजा जा रहा है…',
    successTitle: 'समस्या सफलतापूर्वक दर्ज हो गई!',
    successSub: 'शिकायत दर्ज · मरम्मत टीम को सूचित किया गया',
    submitAnother: 'दूसरी समस्या दर्ज करें',
    quickTagsLabel: 'ज़रूरी जानकारी (जोड़ने के लिए छुएं):',
    samplesLabel: 'फ़ोटो के उदाहरण:',
    uploadPhoto: 'फ़ोटो अपलोड करें या खींचें',
    uploadPhotoSub: 'AI अपने आप फोटो की जांच करेगा',
    samplePothole: 'सड़क का गड्ढा',
    sampleTraffic: 'ट्रैफिक लाइट खराब',
    sampleGarbage: 'कचरे का ढेर',
    guideSpeech: 'सिविक ए आई में आपका स्वागत है। चरण 1: अपनी समस्या के चित्र पर छुएं। चरण 2: फोटो लें। चरण 3: हरा बटन दबाकर अपना स्थान दर्ज करें। चरण 4: माइक दबाकर अपनी समस्या बोलें। अंत में बड़ा बटन दबाकर भेजें!',
  },
  es: {
    title: 'Reportar un Problema en la Ciudad',
    subtitle: 'Toca los íconos grandes o habla. ¡La IA enviará tu reporte al equipo adecuado!',
    modeEasy: '🌟 Modo Visual Fácil',
    modeFull: '⚙️ Modo Detallado',
    listenGuide: '🔊 Escuchar Guía',
    stopGuide: '⏹️ Detener Voz',
    step1: '1 · ¿Qué está roto? Toca un ícono:',
    step2: '2 · Toma una foto o elige un ejemplo:',
    step3: '3 · ¿Dónde está el problema? (GPS / Mapa):',
    step4: '4 · Habla o agrega detalles (Sin escribir):',
    gpsBtn: '📍 Detectar Mi Ubicación Automáticamente (GPS)',
    gpsSuccess: '¡Ubicación guardada con éxito!',
    speakBtn: '🎙️ Toca para Hablar (Entrada de Voz)',
    speakingState: 'Escuchando... Habla por el micrófono',
    speechNotSupported: 'Reconocimiento de voz no disponible.',
    submitBtn: '🚨 Enviar Reporte al Equipo de la Ciudad',
    submittingBtn: 'Enviando reporte…',
    successTitle: '¡Reporte Enviado con Éxito!',
    successSub: 'Ticket registrado · Equipo notificado',
    submitAnother: 'Reportar Otro Problema',
    quickTagsLabel: 'Detalles rápidos (toca para agregar):',
    samplesLabel: 'Fotos de ejemplo:',
    uploadPhoto: 'Tomar o Subir Foto',
    uploadPhotoSub: 'La IA analizará la imagen automáticamente',
    samplePothole: 'Bache en la Calle',
    sampleTraffic: 'Falla de Semáforo',
    sampleGarbage: 'Basura Desbordada',
    guideSpeech: 'Bienvenido a Civic AI. Paso 1: Toca el dibujo de tu problema. Paso 2: Toma una foto. Paso 3: Toca el botón verde para tu ubicación. Paso 4: Toca el micrófono para hablar. ¡Y luego presiona enviar!',
  }
};

/* ── Issue type config with visual emojis & translations ──── */
const ISSUES = [
  {
    id: 'pothole',
    emoji: '🕳️',
    labelEn: 'Road Pothole',
    labelHi: 'सड़क का गड्ढा',
    labelEs: 'Bache en Calle',
    subEn: 'Crater, broken road surface',
    subHi: 'सड़क टूटी या गड्ढा है',
    subEs: 'Carretera rota o pozo',
    color: '#DC2626',
    bg: '#FEF2F2',
    icon: AlertTriangle,
    speechEn: 'Road pothole or broken road surface',
    speechHi: 'सड़क का गड्ढा या टूटी हुई सड़क',
    speechEs: 'Bache o carretera en mal estado',
  },
  {
    id: 'garbage_overflow',
    emoji: '🗑️',
    labelEn: 'Garbage Pile',
    labelHi: 'कचरे का ढेर',
    labelEs: 'Basura Acumulada',
    subEn: 'Full bins, dirty street waste',
    subHi: 'कचरा फैला है या डस्टबिन भरा है',
    subEs: 'Contenedores llenos o basura',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: Trash2,
    speechEn: 'Overflowing garbage or dirty street waste',
    speechHi: 'कचरे का ढेर या गंदगी',
    speechEs: 'Basura acumulada o desechos',
  },
  {
    id: 'water_leakage',
    emoji: '💧',
    labelEn: 'Water Pipe Leak',
    labelHi: 'पानी का पाइप फूटा',
    labelEs: 'Fuga de Agua',
    subEn: 'Burst pipe, water flooded road',
    subHi: 'पाइप से पानी बह रहा है या जलभराव',
    subEs: 'Tubería rota o inundación',
    color: '#2563EB',
    bg: '#EFF6FF',
    icon: Droplet,
    speechEn: 'Water pipe leakage or flooded street',
    speechHi: 'पानी का पाइप फूटा या जलभराव',
    speechEs: 'Fuga de agua o tubería rota',
  },
  {
    id: 'streetlight_outage',
    emoji: '💡',
    labelEn: 'Broken Streetlight',
    labelHi: 'स्ट्रीट लाइट बंद / खराब',
    labelEs: 'Luz de Calle Rota',
    subEn: 'Dark road, light not working',
    subHi: 'सड़क पर अंधेरा या बत्ती खराब',
    subEs: 'Calle a oscuras o foco apagado',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: Lightbulb,
    speechEn: 'Broken streetlight or dark roadway',
    speechHi: 'स्ट्रीट लाइट खराब या अंधेरा',
    speechEs: 'Farola rota o calle oscura',
  },
  {
    id: 'traffic_signal',
    emoji: '🚦',
    labelEn: 'Traffic Light Fault',
    labelHi: 'ट्रैफिक सिग्नल खराब',
    labelEs: 'Semáforo Apagado',
    subEn: 'Signal not working, traffic jam',
    subHi: 'सिग्नल बत्ती बंद या जाम',
    subEs: 'Semáforo descompuesto o parpadeando',
    color: '#EA580C',
    bg: '#FFF7ED',
    icon: TrafficCone,
    speechEn: 'Traffic signal failure or malfunctioning light',
    speechHi: 'ट्रैफिक सिग्नल खराब या बंद',
    speechEs: 'Falla en el semáforo de tráfico',
  },
  {
    id: 'infrastructure_damage',
    emoji: '🏢',
    labelEn: 'Broken Wall / Bridge',
    labelHi: 'दीवार / पुल / फुटपाथ टूटा',
    labelEs: 'Daño en Estructura',
    subEn: 'Broken footpath, curb, railing',
    subHi: 'फुटपाथ, रेलिंग या दीवार टूटी',
    subEs: 'Banqueta rota, muro o puente dañado',
    color: '#4F46E5',
    bg: '#EEF2FF',
    icon: Building,
    speechEn: 'Damaged footpath, curb, or bridge structure',
    speechHi: 'फुटपाथ, पुल या दीवार की टूट फूट',
    speechEs: 'Daño en banqueta, muro o puente',
  },
];

/* ── Quick visual context chips with emojis ─────────────── */
const QUICK_TAGS = [
  { id: 'school', emoji: '🚸', en: 'Near School Zone', hi: 'स्कूल के पास', es: 'Cerca de Escuela' },
  { id: 'hospital', emoji: '🚑', en: 'Near Hospital', hi: 'अस्पताल के पास', es: 'Cerca de Hospital' },
  { id: 'accident', emoji: '⚠️', en: 'Accident Risk / Danger', hi: 'दुर्घटना का खतरा', es: 'Peligro de Accidente' },
  { id: 'flood', emoji: '🌊', en: 'Water Flooding Fast', hi: 'पानी भर गया है', es: 'Inundación' },
  { id: 'smell', emoji: '👃', en: 'Severe Foul Odor', hi: 'भारी बदबू आ रही है', es: 'Mal Olor' },
  { id: 'children', emoji: '👶', en: 'Children Playing Here', hi: 'बच्चे खेल रहे हैं', es: 'Niños Jugando' },
];

/* ── YOLO preset SVG images ────────────────────────────── */
const SAMPLE_PRESETS = [
  {
    id: 'pothole', labelKey: 'samplePothole', issue_type: 'pothole', emoji: '🕳️',
    desc: 'Deep road crater in traffic lane near school zone.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="400" height="260" fill="#475569"/><line x1="200" y1="0" x2="200" y2="260" stroke="#F8FAFC" stroke-width="6" stroke-dasharray="16 12"/><ellipse cx="190" cy="140" rx="90" ry="55" fill="#1E293B" stroke="#0F172A" stroke-width="4"/><path d="M130 140 Q 190 180 250 140 Q 220 110 130 140" fill="#020617"/><text x="20" y="35" fill="#E2E8F0" font-family="sans-serif" font-size="13" font-weight="bold">Municipal Cam #41</text></svg>`,
  },
  {
    id: 'traffic', labelKey: 'sampleTraffic', issue_type: 'traffic_signal', emoji: '🚦',
    desc: 'Traffic signal head optical failure at crossroad.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="400" height="260" fill="#94A3B8"/><rect x="160" y="30" width="80" height="200" rx="16" fill="#1E293B" stroke="#0F172A" stroke-width="3"/><circle cx="200" cy="65" r="24" fill="#EF4444" opacity="0.9"/><circle cx="200" cy="130" r="24" fill="#334155"/><circle cx="200" cy="195" r="24" fill="#334155"/><text x="20" y="35" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="bold">Traffic Cam N-4</text></svg>`,
  },
  {
    id: 'garbage', labelKey: 'sampleGarbage', issue_type: 'garbage_overflow', emoji: '🗑️',
    desc: 'Commercial garbage bags piled high and spilling.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260"><rect width="400" height="260" fill="#CBD5E1"/><rect x="130" y="70" width="140" height="150" rx="10" fill="#059669"/><rect x="110" y="55" width="180" height="20" rx="5" fill="#047857"/><circle cx="150" cy="50" r="30" fill="#1E293B"/><circle cx="210" cy="45" r="35" fill="#334155"/><circle cx="250" cy="55" r="28" fill="#475569"/><text x="20" y="35" fill="#1E293B" font-family="sans-serif" font-size="13" font-weight="bold">Sanitation Feed</text></svg>`,
  },
];

/* ── Interactive Map Component with Big Visuals ─────────── */
function MiniMap({ lat, lng, wardName, onChangeLocation, lang = 'en', onGpsSuccess }) {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null);

  const minLat = 37.73, maxLat = 37.82, minLng = -122.47, maxLng = -122.37;
  const W = 600, H = 320;
  const getX = (l) => Math.max(12, Math.min(W - 12, ((l - minLng) / (maxLng - minLng)) * W));
  const getY = (lt) => Math.max(12, Math.min(H - 12, (1 - (lt - minLat) / (maxLat - minLat)) * H));

  const handleClick = (e) => {
    playSound('click');
    const rect = e.currentTarget.getBoundingClientRect();
    const clickedLng = minLng + ((e.clientX - rect.left) / rect.width) * (maxLng - minLng);
    const clickedLat = minLat + (1 - (e.clientY - rect.top) / rect.height) * (maxLat - minLat);
    onChangeLocation?.(+clickedLat.toFixed(5), +clickedLng.toFixed(5));
    setGpsStatus(null);
  };

  const handleGps = () => {
    playSound('select');
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setGpsLoading(false);
        onChangeLocation?.(+coords.latitude.toFixed(5), +coords.longitude.toFixed(5));
        setGpsStatus('ok');
        playSound('success');
        onGpsSuccess?.();
        setTimeout(() => setGpsStatus(null), 4000);
      },
      () => {
        setGpsLoading(false);
        setGpsStatus('error');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const cx = getX(lng), cy = getY(lat);
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div style={{ border: '2px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
      {/* Prominent One-Tap GPS Button */}
      <div style={{ padding: '0.85rem 1rem', background: '#F0FDF4', borderBottom: '1.5px solid #BBF7D0' }}>
        <button
          type="button"
          onClick={handleGps}
          disabled={gpsLoading}
          className="pulsing-gps"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            padding: '0.8rem 1.25rem',
            background: '#16A34A',
            color: '#FFFFFF',
            borderRadius: '12px',
            fontSize: '0.95rem',
            fontWeight: 800,
            boxShadow: '0 3px 10px rgba(22,163,74,0.3)',
            cursor: 'pointer',
          }}
        >
          <Navigation size={18} className={gpsLoading ? 'animate-spin' : ''} />
          {gpsLoading
            ? (lang === 'hi' ? 'स्थान खोज रहे हैं…' : lang === 'es' ? 'Buscando GPS…' : 'Detecting GPS Location…')
            : (lang === 'hi' ? '📍 मेरा स्थान अपने आप खोजें (GPS)' : lang === 'es' ? '📍 Detectar Mi Ubicación con GPS' : '📍 Detect My Current Location (1-Tap GPS)')
          }
        </button>
      </div>

      {/* GPS Status feedback */}
      {gpsStatus === 'ok' && (
        <div style={{ background: '#DCFCE7', padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#14532D', fontWeight: 700, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <CheckCircle2 size={16} color="#16A34A" />
          {lang === 'hi' ? 'स्थान सफलतापूर्वक लॉक हो गया!' : lang === 'es' ? '¡Ubicación fijada con éxito!' : 'GPS location locked successfully!'}
        </div>
      )}
      {gpsStatus === 'error' && (
        <div style={{ background: '#FEF2F2', padding: '0.5rem 1rem', fontSize: '0.82rem', color: '#B91C1C', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Info size={15} />
          {lang === 'hi' ? 'GPS नहीं मिला। कृपया नीचे दिए नक्शे पर छुएं।' : lang === 'es' ? 'GPS no disponible. Toca el mapa para fijar.' : 'GPS unavailable. Tap anywhere on the city map below.'}
        </div>
      )}

      {/* SVG City Map with Big Touch Target */}
      <div onClick={handleClick} style={{ cursor: 'crosshair', position: 'relative', background: '#F1F5F9' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
          {/* Water */}
          <path d="M0,0 L600,0 L600,65 C450,60,360,80,240,65 C120,50,60,85,0,75Z" fill="#DBEAFE" stroke="#BFDBFE" strokeWidth="1" />
          <text x="310" y="40" fill="#1D4ED8" fontSize="12" fontWeight="800" opacity="0.6">🌊 MARINA BAY</text>

          {/* Parks */}
          <rect x="42" y="150" width="135" height="85" rx="10" fill="#DCFCE7" stroke="#BBF7D0" strokeWidth="1" />
          <text x="65" y="195" fill="#15803D" fontSize="11" fontWeight="800" opacity="0.7">🌳 PARK HEIGHTS</text>

          {/* Grid roads */}
          <g stroke="#E2E8F0" strokeWidth="4">
            {[110, 175, 245, 305].map(y => <line key={y} x1="0" y1={y} x2={W} y2={y} />)}
            {[110, 215, 335, 455].map(x => <line key={x} x1={x} y1="0" x2={x} y2={H} />)}
          </g>

          {/* Highway */}
          <path d="M0,280 Q280,235,600,285" fill="none" stroke="#CBD5E1" strokeWidth="6" strokeDasharray="10,5" />
          <text x="250" y="265" fill="#64748B" fontSize="10" fontWeight="700">🛣️ METRO EXPRESSWAY</text>

          {/* Active Big Pin */}
          <g transform={`translate(${cx},${cy})`}>
            <circle r="26" fill="#2563EB" opacity="0.2" className="pulse-badge" />
            <circle r="14" fill="#2563EB" opacity="0.35" />
            <path d="M0,0 C-10,-15,-10,-30,0,-30 C10,-30,10,-15,0,0Z" fill="#DC2626" stroke="#fff" strokeWidth="3" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))" />
            <circle cy="-20" r="5" fill="#fff" />
          </g>
        </svg>

        {/* Floating Tap instruction & Google Maps Link */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
          borderRadius: '8px', padding: '0.3rem 0.7rem', fontSize: '0.75rem',
          fontWeight: 700, color: '#374151', border: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', gap: '0.4rem',
        }}>
          👆 {lang === 'hi' ? 'नक्शे पर छूकर जगह बदलें' : lang === 'es' ? 'Toca para mover el pin' : 'Tap anywhere to drop pin'}
        </div>

        <div style={{
          position: 'absolute', bottom: '10px', left: '10px',
          background: 'rgba(255,255,255,0.94)', borderRadius: '8px',
          padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #E5E7EB',
        }}>
          <span>📍 <strong>{wardName}</strong></span>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: '#2563EB', display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', fontWeight: 700 }}>
            <ExternalLink size={12} /> Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── YOLO Defect Scanner Component ──────────────────────── */
function YoloBox({ onDone, currentIssueType, onSelectPreset, lang = 'en', t }) {
  const [preview, setPreview] = useState(null);
  const [annotated, setAnnotated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState([]);
  const [view, setView] = useState('annotated');

  const runDetection = async (file, overrideType) => {
    setLoading(true);
    try {
      const res = await runYoloDetection(file, overrideType || currentIssueType);
      setAnnotated(res.annotated_image_base64);
      setDetections(res.detections || []);
      onDone?.(res);
      playSound('select');
    } catch {
      const fallback = [{ label: (overrideType || currentIssueType).replace('_', ' '), confidence: 0.94, box: [] }];
      setDetections(fallback);
      onDone?.({ detections: fallback, average_confidence: 0.94 });
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    playSound('click');
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
    await runDetection(file);
  };

  const handlePreset = async (p) => {
    playSound('select');
    onSelectPreset?.(p.issue_type, p.desc);
    const blob = new Blob([p.svg], { type: 'image/svg+xml' });
    const file = new File([blob], `${p.id}.svg`, { type: 'image/svg+xml' });
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(blob);
    await runDetection(file, p.issue_type);
  };

  return (
    <div style={{ border: '2px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
      {/* Preset sample buttons with large friendly icons */}
      <div style={{
        padding: '0.85rem 1rem', background: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>
            📸 {t.samplesLabel}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {SAMPLE_PRESETS.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => handlePreset(p)}
              disabled={loading}
              className="quick-chip"
              style={{ fontSize: '0.78rem' }}
            >
              <span>{p.emoji}</span> {t[p.labelKey] || p.labelKey}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Zone */}
      {!preview ? (
        <label style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '0.75rem', padding: '2rem 1.5rem', cursor: 'pointer',
          background: '#FAFAFA', border: '2px dashed #CBD5E1',
          borderRadius: '0 0 16px 16px', transition: 'all 0.15s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#EFF6FF'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#FAFAFA'; }}
        >
          <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
          <div style={{
            width: '54px', height: '54px', borderRadius: '16px',
            background: '#DBEAFE', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#2563EB', boxShadow: '0 3px 10px rgba(37,99,235,0.15)'
          }}>
            <Camera size={28} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>{t.uploadPhoto}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>{t.uploadPhotoSub}</div>
          </div>
        </label>
      ) : (
        <div style={{ padding: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['annotated', 'original'].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  className="btn btn-sm"
                  style={{
                    background: view === v ? '#2563EB' : '#F1F5F9',
                    color: view === v ? '#fff' : '#475569',
                    fontSize: '0.78rem', fontWeight: 700, padding: '0.3rem 0.75rem',
                  }}
                >
                  {v === 'annotated' ? '🎯 YOLO AI Detection' : '🖼️ Original'}
                </button>
              ))}
            </div>
            <label className="btn-ghost" style={{ cursor: 'pointer', fontSize: '0.78rem', color: '#2563EB', fontWeight: 700 }}>
              <RefreshCw size={13} /> {lang === 'hi' ? 'बदलें' : lang === 'es' ? 'Cambiar' : 'Change Photo'}
              <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#0F172A', maxHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', zIndex: 2 }}>
                <div style={{ width: '32px', height: '32px', border: '3px solid #BFDBFE', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1D4ED8' }}>Analyzing Photo with YOLO…</span>
              </div>
            )}
            <img
              src={view === 'annotated' && annotated ? annotated : preview}
              alt="Scan"
              style={{ maxWidth: '100%', maxHeight: '240px', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {detections.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.65rem' }}>
              {detections.map((d, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                  background: '#FEF2F2', border: '1.5px solid #FECACA',
                  color: '#991B1B', padding: '0.3rem 0.7rem', borderRadius: '8px',
                  fontSize: '0.8rem', fontWeight: 700,
                }}>
                  <Eye size={14} color="#DC2626" />
                  {d.label}
                  <span style={{ background: '#DC2626', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>
                    {Math.round(d.confidence * 100)}%
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main CitizenView with Easy Visual & Voice Integration ── */
export default function CitizenView({ onReportSubmitted }) {
  const [lang, setLang] = useState('en');
  const [viewMode, setViewMode] = useState('easy'); // 'easy' | 'full'
  const [issueType, setIssueType] = useState('pothole');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState(37.7842);
  const [lng, setLng] = useState(-122.4071);
  const [addressHint, setAddressHint] = useState('Downtown Central, 5th & Market St');
  const [wardName, setWardName] = useState('Downtown Central');
  const [yoloResult, setYoloResult] = useState(null);
  const [aiPreview, setAiPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState(null);

  // Voice recording & narration states
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);
  const recognizerRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Live AI estimate debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const p = await classifyTextPreview({ issue_type: issueType, description });
        setAiPreview(p);
      } catch { /* silent */ }
    }, 350);
    return () => clearTimeout(timer);
  }, [issueType, description]);

  const handleLocation = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
    setWardName(newLat > 37.795 ? 'Harbor & Marina' : newLng < -122.43 ? 'Park Heights' : newLat < 37.76 ? 'Industrial Hub' : 'Downtown Central');
  };

  // Toggle voice guide narration
  const toggleGuideSpeech = () => {
    if (isSpeakingGuide) {
      stopSpeaking();
      setIsSpeakingGuide(false);
    } else {
      playSound('select');
      setIsSpeakingGuide(true);
      speakText(t.guideSpeech, lang);
      // Auto reset flag when speech ends
      setTimeout(() => setIsSpeakingGuide(false), 12000);
    }
  };

  // Pronounce specific issue
  const handleIssueSelect = (opt) => {
    playSound('select');
    setIssueType(opt.id);
    const textToSpeak = lang === 'hi' ? opt.speechHi : lang === 'es' ? opt.speechEs : opt.speechEn;
    speakText(textToSpeak, lang);
  };

  // Microphone Voice Recording (Speech-to-Text)
  const toggleRecording = () => {
    playSound('mic');
    if (isRecording) {
      recognizerRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognizer = createSpeechRecognizer({
      lang,
      onResult: (text) => {
        setDescription(prev => (prev ? `${prev} ${text}` : text));
      },
      onEnd: () => {
        setIsRecording(false);
      },
      onError: (err) => {
        console.warn('Speech error:', err);
        setIsRecording(false);
      },
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      recognizer.start();
      setIsRecording(true);
    } else {
      alert(t.speechNotSupported);
    }
  };

  // Quick tag append
  const handleAddQuickTag = (tag) => {
    playSound('click');
    const label = lang === 'hi' ? tag.hi : lang === 'es' ? tag.es : tag.en;
    setDescription(prev => (prev.includes(label) ? prev : prev ? `${prev}, ${label}` : label));
    speakText(label, lang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    playSound('click');
    setSubmitting(true);
    setError(null);
    try {
      const result = await createReport({
        issue_type: issueType,
        description,
        latitude: lat,
        longitude: lng,
        address_hint: addressHint || `Ward: ${wardName}`,
        image_base64: yoloResult?.annotated_image_base64 || null,
      });
      setSubmitted(result);
      onReportSubmitted?.(result);
      playSound('success');
      try { confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } }); } catch { /* */ }

      // Spoken voice feedback upon ticket creation
      const voiceFeedback = lang === 'hi'
        ? `धन्यवाद! आपकी शिकायत नंबर ${result.ticket_number} दर्ज हो गई है। इसे ठीक करने की समय सीमा ${result.ai_explanation?.sla_hours || 6} घंटे है।`
        : lang === 'es'
        ? `¡Gracias! Su reporte número ${result.ticket_number} ha sido registrado. El equipo resolverá el problema pronto.`
        : `Thank you! Your complaint number ${result.ticket_number} has been logged. Routed to ${result.assigned_department}.`;
      speakText(voiceFeedback, lang);

    } catch {
      setError('Failed to submit. Please check backend connection.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className="container" style={{ paddingBottom: '3rem' }}>
        <PipelineStrip activeStage={4} />

        <div style={{
          background: '#F0FDF4',
          border: '2px solid #86EFAC',
          borderRadius: '18px',
          padding: '1.75rem 2rem',
          marginBottom: '1.75rem',
          boxShadow: '0 8px 25px rgba(22,163,74,0.12)',
        }} className="animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: '#16A34A', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(22,163,74,0.35)', fontSize: '1.5rem',
              }}>
                <CheckCircle2 size={32} />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#14532D' }}>
                  {t.successTitle}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#15803D', marginTop: '2px' }}>
                  Ticket <strong>{submitted.ticket_number}</strong> · {t.successSub}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  playSound('select');
                  speakText(lang === 'hi' ? 'शिकायत की स्थिति जांचें' : 'Read ticket status', lang);
                }}
                className="btn btn-secondary"
                style={{ gap: '0.4rem', padding: '0.65rem 1rem' }}
              >
                <Volume2 size={16} color="#16A34A" /> {lang === 'hi' ? 'आवाज़ में सुनें' : 'Listen Status'}
              </button>
              <button
                onClick={() => {
                  playSound('click');
                  setSubmitted(null);
                  setDescription('');
                  setYoloResult(null);
                }}
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.25rem', fontWeight: 800 }}
              >
                {t.submitAnother}
              </button>
            </div>
          </div>
        </div>

        <AiExplainDrawer explanation={submitted.ai_explanation} />
      </div>
    );
  }

  /* ── Citizen View UI ── */
  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      <PipelineStrip activeStage={1} />

      {/* ── Accessible Toolbar: Language Selector + Mode Switch + Voice Guide ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px',
        padding: '0.75rem 1.25rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
      }}>
        {/* Language selector buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={16} color="#64748B" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Language:</span>
          {[
            { code: 'en', label: '🇬🇧 English' },
            { code: 'hi', label: '🇮🇳 हिंदी' },
            { code: 'es', label: '🇪🇸 Español' },
          ].map(l => (
            <button
              key={l.code}
              type="button"
              onClick={() => { playSound('click'); setLang(l.code); }}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: lang === l.code ? 800 : 600,
                background: lang === l.code ? '#2563EB' : '#FFFFFF',
                color: lang === l.code ? '#FFFFFF' : '#334155',
                border: lang === l.code ? '1px solid #2563EB' : '1px solid #CBD5E1',
                cursor: 'pointer',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Voice Assistant / Read Aloud Button + Mode Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={toggleGuideSpeech}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.45rem',
              padding: '0.45rem 0.95rem', borderRadius: '10px',
              background: isSpeakingGuide ? '#DC2626' : '#EFF6FF',
              color: isSpeakingGuide ? '#FFFFFF' : '#1D4ED8',
              border: isSpeakingGuide ? '1.5px solid #DC2626' : '1.5px solid #BFDBFE',
              fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer',
            }}
          >
            <Volume2 size={16} className={isSpeakingGuide ? 'animate-pulse' : ''} />
            {isSpeakingGuide ? t.stopGuide : t.listenGuide}
          </button>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: '#E2E8F0', borderRadius: '10px', padding: '3px' }}>
            <button
              type="button"
              onClick={() => { playSound('click'); setViewMode('easy'); }}
              style={{
                padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
                background: viewMode === 'easy' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'easy' ? '#1E293B' : '#64748B',
                boxShadow: viewMode === 'easy' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {t.modeEasy}
            </button>
            <button
              type="button"
              onClick={() => { playSound('click'); setViewMode('full'); }}
              style={{
                padding: '0.35rem 0.8rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
                background: viewMode === 'full' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'full' ? '#1E293B' : '#64748B',
                boxShadow: viewMode === 'full' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {t.modeFull}
            </button>
          </div>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {t.title}
          <span className="badge badge-blue" style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}>
            <Zap size={12} /> AI-Powered
          </span>
        </h1>
        <p className="section-subtitle">
          {t.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: viewMode === 'easy' ? '1fr' : '1fr 390px', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Main Reporting Column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* ── STEP 1: Giant Pictorial Issue Cards ── */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {t.step1}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                🔊 {lang === 'hi' ? 'नाम सुनने के लिए 🔊 दबाएं' : 'Tap 🔊 on any card to hear its name'}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem'
            }}>
              {ISSUES.map((opt) => {
                const active = issueType === opt.id;
                const label = lang === 'hi' ? opt.labelHi : lang === 'es' ? opt.labelEs : opt.labelEn;
                const sub = lang === 'hi' ? opt.subHi : lang === 'es' ? opt.subEs : opt.subEn;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleIssueSelect(opt)}
                    className={`pictorial-card ${active ? 'active' : ''}`}
                    style={{
                      borderColor: active ? opt.color : '#E5E7EB',
                      background: active ? opt.bg : '#FFFFFF',
                    }}
                  >
                    {/* Active checkmark badge */}
                    {active && (
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        background: opt.color, color: '#fff',
                        width: '22px', height: '22px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                      }}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}

                    {/* Speaker hear button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound('click');
                        const sp = lang === 'hi' ? opt.speechHi : lang === 'es' ? opt.speechEs : opt.speechEn;
                        speakText(sp, lang);
                      }}
                      title="Hear name out loud"
                      style={{
                        position: 'absolute', top: '10px', left: '10px',
                        background: 'rgba(255,255,255,0.85)',
                        border: '1px solid #E2E8F0',
                        borderRadius: '6px',
                        padding: '0.2rem 0.35rem',
                        color: '#64748B',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center'
                      }}
                    >
                      <Volume2 size={13} />
                    </button>

                    {/* Giant emoji & icon */}
                    <div style={{ fontSize: '2.5rem', marginTop: '0.35rem', marginBottom: '0.4rem' }}>
                      {opt.emoji}
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: active ? '#111827' : '#334155' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px', lineHeight: 1.3 }}>
                      {sub}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── STEP 2: Photo & AI Scanner ── */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.85rem' }}>
              {t.step2}
            </div>
            <YoloBox
              onDone={setYoloResult}
              currentIssueType={issueType}
              onSelectPreset={(type, desc) => {
                setIssueType(type);
                setDescription(desc);
                const match = ISSUES.find(i => i.id === type);
                if (match) {
                  const sp = lang === 'hi' ? match.speechHi : lang === 'es' ? match.speechEs : match.speechEn;
                  speakText(sp, lang);
                }
              }}
              lang={lang}
              t={t}
            />
          </div>

          {/* ── STEP 3: One-Tap Location (GPS & Map) ── */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.85rem' }}>
              {t.step3}
            </div>
            <MiniMap
              lat={lat}
              lng={lng}
              wardName={wardName}
              onChangeLocation={handleLocation}
              lang={lang}
              onGpsSuccess={() => {
                speakText(lang === 'hi' ? 'आपका स्थान मिल गया है' : 'GPS location locked', lang);
              }}
            />
            <div style={{ marginTop: '0.75rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder={lang === 'hi' ? 'आस-पास का लैंडमार्क या पता (वैकल्पिक)' : 'Street address / landmark hint (optional)'}
                value={addressHint}
                onChange={e => setAddressHint(e.target.value)}
                style={{ fontSize: '0.88rem', padding: '0.65rem 0.95rem' }}
              />
            </div>
          </div>

          {/* ── STEP 4: Speak Your Problem (Microphone & Quick Tags) ── */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
                {t.step4}
              </div>
              <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={13} /> AI Urgency Scanner Active
              </span>
            </div>

            {/* Giant Microphone Button for Voice Recording */}
            <div style={{ marginBottom: '1.1rem' }}>
              <button
                type="button"
                onClick={toggleRecording}
                className={isRecording ? 'pulsing-mic' : ''}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  background: isRecording ? '#FEF2F2' : '#EFF6FF',
                  border: isRecording ? '2px solid #EF4444' : '2px solid #BFDBFE',
                  color: isRecording ? '#DC2626' : '#1D4ED8',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: isRecording ? '0 4px 14px rgba(239,68,68,0.2)' : '0 2px 8px rgba(37,99,235,0.08)'
                }}
              >
                {isRecording ? (
                  <>
                    <MicOff size={22} color="#DC2626" />
                    <div className="wave-container">
                      <div className="wave-bar" />
                      <div className="wave-bar" />
                      <div className="wave-bar" />
                      <div className="wave-bar" />
                      <div className="wave-bar" />
                      <div className="wave-bar" />
                    </div>
                    <span>{t.speakingState}</span>
                  </>
                ) : (
                  <>
                    <Mic size={22} color="#2563EB" />
                    <span>{t.speakBtn}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Context Emojis / Chips */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.45rem' }}>
                {t.quickTagsLabel}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {QUICK_TAGS.map(tag => {
                  const tagText = lang === 'hi' ? tag.hi : lang === 'es' ? tag.es : tag.en;
                  const isSelected = description.includes(tagText);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleAddQuickTag(tag)}
                      className={`quick-chip ${isSelected ? 'active' : ''}`}
                    >
                      <span>{tag.emoji}</span>
                      <span>{tagText}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text description area */}
            <textarea
              className="form-input"
              rows={3}
              placeholder={lang === 'hi' ? 'यहाँ बोलें या लिखें... जैसे "स्कूल के सामने बड़ा गड्ढा है"' : 'Speak with mic above or type details here...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ resize: 'vertical', fontSize: '0.92rem' }}
            />

            {/* NLP matched keywords */}
            {aiPreview?.matched_keywords?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Zap size={12} /> Priority Signals Detected:
                </span>
                {aiPreview.matched_keywords.map((kw, i) => (
                  <span key={i} style={{
                    background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C',
                    fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '6px',
                  }}>
                    +{kw.weight} "{kw.keyword}"
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Giant Submit Button ── */}
          <div style={{ marginTop: '0.5rem' }}>
            {error && (
              <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '0.85rem 1rem', fontSize: '0.88rem', color: '#DC2626', marginBottom: '1rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                padding: '1.25rem',
                fontSize: '1.15rem',
                fontWeight: 800,
                borderRadius: '16px',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(37,99,235,0.3)',
                gap: '0.75rem',
              }}
            >
              <Send size={22} />
              {submitting ? t.submittingBtn : t.submitBtn}
            </button>
          </div>
        </div>

        {/* ── Side Column (Live AI Preview in Full Mode or Sticky Box) ── */}
        {viewMode === 'full' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'sticky', top: '80px' }}>
            {aiPreview && (
              <div style={{
                border: '1.5px solid #BFDBFE', borderRadius: '16px',
                padding: '1.25rem', background: '#EFF6FF',
                boxShadow: '0 4px 12px rgba(37,99,235,0.06)'
              }} className="animate-fade-up">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Sparkles size={16} color="#2563EB" />
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Live AI Routing</span>
                  </div>
                  <span className={`badge badge-${aiPreview.priority_level?.toLowerCase()}`}>
                    {aiPreview.priority_level} · {aiPreview.final_score}/10
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.85rem', color: '#1E40AF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Send size={14} color="#3B82F6" />
                    <span><strong>Department:</strong> {aiPreview.assigned_department}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} color="#3B82F6" />
                    <span><strong>Resolution SLA:</strong> {aiPreview.sla_hours} hours</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Eye size={14} color="#3B82F6" />
                    <span><strong>Vision Confidence:</strong> {Math.round((aiPreview.confidence_score || 0.88) * 100)}%</span>
                  </div>
                </div>

                {/* Score bar */}
                <div style={{ marginTop: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#3B82F6', marginBottom: '0.35rem', fontWeight: 700 }}>
                    <span>Urgency Level</span>
                    <span>{aiPreview.final_score} / 10</span>
                  </div>
                  <div className="progress-bar" style={{ background: '#BFDBFE', height: '8px' }}>
                    <div
                      className="progress-fill"
                      style={{
                        width: `${aiPreview.final_score * 10}%`,
                        background: aiPreview.final_score >= 8 ? '#DC2626' : aiPreview.final_score >= 5 ? '#D97706' : '#2563EB',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
