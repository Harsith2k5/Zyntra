/* import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Leaf, 
  CreditCard, 
  Route,
  Plus
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockTrips } from '../data/mockData';

const TripPlanner: React.FC = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const navigate = useNavigate();

  const handlePlanTrip = () => {
    if (fromLocation && toLocation) {
      setShowRoutes(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20 pb-8">
      <div className="container-responsive">
      
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Smart Trip Planner</h1>
          <p className="text-white/60">
            Plan your journey with optimal charging stops and route efficiency
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#16FFBD] w-5 h-5" />
                <input
                  type="text"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                  placeholder="From: Enter starting location"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF6EC7] w-5 h-5" />
                <input
                  type="text"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#FF6EC7] focus:outline-none focus:ring-2 focus:ring-[#FF6EC7]/20 transition-all"
                  placeholder="To: Enter destination"
                />
              </div>

              <div className="flex items-center space-x-4">
                <NeonButton
                  onClick={handlePlanTrip}
                  disabled={!fromLocation || !toLocation}
                  className="flex-1"
                >
                  <Route className="w-4 h-4 mr-2" />
                  Plan Trip
                </NeonButton>
                
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {showRoutes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-white">Recommended Routes</h2>
            
            {mockTrips.map((trip, index) => (
              <GlassCard key={trip.id} className="p-6" hoverable>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-[#16FFBD]/20 text-[#16FFBD] rounded-full text-sm font-medium">
                        Route {index + 1}
                      </span>
                      {index === 0 && (
                        <span className="px-3 py-1 bg-[#FCEE09]/20 text-[#FCEE09] rounded-full text-sm font-medium">
                          Fastest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <Route className="w-4 h-4 text-white/60" />
                        <span className="text-white/60 text-sm">
                          {trip.distance} km, {Math.floor(trip.duration / 60)}h {trip.duration % 60}m
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Leaf className="w-4 h-4 text-[#16FFBD]" />
                        <span className="text-[#16FFBD] text-sm font-medium">
                          -{trip.co2Saved} kg CO₂
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-white/60" />
                        <span className="text-white/60 text-sm">
                          ₹{trip.estimatedCost}
                        </span>
                      </div>
                    </div>
                  </div>
                  <NeonButton
                    onClick={() => navigate('/booking')}
                    size="sm"
                    glowColor="mint"
                  >
                    Start Trip
                  </NeonButton>
                </div>

                <div className="space-y-3">
                  <h4 className="text-white font-medium">Charging Stops</h4>
                  {trip.chargingStops.map((stop, stopIndex) => (
                    <div
                      key={stopIndex}
                      className="flex items-center space-x-4 p-3 bg-white/5 rounded-2xl"
                    >
                      <div className="w-3 h-3 bg-[#16FFBD] rounded-full" />
                      <div className="flex-1">
                        <div className="text-white font-medium">{stop.name}</div>
                        <div className="text-white/60 text-sm">
                          {stop.distance} km • {stop.waitTime} min wait • ₹{stop.pricing}/kWh
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-sm">~30 min</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 h-32 bg-gradient-to-br from-[#16FFBD]/5 to-[#FF6EC7]/5 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="w-8 h-8 text-[#16FFBD] mx-auto mb-2" />
                    <span className="text-white/60 text-sm">Route Preview</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Popular Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Delhi Airport', distance: '45 km', time: '1h 20m' },
              { name: 'Gurgaon Mall', distance: '12 km', time: '25m' },
              { name: 'Noida Stadium', distance: '28 km', time: '45m' },
              { name: 'Faridabad', distance: '35 km', time: '1h 5m' }
            ].map((destination, index) => (
              <GlassCard
                key={index}
                className="p-4 text-center cursor-pointer"
                hoverable
                onClick={() => {
                  setToLocation(destination.name);
                  setFromLocation('Current Location');
                }}
              >
                <div className="text-white font-medium mb-1">{destination.name}</div>
                <div className="text-white/60 text-sm">{destination.distance}</div>
                <div className="text-white/40 text-xs">{destination.time}</div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TripPlanner; */
/* import React, { useEffect, useState, useCallback } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  DirectionsService,
} from '@react-google-maps/api';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { MapPin, Route } from 'lucide-react';

const API_KEY = 'AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg';
const libraries: (
  'places' | 'drawing' | 'geometry' | 'visualization'
)[] = ['places'];

type Coord = { lat: number; lng: number };
type Stop = { name: string; location: Coord };

const containerStyle = {
  width: '100%',
  height: '400px',
};

const TripPlanner: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: API_KEY,
  libraries: ['places'], // ✅ only valid entries
});


  const [start, setStart] = useState<Coord | null>(null);
  const [endAddr, setEndAddr] = useState('');
  const [endLoc, setEndLoc] = useState<Coord | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = pos.coords;
        setStart({ lat: coords.latitude, lng: coords.longitude });
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, []);

  // Plan route
  const planRoute = () => {
    if (!start || !endAddr || !window.google || !mapRef) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: endAddr }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location.toJSON();
        setEndLoc(location);
        mapRef.panTo(location);
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  };

  // Fetch charging stops
  const fetchStops = () => {
    if (!window.google || !endLoc || !mapRef) return;

    const service = new window.google.maps.places.PlacesService(mapRef);
    const location = new window.google.maps.LatLng(endLoc.lat, endLoc.lng);

    service.nearbySearch(
      {
        location,
        radius: 30000,
type: 'gas_station',

        keyword: 'charger',
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const selected = results.slice(0, 3).map((r) => ({
            name: r.name || 'Charger',
            location: r.geometry?.location?.toJSON() || { lat: 0, lng: 0 },
          }));
          setStops(selected);
        } else {
          console.error('Places search failed:', status);
        }
      }
    );
  };

  const directionsCallback = useCallback((res: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status === 'OK' && res) {
      setDirections(res);
    } else {
      console.error('Directions request failed:', status);
    }
  }, []);

  useEffect(() => {
    if (endLoc) fetchStops();
  }, [endLoc]);

  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <GlassCard className="p-6 mb-6">
        <div className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-[#16FFBD]" />
            <input
              type="text"
              placeholder="Enter destination"
              value={endAddr}
              onChange={(e) => setEndAddr(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#FF6EC7] focus:outline-none"
            />
          </div>
          <NeonButton onClick={planRoute} disabled={!start || !endAddr}>
            <Route className="w-4 h-4 mr-2" />
            Plan Trip
          </NeonButton>
        </div>
      </GlassCard>

      {start && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={start}
          zoom={10}
          onLoad={(map) => setMapRef(map)}
        >
          <Marker position={start} label="Start" />
          {endLoc && <Marker position={endLoc} label="End" />}
          {stops.map((stop, i) => (
            <Marker key={i} position={stop.location} label={`Stop ${i + 1}`} />
          ))}

          {start && endLoc && (
            <>
              <DirectionsService
                options={{
                  origin: start,
                  destination: endLoc,
                  waypoints: stops.map((s) => ({
                    location: new window.google.maps.LatLng(s.location.lat, s.location.lng),
                    stopover: true,
                  })),
                  travelMode: google.maps.TravelMode.DRIVING,
                }}
                callback={directionsCallback}
              />
              {directions && (
                <DirectionsRenderer options={{ directions }} />
              )}
            </>
          )}
        </GoogleMap>
      )}
    </div>
  );
};

export default TripPlanner;
 */
