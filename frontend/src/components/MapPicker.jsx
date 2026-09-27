import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Navigation, MapPin, ExternalLink, LocateFixed } from 'lucide-react';

const MAP_LIBRARIES = ['places'];

const containerStyle = {
  width: '100%',
  height: '360px',
  borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
};

const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // New Delhi

export default function MapPicker({
  latitude,
  longitude,
  onChangeLocation,
  wardName,
  readOnly = false,
}) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries: MAP_LIBRARIES,
  });

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError]   = useState(null);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [address, setAddress]     = useState('');
  const mapRef = useRef(null);

  const center = (latitude && longitude)
    ? { lat: latitude, lng: longitude }
    : DEFAULT_CENTER;

  // Reverse geocode to get a human-readable address
  const reverseGeocode = useCallback((lat, lng) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      }
    });
  }, []);

  // Called when user drags/clicks on map
  const handleMapClick = useCallback((e) => {
    if (readOnly) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    onChangeLocation(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
    reverseGeocode(lat, lng);
    setGpsSuccess(false);
  }, [readOnly, onChangeLocation, reverseGeocode]);

  // Marker drag end
  const handleMarkerDrag = useCallback((e) => {
    if (readOnly) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    onChangeLocation(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
    reverseGeocode(lat, lng);
  }, [readOnly, onChangeLocation, reverseGeocode]);

  // 1-tap GPS detect
  const handleUseGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setGpsLoading(false);
        setGpsSuccess(true);
        onChangeLocation(lat, lng);
        reverseGeocode(lat, lng);
        // Pan map to user's location
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(16);
        }
        setTimeout(() => setGpsSuccess(false), 5000);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(
          err.code === 1
            ? 'Location permission denied. Please allow location access in your browser settings.'
            : 'Failed to detect GPS. Please tap on the map to pin your location.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [onChangeLocation, reverseGeocode]);

  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  // No API key configured
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <div style={{ border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        {/* GPS button — works without map */}
        <button
          onClick={handleUseGps}
          disabled={gpsLoading}
          style={{
            width: '100%', padding: '0.85rem', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '0.5rem', background: gpsSuccess ? '#16A34A' : '#2563EB',
            color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
          }}
        >
          <LocateFixed size={18} />
          {gpsLoading ? 'Detecting GPS…' : gpsSuccess ? '✅ Location Captured!' : '📍 Detect My Current Location (1-Tap GPS)'}
        </button>

        <div style={{ background: '#FFF7ED', border: '1px solid #FDE68A', padding: '1.25rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, color: '#B45309', marginBottom: '0.5rem' }}>⚠️ Google Maps API Key Required</p>
          <p style={{ fontSize: '0.85rem', color: '#78350F', lineHeight: 1.5 }}>
            Add your key to <code style={{ background: '#FEF3C7', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>frontend/.env</code>:<br />
            <code style={{ fontSize: '0.8rem', color: '#92400E' }}>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>
          </p>
          {latitude && longitude && (
            <p style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#6B7280' }}>
              📍 GPS Captured: <strong>{latitude}°N, {longitude}°E</strong>
              {' · '}
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563EB' }}>
                View on Google Maps ↗
              </a>
            </p>
          )}
        </div>

        {gpsError && (
          <div style={{ padding: '0.75rem 1rem', background: '#FEF2F2', borderTop: '1px solid #FECACA', fontSize: '0.83rem', color: '#DC2626' }}>
            ⚠️ {gpsError}
          </div>
        )}
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ padding: '1.5rem', textAlign: 'center', color: '#DC2626', background: '#FEF2F2', borderRadius: 'var(--radius-lg)' }}>
        ❌ Failed to load Google Maps. Check your API key.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-light)' }}>
        <div style={{ textAlign: 'center', color: '#6B7280' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #E5E7EB', borderTop: '3px solid #2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 0.75rem' }} />
          Loading Google Maps…
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: '1.5px solid var(--border-light)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.6rem 1rem', background: '#fff', borderBottom: '1px solid var(--border-light)',
        flexWrap: 'wrap', gap: '0.5rem',
      }}>
        {/* GPS Button */}
        <button
          onClick={handleUseGps}
          disabled={gpsLoading || readOnly}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            background: gpsSuccess ? '#16A34A' : '#2563EB',
            color: '#fff', border: 'none', borderRadius: '8px',
            padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.85rem',
            cursor: readOnly ? 'not-allowed' : 'pointer',
            opacity: gpsLoading ? 0.75 : 1,
            transition: 'background 0.2s ease',
          }}
        >
          <LocateFixed size={15} />
          {gpsLoading
            ? 'Detecting GPS…'
            : gpsSuccess
            ? '✅ Location Locked!'
            : '📍 Use My GPS Location'}
        </button>

        {/* Right: coords + GMaps link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: '#6B7280' }}>
          {latitude && longitude && (
            <>
              <span style={{ fontFamily: 'var(--font-mono)' }}>
                {latitude.toFixed(5)}°N, {longitude.toFixed(5)}°E
              </span>
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#2563EB', fontWeight: 600 }}>
                <ExternalLink size={12} /> Google Maps
              </a>
            </>
          )}
          {!readOnly && (
            <span style={{ color: '#9CA3AF', fontSize: '0.74rem' }}>
              🖱 Click or drag pin to adjust
            </span>
          )}
        </div>
      </div>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={latitude && longitude ? 15 : 12}
        onClick={handleMapClick}
        onLoad={(map) => { mapRef.current = map; }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          styles: [
            { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          ],
        }}
      >
        {latitude && longitude && (
          <Marker
            position={{ lat: latitude, lng: longitude }}
            draggable={!readOnly}
            onDragEnd={handleMarkerDrag}
            animation={window.google?.maps?.Animation?.DROP}
          />
        )}
      </GoogleMap>

      {/* Address / status bar */}
      <div style={{ padding: '0.55rem 1rem', background: '#F8FAFC', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapPin size={13} color="#DC2626" />
        {address
          ? address
          : wardName
          ? wardName
          : latitude && longitude
          ? `${latitude.toFixed(5)}°N, ${longitude.toFixed(5)}°E`
          : 'Pin not placed yet'}
      </div>

      {/* GPS error */}
      {gpsError && (
        <div style={{ padding: '0.65rem 1rem', background: '#FEF2F2', borderTop: '1px solid #FECACA', fontSize: '0.82rem', color: '#DC2626', display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
          ⚠️ {gpsError}
        </div>
      )}
    </div>
  );
}
