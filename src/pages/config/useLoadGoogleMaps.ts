/* // useLoadGoogleMaps.ts
import { useState, useEffect } from 'react';

const useLoadGoogleMaps = (apiKey: string) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  return loaded;
};

export default useLoadGoogleMaps; */
import { useJsApiLoader } from '@react-google-maps/api';

const useLoadGoogleMaps = (apiKey: string) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places', 'geometry'], // Add geometry if needed
  });

  return { isLoaded, loadError };
};

export default useLoadGoogleMaps;