/* import React, { useEffect, useState, useCallback } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  DirectionsService,
  InfoWindow
} from '@react-google-maps/api';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { MapPin, Route, Star, Zap, BatteryCharging } from 'lucide-react';

const API_KEY = 'AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg';
const libraries: ('places')[] = ['places'];

type Coord = { lat: number; lng: number };
type Charger = {
  id: string;
  name: string;
  location: Coord;
  type: 'fast' | 'standard' | 'tesla';
  rating: number;
  reviews: number;
  amenities: string[];
  distanceFromStart: string;
  distanceFromEnd: string;
  carbonCredits: number;
};

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const containerStyle = {
  width: '100%',
  height: '500px',
};

const calculateDistance = (coord1: Coord, coord2: Coord): string => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
    Math.cos(coord2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance < 1 
    ? `${(distance * 1000).toFixed(0)} meters` 
    : `${distance.toFixed(1)} km`;
};

const generateRandomRating = () => {
  return (Math.random() * 1 + 4).toFixed(1); // 4.0 to 5.0
};

const generateRandomReviews = () => {
  return Math.floor(Math.random() * 500) + 50; // 50 to 550
};

const locationNames = [
  "Electra Power Hub",
  "Volt Vista Station",
  "Spark Charge Point",
  "Quantum Charging",
  "Nexus Energy Stop",
  "Pulse Power Plaza",
  "Infinity Charge Zone",
  "Eon Refuel Center",
  "Amped Up Charging",
  "Current Junction",
  "MegaWatt Oasis",
  "Juice Box Central",
  "Power Surge Depot",
  "Electron Express",
  "Charge & Go Lounge"
];

const TripPlanner: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const [start, setStart] = useState<Coord | null>(null);
  const [endAddr, setEndAddr] = useState('');
  const [endLoc, setEndLoc] = useState<Coord | null>(null);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<Coord>({ lat: 20.5937, lng: 78.9629 });
  const [zoom, setZoom] = useState<number>(5);
  const [activeCharger, setActiveCharger] = useState<Charger | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setStart(coords);
        setCenter(coords);
        setZoom(12);
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, []);

  const planRoute = () => {
    if (!start || !endAddr || !window.google || !mapRef) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: endAddr }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const loc = results[0].geometry.location.toJSON();
        setEndLoc(loc);
        generateChargerClusters(start, loc);
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  };

  const generateChargerClusters = (start: Coord, end: Coord) => {
    const clusters: Charger[] = [];
    const chargerTypes = ['fast', 'standard', 'tesla'];
    const amenitiesOptions = ['Cafe', 'Restroom', 'WiFi', 'Shopping', 'Parking', 'Restaurant'];
    const usedNames = new Set<string>();
    
    // Generate 9-12 chargers scattered along the route
    const chargerCount = 9 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < chargerCount; i++) {
      // More random scattering
      const fraction = 0.1 + (Math.random() * 0.8); // 10% to 90% along route
      const baseLat = start.lat + (end.lat - start.lat) * fraction;
      const baseLng = start.lng + (end.lng - start.lng) * fraction;
      
      // Create more variation in placement
      const lat = baseLat + (Math.random() - 0.5) * 0.03;
      const lng = baseLng + (Math.random() - 0.5) * 0.03;
      
      const type = chargerTypes[Math.floor(Math.random() * chargerTypes.length)] as 'fast' | 'standard' | 'tesla';
      const amenities = [];
      for (let j = 0; j < 3; j++) {
        amenities.push(amenitiesOptions[Math.floor(Math.random() * amenitiesOptions.length)]);
      }
      
      // Get unique name
      let name;
      do {
        name = locationNames[Math.floor(Math.random() * locationNames.length)];
      } while (usedNames.has(name));
      usedNames.add(name);
      
      clusters.push({
        id: `charger-${i}-${Date.now()}`,
        name: name,
        location: { lat, lng },
        type,
        rating: parseFloat(generateRandomRating()),
        reviews: generateRandomReviews(),
        amenities: [...new Set(amenities)], // Remove duplicates
        distanceFromStart: calculateDistance(start, { lat, lng }),
        distanceFromEnd: calculateDistance(end, { lat, lng }),
         carbonCredits: parseFloat((Math.random() * 5 + 5).toFixed(1))
      });
    }
    
    setChargers(clusters);
  };

  const directionsCallback = useCallback(
    (res: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (status === 'OK' && res) {
        setDirections(res);
      } else {
        console.error('Directions request failed:', status);
      }
    },
    []
  );

  if (!isLoaded) return <div className="text-white p-10">Loading map...</div>;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <GlassCard className="p-6 mb-6">
        <div className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-[#16FFBD]" />
            <input
              type="text"
              placeholder="Enter destination"
              value={endAddr}
              onChange={(e) => setEndAddr(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#FF6EC7] focus:outline-none"
            />
          </div>
          <NeonButton onClick={planRoute} disabled={!start || !endAddr}>
            <Route className="w-4 h-4 mr-2" />
            Plan Trip
          </NeonButton>
        </div>
      </GlassCard>

      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom}
        center={center}
        onLoad={(map) => setMapRef(map)}
        options={{
          styles: darkMapStyles,
          zoomControl: true,
          scrollwheel: true,
          gestureHandling: 'greedy',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {start && <Marker position={start} label="Start" />}
        {endLoc && <Marker position={endLoc} label="End" />}

        {chargers.map((charger) => (
          <Marker
            key={charger.id}
            position={charger.location}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#00FFFF',
              fillOpacity: 0.9,
              strokeColor: '#00FFFF',
              strokeWeight: 0,
              scale: 8,
              anchor: new google.maps.Point(0, 0),
              // Glow effect
              
            }}
            onClick={() => setActiveCharger(charger)}
          />
        ))}

        {activeCharger && (
  <InfoWindow
    position={activeCharger.location}
    onCloseClick={() => setActiveCharger(null)}
  >
    <div className="text-gray-800 w-64 bg-gradient-to-br from-cyan-50 to-blue-100 p-4 rounded-xl shadow-2xl border border-cyan-200 relative">
      
      <button 
        onClick={() => setActiveCharger(null)}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      <div className="pr-5">

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {activeCharger.type === 'tesla' ? (
              <div className="bg-red-100 p-2 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5.362l5.878 5.878-1.414 1.414L12 8.19l-4.464 4.464-1.414-1.414L12 5.362zM12 16.638l-5.878-5.878 1.414-1.414L12 13.81l4.464-4.464 1.414 1.414L12 16.638z"/>
                </svg>
              </div>
            ) : activeCharger.type === 'fast' ? (
              <div className="bg-yellow-100 p-2 rounded-full">
                <Zap className="w-6 h-6 text-yellow-600" fill="currentColor" />
              </div>
            ) : (
              <div className="bg-blue-100 p-2 rounded-full">
                <BatteryCharging className="w-6 h-6 text-blue-600" fill="currentColor" />
              </div>
            )}
          </div>
          
          <div>
            <h2 className="font-bold text-lg text-gray-900">{activeCharger.name}</h2>
            <div className="flex items-center mt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(activeCharger.rating) ? 'fill-current' : ''}`}
                  />
                ))}
              </div>
              <span className="text-xs ml-1 text-gray-600">
                {activeCharger.rating} ({activeCharger.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <p className="text-xs font-medium text-gray-500">From start</p>
            <p className="text-sm font-semibold">{activeCharger.distanceFromStart}</p>
          </div>
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <p className="text-xs font-medium text-gray-500">To destination</p>
            <p className="text-sm font-semibold">{activeCharger.distanceFromEnd}</p>
          </div>
        </div>

        {activeCharger.amenities.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-medium text-gray-500 mb-1">AMENITIES</h3>
            <div className="flex flex-wrap gap-2">
              {activeCharger.amenities.map((amenity, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 bg-green-50/80 border border-green-100 rounded-lg p-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-medium text-green-800">Eco Rewards</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            This route earns ~{(Math.random() * 5 + 5).toFixed(1)} carbon credits
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
          <button className="text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
            More details →
          </button>
        </div>
      </div>
    </div>
  </InfoWindow>
)}

        {start && endLoc && (
          <>
            <DirectionsService
              options={{
                origin: start,
                destination: endLoc,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />
            {directions && (
              <DirectionsRenderer
                options={{
                  directions,
                  suppressMarkers: true,
                  preserveViewport: true,
                  polylineOptions: {
                    strokeColor: '#16FFBD',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                  },
                }}
              />
            )}
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default TripPlanner; */
/* import React, { useEffect, useState, useCallback } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  DirectionsService,
  InfoWindow
} from '@react-google-maps/api';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { MapPin, Route, Star, Zap, BatteryCharging } from 'lucide-react';

const API_KEY = 'AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg';
const libraries: ('places')[] = ['places'];

type Coord = { lat: number; lng: number };
type Charger = {
  id: string;
  name: string;
  location: Coord;
  type: 'fast' | 'standard' | 'tesla';
  rating: number;
  reviews: number;
  amenities: string[];
  distanceFromStart: string;
  distanceFromEnd: string;
  carbonCredits: number;
};

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const containerStyle = {
  width: '100%',
  height: '500px',
};

const calculateDistance = (coord1: Coord, coord2: Coord): string => {
  const R = 6371;
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
    Math.cos(coord2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance < 1 
    ? `${(distance * 1000).toFixed(0)} meters` 
    : `${distance.toFixed(1)} km`;
};

const generateRandomRating = () => (Math.random() * 1 + 4).toFixed(1);
const generateRandomReviews = () => Math.floor(Math.random() * 500) + 50;

const locationNames = [
  "Electra Power Hub", "Volt Vista Station", "Spark Charge Point",
  "Quantum Charging", "Nexus Energy Stop", "Pulse Power Plaza",
  "Infinity Charge Zone", "Eon Refuel Center", "Amped Up Charging",
  "Current Junction", "MegaWatt Oasis", "Juice Box Central",
  "Power Surge Depot", "Electron Express", "Charge & Go Lounge"
];

const TripPlanner: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const [start, setStart] = useState<Coord | null>(null);
  const [endAddr, setEndAddr] = useState('');
  const [endLoc, setEndLoc] = useState<Coord | null>(null);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<Coord>({ lat: 20.5937, lng: 78.9629 });
  const [zoom, setZoom] = useState<number>(5);
  const [activeCharger, setActiveCharger] = useState<Charger | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setStart(coords);
        setCenter(coords);
        setZoom(12);
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  }, []);

  const planRoute = () => {
    if (!start || !endAddr || !window.google || !mapRef) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: endAddr }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const loc = results[0].geometry.location.toJSON();
        setEndLoc(loc);
        generateChargerClusters(start, loc);
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  };

  const generateChargerClusters = (start: Coord, end: Coord) => {
    const clusters: Charger[] = [];
    const chargerTypes = ['fast', 'standard', 'tesla'];
    const amenitiesOptions = ['Cafe', 'Restroom', 'WiFi', 'Shopping', 'Parking', 'Restaurant'];
    const usedNames = new Set<string>();
    
    const chargerCount = 9 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < chargerCount; i++) {
      const fraction = 0.1 + (Math.random() * 0.8);
      const baseLat = start.lat + (end.lat - start.lat) * fraction;
      const baseLng = start.lng + (end.lng - start.lng) * fraction;
      
      const lat = baseLat + (Math.random() - 0.5) * 0.03;
      const lng = baseLng + (Math.random() - 0.5) * 0.03;
      
      const type = chargerTypes[Math.floor(Math.random() * chargerTypes.length)] as 'fast' | 'standard' | 'tesla';
      const amenities = [];
      for (let j = 0; j < 3; j++) {
        amenities.push(amenitiesOptions[Math.floor(Math.random() * amenitiesOptions.length)]);
      }
      
      let name;
      do {
        name = locationNames[Math.floor(Math.random() * locationNames.length)];
      } while (usedNames.has(name));
      usedNames.add(name);
      
      clusters.push({
        id: `charger-${i}-${Date.now()}`,
        name,
        location: { lat, lng },
        type,
        rating: parseFloat(generateRandomRating()),
        reviews: generateRandomReviews(),
        amenities: [...new Set(amenities)],
        distanceFromStart: calculateDistance(start, { lat, lng }),
        distanceFromEnd: calculateDistance(end, { lat, lng }),
        carbonCredits: parseFloat((Math.random() * 5 + 5).toFixed(1))
      });
    }
    
    setChargers(clusters);
  };

  const directionsCallback = useCallback(
    (res: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
      if (status === 'OK' && res) {
        setDirections(res);
      } else {
        console.error('Directions request failed:', status);
      }
    },
    []
  );

  if (!isLoaded) return <div className="text-white p-10">Loading map...</div>;

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <GlassCard className="p-6 mb-6">
        <div className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-[#16FFBD]" />
            <input
              type="text"
              placeholder="Enter destination"
              value={endAddr}
              onChange={(e) => setEndAddr(e.target.value)}
              className="pl-10 pr-4 py-3 w-full bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#FF6EC7] focus:outline-none"
            />
          </div>
          <NeonButton onClick={planRoute} disabled={!start || !endAddr}>
            <Route className="w-4 h-4 mr-2" />
            Plan Trip
          </NeonButton>
        </div>
      </GlassCard>

      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={zoom}
        center={center}
        onLoad={(map) => setMapRef(map)}
        options={{
          styles: darkMapStyles,
          zoomControl: true,
          scrollwheel: true,
          gestureHandling: 'greedy',
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {start && <Marker position={start} label="Start" />}
        {endLoc && <Marker position={endLoc} label="End" />}

        {chargers.map((charger) => (
          <Marker
            key={charger.id}
            position={charger.location}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#00FFFF',
              fillOpacity: 0.9,
              strokeColor: '#00FFFF',
              strokeWeight: 0,
              scale: 8,
              anchor: new google.maps.Point(0, 0),
              
            }}
            onClick={() => setActiveCharger(charger)}
          />
        ))}

        {activeCharger && (
          <InfoWindow
            position={activeCharger.location}
            onCloseClick={() => setActiveCharger(null)}
          >
            <div className="text-gray-800 w-64 bg-gradient-to-br from-cyan-50 to-blue-100 p-4 rounded-xl shadow-2xl border border-cyan-200 relative">
              <button 
                onClick={() => setActiveCharger(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="pr-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {activeCharger.type === 'tesla' ? (
                      <div className="bg-red-100 p-2 rounded-full">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 5.362l5.878 5.878-1.414 1.414L12 8.19l-4.464 4.464-1.414-1.414L12 5.362zM12 16.638l-5.878-5.878 1.414-1.414L12 13.81l4.464-4.464 1.414 1.414L12 16.638z"/>
                        </svg>
                      </div>
                    ) : activeCharger.type === 'fast' ? (
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Zap className="w-6 h-6 text-yellow-600" fill="currentColor" />
                      </div>
                    ) : (
                      <div className="bg-blue-100 p-2 rounded-full">
                        <BatteryCharging className="w-6 h-6 text-blue-600" fill="currentColor" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">{activeCharger.name}</h2>
                    <div className="flex items-center mt-1">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(activeCharger.rating) ? 'fill-current' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs ml-1 text-gray-600">
                        {activeCharger.rating} ({activeCharger.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">From start</p>
                    <p className="text-sm font-semibold">{activeCharger.distanceFromStart}</p>
                  </div>
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">To destination</p>
                    <p className="text-sm font-semibold">{activeCharger.distanceFromEnd}</p>
                  </div>
                </div>

                {activeCharger.amenities.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-xs font-medium text-gray-500 mb-1">AMENITIES</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeCharger.amenities.map((amenity, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 bg-green-50/80 border border-green-100 rounded-lg p-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium text-green-800">Eco Rewards</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    This route earns ~{activeCharger.carbonCredits} carbon credits
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                  <button className="text-xs font-medium text-cyan-600 hover:text-cyan-700 transition-colors">
                    More details →
                  </button>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}

        {start && endLoc && (
          <>
            <DirectionsService
              options={{
                origin: start,
                destination: endLoc,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />
            {directions && (
              <DirectionsRenderer
                options={{
                  directions,
                  suppressMarkers: true,
                  preserveViewport: true,
                  polylineOptions: {
                    strokeColor: '#16FFBD',
                    strokeOpacity: 0.8,
                    strokeWeight: 4,
                  },
                }}
              />
            )}
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default TripPlanner; */
// frontend/src/components/EVStationFinder.tsx
/* import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

interface Coordinates {
  lat: number;
  lng: number;
}

interface Station {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface RouteResponse {
  stations: Station[];
  polyline: [number, number][];
  recommended_stations: Station[];
  stops_required: number;
  total_route_distance_km: number;
  error?: string;
}

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 11.004555,
  lng: 76.961632
};

const EVStationFinder = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [recommendedStations, setRecommendedStations] = useState<Station[]>([]);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentRange, setCurrentRange] = useState(50);
  const [maxRange, setMaxRange] = useState(450);
  const [stopsRequired, setStopsRequired] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Google Maps script only once
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD1xsbZ9KAwL1C_raDI_Yb1WYAi1iilTWw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    if (!origin) {
      setOrigin(clickedLocation);
    } else if (!destination) {
      setDestination(clickedLocation);
    } else {
      clearAllMarkersAndState();
      setOrigin(clickedLocation);
    }
  }, [origin, destination]);

  const clearAllMarkersAndState = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setStations([]);
    setRecommendedStations([]);
    setRoutePolyline([]);
    setStopsRequired(0);
    setTotalDistance(0);
    setError('');
  }, []);

  const findStations = useCallback(async () => {
    if (!origin || !destination) {
      setError('Please select both origin and destination on the map.');
      return;
    }

    setLoading(true);
    setError('');
    setStations([]);
    setRecommendedStations([]);
    setRoutePolyline([]);

    try {
      const response = await fetch('http://localhost:5501/find_ev_stations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          current_range_km: currentRange,
          max_range_km: maxRange
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data: RouteResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setStations(data.stations || []);
      setRecommendedStations(data.recommended_stations || []);
      setRoutePolyline(data.polyline || []);
      setStopsRequired(data.stops_required || 0);
      setTotalDistance(data.total_route_distance_km || 0);

      if (data.polyline && data.polyline.length > 0 && map) {
        const bounds = new window.google.maps.LatLngBounds();
        data.polyline.forEach(point => bounds.extend({ lat: point[0], lng: point[1] }));
        map.fitBounds(bounds);
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching charging stations.');
    } finally {
      setLoading(false);
    }
  }, [origin, destination, currentRange, maxRange, map]);

  if (!scriptLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>EV Charging Station Finder</h1>
      
      <div style={styles.controls}>
        <p>Click on the map to select Origin and Destination.</p>
        <p>Origin: {origin ? `${origin.lat.toFixed(4)}, ${origin.lng.toFixed(4)}` : 'Not set'}</p>
        <p>Destination: {destination ? `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}` : 'Not set'}</p>
        
        <div style={styles.rangeInputs}>
          <label style={styles.rangeLabel}>
            Current Range (km):
            <input 
              type="number" 
              value={currentRange} 
              onChange={(e) => setCurrentRange(Number(e.target.value))} 
              min="1"
              style={styles.input}
            />
          </label>
          <label style={styles.rangeLabel}>
            Max Range (km):
            <input 
              type="number" 
              value={maxRange} 
              onChange={(e) => setMaxRange(Number(e.target.value))} 
              min="1"
              style={styles.input}
            />
          </label>
        </div>
        
        <button 
          onClick={findStations} 
          disabled={loading || !origin || !destination}
          style={styles.button}
        >
          {loading ? 'Loading...' : 'Find Stations'}
        </button>
        <button 
          onClick={clearAllMarkersAndState} 
          disabled={loading}
          style={styles.button}
        >
          Reset Map
        </button>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        {loading && <div style={styles.loading}>Loading route and charging stations...</div>}
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={8}
        onClick={handleMapClick}
        onLoad={(map) => setMap(map)}
      >
        {origin && (
          <Marker
            position={origin}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            }}
          />
        )}

        {destination && (
          <Marker
            position={destination}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }}
          />
        )}

        {routePolyline.length > 0 && (
          <Polyline
            path={routePolyline.map(p => ({ lat: p[0], lng: p[1] }))}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}

        {stations.map((station) => (
          <Marker
            key={`station-${station.place_id}`}
            position={{
              lat: station.geometry.location.lat,
              lng: station.geometry.location.lng
            }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />
        ))}

        {recommendedStations.map((station) => (
          <Marker
            key={`recommended-${station.place_id}`}
            position={{
              lat: station.geometry.location.lat,
              lng: station.geometry.location.lng
            }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
            }}
          />
        ))}
      </GoogleMap>

      <div style={styles.results}>
        <h2>Charging Stations Along Route:</h2>
        <ul style={styles.stationList}>
          {stations.length > 0 ? (
            stations.map(station => (
              <li key={`station-list-${station.place_id}`} style={styles.stationItem}>
                <strong>{station.name || 'Unnamed Station'}</strong><br />
                {station.vicinity || 'Address not available'}<br />
                Rating: {station.rating || 'Not rated'}
              </li>
            ))
          ) : (
            <li style={styles.stationItem}>No charging stations found along the route.</li>
          )}
        </ul>

        <h2>Recommended Stops:</h2>
        <ul style={styles.recommendedList}>
          {stopsRequired > 0 && (
            <li style={styles.recommendedItem}><strong>Minimum stops required: {stopsRequired}</strong></li>
          )}
          {recommendedStations.length > 0 ? (
            recommendedStations.map((station, index) => (
              <li key={`recommended-list-${station.place_id}`} style={styles.recommendedItem}>
                <strong>Stop {index + 1}: {station.name || 'Unnamed Station'}</strong><br />
                {station.vicinity || 'Address not available'}<br />
                Rating: {station.rating || 'Not rated'}
              </li>
            ))
          ) : (
            <li style={styles.recommendedItem}>No specific recommendations. Either direct path is possible or no suitable stops found.</li>
          )}
        </ul>

        {totalDistance > 0 && (
          <p>Total route distance: {totalDistance.toFixed(1)} km</p>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    marginBottom: '20px'
  },
  controls: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px'
  },
  rangeInputs: {
    margin: '15px 0',
    display: 'flex',
    gap: '20px'
  },
  rangeLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  input: {
    padding: '5px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '8px 15px',
    marginRight: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  errorMessage: {
    color: '#d32f2f',
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#ffebee',
    borderRadius: '4px'
  },
  loading: {
    color: '#1976d2',
    margin: '10px 0',
    fontWeight: 'bold'
  },
  results: {
    marginTop: '20px'
  },
  stationList: {
    listStyleType: 'none',
    padding: '0'
  },
  recommendedList: {
    listStyleType: 'none',
    padding: '0'
  },
  stationItem: {
    padding: '12px',
    margin: '8px 0',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px'
  },
  recommendedItem: {
    padding: '12px',
    margin: '8px 0',
    backgroundColor: '#fffde7',
    borderRadius: '6px'
  }
};

export default EVStationFinder; */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MapPin,
  BatteryCharging,
  Zap,
  Star,
  Route,
  LocateFixed,
  Car,
  Info,
  Search,
  ChevronRight,
  Locate,
  Plug,
  Battery,
  CarFront,
} from 'lucide-react';

// --- GlassCard Component ---
interface GlassCardProps extends React.PropsWithChildren<{}> {
  className?: string;
  hoverable?: boolean;
  glowColor?: 'mint' | 'pink' | 'yellow' | 'blue';
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverable = false, glowColor = '', onClick }) => {
  const hoverStyles = hoverable ? 'hover:scale-[1.02] transition-transform duration-200 cursor-pointer' : '';
  let glowClassName = '';
  if (glowColor) {
    switch (glowColor) {
      case 'mint': glowClassName = 'glow-mint'; break;
      case 'pink': glowClassName = 'glow-rose'; break;
      case 'yellow': glowClassName = 'glow-amber'; break;
      case 'blue': glowClassName = 'shadow-[0_0_15px_-5px_rgba(59,130,246,0.5)]'; break;
    }
  }

  return (
    <div
      className={`glass-effect rounded-2xl shadow-lg shadow-black/30 ${className} ${hoverStyles} ${glowClassName}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// --- EV Database ---
const EV_DATABASE = [
  { make: "Tata", model: "Nexon EV", range: 312, connectors: ["CCS2", "Type2"] },
  { make: "Hyundai", model: "Kona Electric", range: 452, connectors: ["CCS2"] },
  { make: "MG", model: "ZS EV", range: 419, connectors: ["CCS2", "Type2"] },
  { make: "Mahindra", model: "XUV400", range: 375, connectors: ["CCS2"] },
  { make: "BYD", model: "Atto 3", range: 521, connectors: ["CCS2"] },
  { make: "Kia", model: "EV6", range: 528, connectors: ["CCS2"] }
];

interface Coordinates {
  lat: number;
  lng: number;
}

interface Station {
  place_id: string;
  name: string;
  vicinity?: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  connectors?: string[];
  power_kw?: number;
  isOCM?: boolean;
}

interface RouteResponse {
  stations: Station[];
  polyline: [number, number][];
  recommended_stations: Station[];
  stops_required: number;
  total_route_distance_km: number;
  waypoints?: Array<{ location: [number, number]; stations: Station[] }>;
  error?: string;
  status?: string;
}

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '600px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
};

const center = {
  lat: 11.004555,
  lng: 76.961632
};

const loadingMessages = [
  "Calculating the optimal route for your journey...",
  "Searching for available charging stations along your path...",
  "Analyzing battery range and recommending strategic stops...",
  "Gathering real-time station availability and pricing information...",
  "Almost there! Just a few more seconds to plan your perfect EV trip."
];

const EVStationFinder = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [origin, setOrigin] = useState<Coordinates | null>(null);
  const [destination, setDestination] = useState<Coordinates | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [recommendedStations, setRecommendedStations] = useState<Station[]>([]);
  const [routePolyline, setRoutePolyline] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentRange, setCurrentRange] = useState(50);
  const [maxRange, setMaxRange] = useState(450);
  const [stopsRequired, setStopsRequired] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [currentLoadingMessageIndex, setCurrentLoadingMessageIndex] = useState(0);
  const [originAddress, setOriginAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [locationError, setLocationError] = useState<string>('');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [selectedEV, setSelectedEV] = useState<string>('');
  const [batteryPercentage, setBatteryPercentage] = useState<number>(80);
  const [useOCM, setUseOCM] = useState<boolean>(false);
  const [waypoints, setWaypoints] = useState<Array<{location: [number, number], stations: Station[]}>>([]);
  
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD1xsbZ9KAwL1C_raDI_Yb1WYAi1iilTWw&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (scriptLoaded && originInputRef.current && destinationInputRef.current) {
      originAutocompleteRef.current = new window.google.maps.places.Autocomplete(
        originInputRef.current,
        { types: ['geocode'] }
      );
      originAutocompleteRef.current.addListener('place_changed', () => {
        const place = originAutocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          setOrigin({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
          setOriginAddress(place.formatted_address || '');
        }
      });

      destinationAutocompleteRef.current = new window.google.maps.places.Autocomplete(
        destinationInputRef.current,
        { types: ['geocode'] }
      );
      destinationAutocompleteRef.current.addListener('place_changed', () => {
        const place = destinationAutocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
          setDestination({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
          setDestinationAddress(place.formatted_address || '');
        }
      });
    }
  }, [scriptLoaded]);

  // Get current location
  useEffect(() => {
    if (scriptLoaded) {
      getCurrentLocation();
    }
  }, [scriptLoaded]);

  // Loading message cycling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setCurrentLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Update range when EV or battery percentage changes
  useEffect(() => {
    if (selectedEV) {
      const ev = EV_DATABASE.find(ev => `${ev.make} ${ev.model}` === selectedEV);
      if (ev) {
        const SAFETY_BUFFER_PERCENT = 20;
        const usablePercent = Math.max(0, batteryPercentage - SAFETY_BUFFER_PERCENT);
        setCurrentRange(Math.floor((usablePercent / 100) * ev.range));
        setMaxRange(ev.range);
      }
    }
  }, [selectedEV, batteryPercentage]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGeolocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setOrigin(userLocation);
        
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: userLocation }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setOriginAddress(results[0].formatted_address);
            if (originInputRef.current) {
              originInputRef.current.value = results[0].formatted_address;
            }
          }
        });
        
        setIsGeolocating(false);
        
        if (map) {
          map.panTo(userLocation);
          map.setZoom(14);
        }
      },
      (error) => {
        setLocationError('Unable to retrieve your location: ' + error.message);
        setIsGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearAllMarkersAndState = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setStations([]);
    setRecommendedStations([]);
    setRoutePolyline([]);
    setStopsRequired(0);
    setTotalDistance(0);
    setError('');
    setOriginAddress('');
    setDestinationAddress('');
    setWaypoints([]);
    if (originInputRef.current) originInputRef.current.value = '';
    if (destinationInputRef.current) destinationInputRef.current.value = '';
  }, []);

  const findStations = useCallback(async () => {
    if (!origin || !destination) {
      setError('Please select both origin and destination');
      return;
    }

    setLoading(true);
    setError('');
    setStations([]);
    setRecommendedStations([]);
    setRoutePolyline([]);
    setWaypoints([]);
    setCurrentLoadingMessageIndex(0);

    try {
      const response = await fetch('http://localhost:5501/find_ev_stations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          current_range_km: currentRange,
          max_range_km: maxRange,
          use_ocm: useOCM
        }),
      });

      const data: RouteResponse = await response.json();

      if (!response.ok || data.status === 'error') {
        throw new Error(data.error || `Server returned ${response.status}`);
      }

      // Filter out stations with invalid locations
      const validStations = (data.stations || []).filter(
        station => station.geometry?.location?.lat && station.geometry?.location?.lng
      );
      
      const validRecommended = (data.recommended_stations || []).filter(
        station => station.geometry?.location?.lat && station.geometry?.location?.lng
      );

      setStations(validStations);
      setRecommendedStations(validRecommended);
      setRoutePolyline(data.polyline || []);
      setStopsRequired(data.stops_required || 0);
      setTotalDistance(data.total_route_distance_km || 0);
      setWaypoints(Array.isArray(data.waypoints) ? data.waypoints : []);

      if (data.polyline && data.polyline.length > 0 && map) {
        const bounds = new window.google.maps.LatLngBounds();
        data.polyline.forEach(point => bounds.extend({ lat: point[0], lng: point[1] }));
        map.fitBounds(bounds);
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching charging stations.');
    } finally {
      setLoading(false);
    }
  }, [origin, destination, currentRange, maxRange, map, useOCM]);

  if (!scriptLoaded) {
    return <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center text-xl">Loading Google Maps...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white py-8 flex flex-col items-center">
      <div className="container-responsive px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">EV Charging Station Finder</h1>

        <GlassCard className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">Starting Point</label>
              <div className="relative">
                <input
                  ref={originInputRef}
                  type="text"
                  placeholder="Enter starting location"
                  className="w-full p-3 pl-10 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#16FFBD]"
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-white/50" />
                <button
                  onClick={getCurrentLocation}
                  disabled={isGeolocating}
                  className="absolute right-3 top-3 text-white/70 hover:text-white transition-colors"
                  title="Use current location"
                >
                  {isGeolocating ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-transparent rounded-full"></div>
                  ) : (
                    <Locate className="w-4 h-4" />
                  )}
                </button>
              </div>
              {locationError && (
                <p className="text-red-400 text-xs mt-1">{locationError}</p>
              )}
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Destination</label>
              <div className="relative">
                <input
                  ref={destinationInputRef}
                  type="text"
                  placeholder="Enter destination"
                  className="w-full p-3 pl-10 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6EC7]"
                />
                <Search className="absolute left-3 top-3.5 w-4 h-4 text-white/50" />
              </div>
            </div>
          </div>

          {/* EV Selection Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-white/70 text-sm mb-2">EV Model</label>
              <select
                value={selectedEV}
                onChange={(e) => setSelectedEV(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#16FFBD]"
              >
                <option value="">Select your EV</option>
                {EV_DATABASE.map((ev) => (
                  <option key={`${ev.make}-${ev.model}`} value={`${ev.make} ${ev.model}`}>
                    {ev.make} {ev.model} ({ev.range}km)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-2">Battery Level</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={batteryPercentage}
                  onChange={(e) => setBatteryPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-white/80 w-12 text-right">{batteryPercentage}%</span>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setUseOCM(!useOCM)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${useOCM ? 'bg-[#16FFBD]/20 text-[#16FFBD] border border-[#16FFBD]/30' : 'bg-white/5 hover:bg-white/10'}`}
              >
                <Plug className="w-4 h-4" />
                <span>Use OpenChargeMap</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label className="flex items-center space-x-2 text-white/80">
              <Battery className="w-5 h-5 text-[#FCEE09]" />
              <span>Current Range (km):</span>
                            <input
                type="number"
                value={currentRange}
                onChange={(e) => setCurrentRange(Number(e.target.value))}
                min="1"
                className="ml-auto p-2 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#16FFBD] w-24"
              />
            </label>
            <label className="flex items-center space-x-2 text-white/80">
              <CarFront className="w-5 h-5 text-[#FCEE09]" />
              <span>Max Range (km):</span>
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(Number(e.target.value))}
                min="1"
                className="ml-auto p-2 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#FF6EC7] w-24"
              />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={findStations}
              disabled={loading || !origin || !destination}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ripple
                ${loading || !origin || !destination
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#16FFBD] to-[#2563EB] text-white hover:from-[#16FFBD] hover:to-[#16FFBD] hover:shadow-[0_0_20px_rgba(22,255,189,0.7)]'
                }`}
            >
              <Route className="w-5 h-5" />
              <span>{loading ? 'Calculating...' : 'Find Stations'}</span>
            </button>
            <button
              onClick={clearAllMarkersAndState}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ripple
                ${loading
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10'
                }`}
            >
              <LocateFixed className="w-5 h-5" />
              <span>Reset Map</span>
            </button>
          </div>

<AnimatePresence>
  {loading && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-8 shadow-lg"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="h-full bg-gradient-to-r from-[#16FFBD] via-[#2563EB] to-[#FF6EC7] absolute top-0 left-0"
      />
      <motion.div
        key={currentLoadingMessageIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm text-center px-4"
      >
        {loadingMessages[currentLoadingMessageIndex]}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
        </GlassCard>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-10 bg-white/10 rounded-full overflow-hidden mb-8 shadow-lg flex items-center justify-center animate-gradient" 
            >
              <div
                className="h-full bg-gradient-to-r from-[#16FFBD] to-[#FF6EC7] absolute top-0 left-0"
                style={{ width: '100%' }}
              ></div>
              <motion.div
                key={currentLoadingMessageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm text-center px-4"
              >
                {loadingMessages[currentLoadingMessageIndex]}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={8}
          onLoad={(map) => setMap(map)}
          options={{
            styles: [
              { elementType: "geometry", stylers: [{ color: "#212121" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                  { color: "#38414e" },
                  { visibility: "on" }
                ]
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [
                  { color: "#212a37" },
                  { visibility: "on" }
                ]
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [
                  { color: "#9ca5b3" },
                  { visibility: "on" }
                ]
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }]
              }
            ],
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
          }}
        >
          {/* Origin Marker */}
          {origin && (
            <Marker
              position={origin}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
              }}
            />
          )}

          {/* Destination Marker */}
          {destination && (
            <Marker
              position={destination}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              }}
            />
          )}

          {/* Route Polyline */}
          {routePolyline.length > 0 && (
            <Polyline
              path={routePolyline.map(p => ({ lat: p[0], lng: p[1] }))}
              options={{
                strokeColor: "#FF6EC7",
                strokeOpacity: 0.8,
                strokeWeight: 5,
              }}
            />
          )}

          {/* Waypoint Markers */}
          {waypoints && waypoints.length > 0 && waypoints.map((waypoint, index) => {
            if (!waypoint || !waypoint.location) return null;
            return (
              <Marker
                key={`waypoint-${index}`}
                position={{ lat: waypoint.location[0], lng: waypoint.location[1] }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30)
                }}
              />
            );
          })}

          {/* All Stations */}
          {stations?.length > 0 && stations.map((station) => (
            <Marker
              key={`station-${station.place_id}`}
              position={{
                lat: station.geometry.location.lat,
                lng: station.geometry.location.lng
              }}
              icon={{
                url: station.isOCM 
                  ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          ))}

          {/* Recommended Stations */}
          {recommendedStations?.length > 0 && recommendedStations.map((station) => (
            <Marker
              key={`recommended-${station.place_id}`}
              position={{
                lat: station.geometry.location.lat,
                lng: station.geometry.location.lng
              }}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />
          ))}
        </GoogleMap>

        {(stations.length > 0 || recommendedStations.length > 0 || totalDistance > 0) && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center space-x-2">
                <Zap className="w-6 h-6 text-[#16FFBD]" />
                <span>Stations Along Route</span>
                {useOCM && (
                  <span className="text-xs bg-[#16FFBD]/20 text-[#16FFBD] px-2 py-1 rounded-full ml-2">
                    OpenChargeMap
                  </span>
                )}
              </h2>
              <ul className="list-none p-0 max-h-60 overflow-y-auto custom-scrollbar">
                {stations?.length > 0 ? (
                  stations.map(station => (
                    <li key={`station-list-${station.place_id}`} className="p-4 mb-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-lg text-[#16FFBD]">{station.name || 'Unnamed Station'}</strong>
                          {station.isOCM && (
                            <span className="text-xs bg-[#16FFBD]/20 text-[#16FFBD] px-2 py-0.5 rounded-full ml-2">
                              OCM
                            </span>
                          )}
                        </div>
                        {station.power_kw && (
                          <span className="text-xs bg-[#FCEE09]/20 text-[#FCEE09] px-2 py-0.5 rounded-full">
                            {station.power_kw}kW
                          </span>
                        )}
                      </div>
                      <span className="text-white/70 text-sm flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{station.vicinity || 'Address not available'}</span>
                      </span>
                      <div className="flex justify-between mt-2">
                        <span className="text-white/60 text-xs flex items-center space-x-1">
                          <Star className="w-4 h-4 text-[#FCEE09]" />
                          <span>Rating: {station.rating ? `${station.rating.toFixed(1)} / 5` : 'Not rated'}</span>
                        </span>
                        {station.connectors && (
                          <span className="text-xs text-white/50">
                            {station.connectors.join(', ')}
                          </span>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-white/60 p-4">No charging stations found along the route.</li>
                )}
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white flex items-center space-x-2">
                <Zap className="w-6 h-6 text-[#FF6EC7]" />
                <span>Recommended Stops</span>
              </h2>
              <ul className="list-none p-0 max-h-60 overflow-y-auto custom-scrollbar">
                {stopsRequired > 0 && (
                  <li className="p-4 mb-3 bg-white/10 rounded-lg border border-white/15 text-white font-bold flex items-center space-x-2">
                    <Info className="w-5 h-5 text-[#FCEE09]" />
                    <span>Minimum stops required: <span className="text-[#FCEE09]">{stopsRequired}</span></span>
                  </li>
                )}
                {recommendedStations?.length > 0 ? (
                  recommendedStations.map((station, index) => (
                    <li key={`recommended-list-${station.place_id}`} className="p-4 mb-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start">
                        <strong className="text-lg text-[#FF6EC7]">Stop {index + 1}: {station.name || 'Unnamed Station'}</strong>
                        {station.power_kw && (
                          <span className="text-xs bg-[#FCEE09]/20 text-[#FCEE09] px-2 py-0.5 rounded-full">
                            {station.power_kw}kW
                          </span>
                        )}
                      </div>
                      <span className="text-white/70 text-sm flex items-center space-x-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{station.vicinity || 'Address not available'}</span>
                      </span>
                      <div className="flex justify-between mt-2">
                        <span className="text-white/60 text-xs flex items-center space-x-1">
                          <Star className="w-4 h-4 text-[#FCEE09]" />
                          <span>Rating: {station.rating ? `${station.rating.toFixed(1)} / 5` : 'Not rated'}</span>
                        </span>
                        {station.connectors && (
                          <span className="text-xs text-white/50">
                            {station.connectors.join(', ')}
                          </span>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-white/60 p-4">No specific recommendations. Either a direct path is possible or no suitable stops were found.</li>
                )}
              </ul>
              {totalDistance > 0 && (
                <p className="mt-4 text-white/80 text-lg text-center flex items-center justify-center space-x-2">
                  <Route className="w-5 h-5 text-[#16FFBD]" />
                  <span>Total route distance: <span className="font-bold text-[#FCEE09]">{totalDistance.toFixed(1)} km</span></span>
                </p>
              )}
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EVStationFinder;