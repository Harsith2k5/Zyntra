/* import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Plug, 
  Navigation,
  Filter,
  MoreHorizontal,
  X
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockStations } from '../data/mockData';

const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSolarOnly, setShowSolarOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();

  const selectedStationData = mockStations.find(station => station.id === selectedStation);

  const getPinColor = (station: any) => {
    if (station.isAIPick) return 'bg-[#16FFBD] shadow-[0_0_20px_rgba(22,255,189,0.6)]';
    if (station.congestionLevel === 'high') return 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]';
    if (station.congestionLevel === 'medium') return 'bg-[#FCEE09] shadow-[0_0_20px_rgba(252,238,9,0.6)]';
    return 'bg-[#16FFBD] shadow-[0_0_20px_rgba(22,255,189,0.6)]';
  };

  const filteredStations = mockStations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!showSolarOnly || station.solarPowered)
  );

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20">
      <div className="sticky top-16 z-20 bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="container-responsive">
          <div className="flex items-center space-x-4">
            
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                placeholder="Search stations..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                  ${showHeatmap ? 'bg-[#16FFBD] border-[#16FFBD]' : 'bg-white/10 border-white/20'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                    ${showHeatmap ? 'left-6' : 'left-0.5'}
                  `} />
                </div>
                <span className="text-white/80 text-sm">Heatmap</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSolarOnly}
                  onChange={(e) => setShowSolarOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`
                  w-12 h-6 rounded-full border-2 transition-all duration-200 relative
                  ${showSolarOnly ? 'bg-[#FCEE09] border-[#FCEE09]' : 'bg-white/10 border-white/20'}
                `}>
                  <div className={`
                    w-4 h-4 rounded-full bg-white transition-all duration-200 absolute top-0.5
                    ${showSolarOnly ? 'left-6' : 'left-0.5'}
                  `} />
                </div>
                <span className="text-white/80 text-sm">Solar Only</span>
              </label>

              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Filter className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-[60vh] bg-gradient-to-br from-[#16FFBD]/5 to-[#FF6EC7]/5">
        
        <div className="absolute inset-0">
          {filteredStations.map((station, index) => (
            <motion.button
              key={station.id}
              className={`
                absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10
                ${getPinColor(station)}
                ${selectedStation === station.id ? 'scale-150' : 'scale-100'}
              `}
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 3) * 20}%`
              }}
              onClick={() => setSelectedStation(station.id)}
              animate={{
                scale: selectedStation === station.id ? 1.5 : 1,
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                scale: { duration: 0.2 },
                opacity: { duration: 2, repeat: Infinity }
              }}
            />
          ))}
        </div>

        {showHeatmap && (
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-[#FCEE09]/20 to-[#16FFBD]/20 pointer-events-none" />
        )}
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="relative"
      >
        <GlassCard className="rounded-t-3xl rounded-b-none min-h-[40vh] p-6">
          {selectedStationData ? (
            <div className="space-y-6">

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-white font-semibold text-xl">
                      {selectedStationData.name}
                    </h3>
                    {selectedStationData.isAIPick && (
                      <span className="px-2 py-1 bg-[#16FFBD]/20 text-[#16FFBD] rounded-full text-xs font-medium">
                        AI Pick
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 mb-3">
                    {selectedStationData.location.address}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">
                        {selectedStationData.distance} km
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">
                        {selectedStationData.waitTime} min wait
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-[#FCEE09]" />
                      <span className="text-white/60 text-sm">
                        {selectedStationData.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStation(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              <div className="flex space-x-3 overflow-x-auto">
                {selectedStationData.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${selectedStationData.name} - ${index + 1}`}
                    className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
                  />
                ))}
              </div>

              <div className="flex space-x-4">
                <NeonButton
                  variant="secondary"
                  onClick={() => {}}
                  className="flex-1"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigate
                </NeonButton>
                <NeonButton
                  onClick={() => navigate(`/booking/${selectedStationData.id}`)}
                  className="flex-1"
                >
                  Book Slot
                </NeonButton>
                <button
                  onClick={() => setActiveTab('details')}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex space-x-6 mb-4">
                  {['details', 'reviews', 'operator'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        pb-2 border-b-2 transition-colors capitalize
                        ${activeTab === tab 
                          ? 'border-[#16FFBD] text-[#16FFBD]' 
                          : 'border-transparent text-white/60 hover:text-white'
                        }
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {activeTab === 'details' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Pricing</span>
                        <span className="text-white font-medium">
                          ₹{selectedStationData.pricing}/kWh
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Plug Types</span>
                        <div className="flex items-center space-x-2">
                          {selectedStationData.plugTypes.map((type, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white/10 rounded-full text-xs text-white"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Amenities</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedStationData.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-white/10 rounded-full text-xs text-white"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-4">
                      {selectedStationData.reviews.map((review) => (
                        <div key={review.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{review.user}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-[#FCEE09]" />
                              <span className="text-white/60 text-sm">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-white/60 text-sm">{review.comment}</p>
                          <span className="text-white/40 text-xs">{review.date}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'operator' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Operator</span>
                        <span className="text-white font-medium">EcoCharge Network</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Support</span>
                        <span className="text-white font-medium">24/7 Available</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Established</span>
                        <span className="text-white font-medium">2020</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">
                Discover Charging Stations
              </h3>
              <p className="text-white/60">
                Tap on any pin to view station details and book your slot
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Discover; */
/* import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Star,
  Plug,
  Navigation,
  Filter,
  MoreHorizontal,
  X,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockStations } from '../data/mockData';

const mapContainerStyle = {
  width: '100%',
  height: '60vh',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSolarOnly, setShowSolarOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg', // Replace this
    libraries: ['places'],
  });

  const selectedStationData = mockStations.find((s) => s.id === selectedStation);

  const filteredStations = mockStations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showSolarOnly || s.solarPowered)
  );

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#EF4444'; // red
      case 'medium':
        return '#FCEE09'; // yellow
      default:
        return '#16FFBD'; // green
    }
  };

  const createCircleSymbol = (color: string): google.maps.Symbol => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    scale: 8,
    strokeColor: '#ffffff',
    strokeWeight: 1.5,
  });

  if (!isLoaded) {
    return <div className="text-white text-center mt-32">Loading map...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20">
    
      <div className="sticky top-16 z-20 bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="container-responsive">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                placeholder="Search stations..."
              />
            </div>

            <div className="flex items-center space-x-4">

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full border-2 transition-all relative ${
                  showHeatmap ? 'bg-[#16FFBD] border-[#16FFBD]' : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                    showHeatmap ? 'left-6' : 'left-0.5'
                  }`} />
                </div>
                <span className="text-white/80 text-sm">Heatmap</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSolarOnly}
                  onChange={(e) => setShowSolarOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full border-2 transition-all relative ${
                  showSolarOnly ? 'bg-[#FCEE09] border-[#FCEE09]' : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                    showSolarOnly ? 'left-6' : 'left-0.5'
                  }`} />
                </div>
                <span className="text-white/80 text-sm">Solar Only</span>
              </label>

              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Filter className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={defaultCenter}
          options={{
            styles: showHeatmap
              ? [
                  {
                    featureType: 'all',
                    stylers: [{ saturation: -80 }],
                  },
                  {
                    featureType: 'road.arterial',
                    elementType: 'geometry',
                    stylers: [{ hue: '#00ffee' }, { saturation: 50 }],
                  },
                  {
                    featureType: 'poi.business',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }],
                  },
                ]
              : undefined,
          }}
        >
          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={{
                lat: station.location.lat,
                lng: station.location.lng,
              }}
              onClick={() => setSelectedStation(station.id)}
              icon={createCircleSymbol(getMarkerColor(station.congestionLevel))}
            />
          ))}
        </GoogleMap>
      </div>

      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="relative">
        <GlassCard className="rounded-t-3xl rounded-b-none min-h-[40vh] p-6">
          {selectedStationData ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-xl font-semibold mb-1">
                    {selectedStationData.name}
                  </h3>
                  <p className="text-white/60 mb-2">{selectedStationData.location.address}</p>
                  <div className="flex space-x-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {selectedStationData.distance} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> {selectedStationData.waitTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={16} color="#FCEE09" /> {selectedStationData.rating}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedStation(null)}>
                  <X className="text-white/60" />
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <NeonButton onClick={() => navigate(`/booking/${selectedStationData.id}`)}>
                  <Plug className="mr-2" /> Book Slot
                </NeonButton>
                <NeonButton variant="secondary" onClick={() => {}}>
                  <Navigation className="mr-2" /> Navigate
                </NeonButton>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Discover Charging Stations</h3>
              <p className="text-white/60">
                Tap on a map pin to view station details and book your slot
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Discover;
 */
/* import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Star,
  Plug,
  Navigation,
  Filter,
  X,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockStations } from '../data/mockData';

const mapContainerStyle = {
  width: '100%',
  height: '60vh',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSolarOnly, setShowSolarOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const navigate = useNavigate();

  const libraries = ['places'] as const;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg',
    libraries: libraries as any,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation(defaultCenter)
    );
  }, []);

  const selectedStationData = mockStations.find((s) => s.id === selectedStation);

  const filteredStations = mockStations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showSolarOnly || s.solarPowered)
  );

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#FCEE09';
      default:
        return '#16FFBD';
    }
  };

  const createCircleSymbol = (color: string): google.maps.Symbol => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: 1,
    scale: 8,
    strokeColor: '#ffffff',
    strokeWeight: 1.5,
  });

const [userPinSymbol, setUserPinSymbol] = useState<google.maps.Symbol | null>(null);

useEffect(() => {
  if (isLoaded && window.google) {
    setUserPinSymbol({
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: '#16FFBD',
      fillOpacity: 1,
      scale: 8,
      strokeColor: '#ffffff',
      strokeWeight: 2,
    });
  }
}, [isLoaded]);


  if (!isLoaded || !userLocation) {
    return <div className="text-white text-center mt-32">Loading map...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20">
      
      <div className="sticky top-16 z-20 bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="container-responsive">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                placeholder="Search stations..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full border-2 transition-all relative ${
                  showHeatmap ? 'bg-[#16FFBD] border-[#16FFBD]' : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                    showHeatmap ? 'left-6' : 'left-0.5'
                  }`} />
                </div>
                <span className="text-white/80 text-sm">Heatmap</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSolarOnly}
                  onChange={(e) => setShowSolarOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full border-2 transition-all relative ${
                  showSolarOnly ? 'bg-[#FCEE09] border-[#FCEE09]' : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                    showSolarOnly ? 'left-6' : 'left-0.5'
                  }`} />
                </div>
                <span className="text-white/80 text-sm">Solar Only</span>
              </label>

              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Filter className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={userLocation}
 options={{
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#000000' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#808080' }] }, // dull gray labels
    { elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }] },

    {
      featureType: 'administrative',
      elementType: 'geometry',
      stylers: [{ color: '#1f1f1f' }],
    },
    {
      featureType: 'administrative.country',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#808080' }],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ color: '#1f1f1f' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#808080' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#181818' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#2c2c2c' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#5a5a5a' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#3c3c3c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#222222' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#666666' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#0e0e0e' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#4f4f4f' }],
    },
  ],
}}




        >
          {userLocation && userPinSymbol && (
            <Marker position={userLocation} icon={userPinSymbol} />
          )}

          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={{
                lat: station.location.lat,
                lng: station.location.lng,
              }}
              onClick={() => setSelectedStation(station.id)}
              icon={createCircleSymbol(getMarkerColor(station.congestionLevel))}
            />
          ))}
        </GoogleMap>
      </div>

      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="relative">
        <GlassCard className="rounded-t-3xl rounded-b-none min-h-[40vh] p-6">
          {selectedStationData ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-xl font-semibold mb-1">
                    {selectedStationData.name}
                  </h3>
                  <p className="text-white/60 mb-2">{selectedStationData.location.address}</p>
                  <div className="flex space-x-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {selectedStationData.distance} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> {selectedStationData.waitTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={16} color="#FCEE09" /> {selectedStationData.rating}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedStation(null)}>
                  <X className="text-white/60" />
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <NeonButton onClick={() => navigate(`/booking/${selectedStationData.id}`)}>
                  <Plug className="mr-2" /> Book Slot
                </NeonButton>
                <NeonButton variant="secondary" onClick={() => {}}>
                  <Navigation className="mr-2" /> Navigate
                </NeonButton>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">
                Discover Charging Stations
              </h3>
              <p className="text-white/60">
                Tap on a map pin to view station details and book your slot
              </p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Discover; */
/* import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Clock, Star, Plug, Navigation, X,
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';
import { mockStations } from '../data/mockData';

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '60vh',
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.209,
};

const Discover: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSolarOnly, setShowSolarOnly] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [nearbyStations, setNearbyStations] = useState<google.maps.places.PlaceResult[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg', // Replace with your actual key
    libraries,
  });

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  // Get user location and nearby EV stations
  useEffect(() => {
    if (!isLoaded || !window.google?.maps?.places) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        if (mapRef.current) mapRef.current.panTo(loc);

        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        service.nearbySearch(
          {
            location: loc,
            radius: 5000,
            keyword: 'EV charging station',
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
              setNearbyStations(results);
            }
          }
        );
      },
      () => setUserLocation(defaultCenter)
    );
  }, [isLoaded]);

  // Calculate directions on station selection
  useEffect(() => {
    if (!selectedStation || !userLocation) {
      setDirections(null);
      return;
    }

    const selected = mockStations.find((s) => s.id === selectedStation);
    if (!selected) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: selected.location,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        }
      }
    );
  }, [selectedStation, userLocation]);

  const filteredStations = mockStations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!showSolarOnly || s.solarPowered)
  );

  const getMarkerColor = (level: string) => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'medium': return '#FCEE09';
      default: return '#16FFBD';
    }
  };

  const selectedStationData = mockStations.find((s) => s.id === selectedStation);

  const handleNavigate = () => {
    if (!userLocation || !selectedStationData) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: selectedStationData.location,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);
        } else {
          alert('Failed to fetch route');
        }
      }
    );
  };

  if (!isLoaded || !userLocation) {
    return <div className="text-white text-center mt-32">Loading map...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pt-20">
      
      <div className="sticky top-16 z-20 bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="container-responsive">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:border-[#16FFBD] focus:outline-none focus:ring-2 focus:ring-[#16FFBD]/20 transition-all"
                placeholder="Search stations..."
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full border-2 transition-all relative ${
                  showHeatmap ? 'bg-[#16FFBD] border-[#16FFBD]' : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                    showHeatmap ? 'left-6' : 'left-0.5'
                  }`} />
                </div>
                <span className="text-white/80 text-sm">Heatmap</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSolarOnly}
                  onChange={(e) => setShowSolarOnly(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-12 h-6 rounded-full border-2 transition-all relative ${
                  showSolarOnly ? 'bg-[#FCEE09] border-[#FCEE09]' : 'bg-white/10 border-white/20'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${
                    showSolarOnly ? 'left-6' : 'left-0.5'
                  }`} />
                </div>
                <span className="text-white/80 text-sm">Solar Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={13}
          center={userLocation}
          onLoad={handleMapLoad}
          options={{
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#000000' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#808080' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#000000' }] },
              { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
            ]
          }}
        >
          <Marker
            position={userLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(40, 40),
            }}
            title="You are here"
          />

          {nearbyStations.map((place, index) =>
            place.geometry?.location ? (
              <Marker
                key={`real-ev-${index}`}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
                  scaledSize: new google.maps.Size(40, 40),
                }}
                title={place.name}
              />
            ) : null
          )}

          {filteredStations.map((station) => (
            <Marker
              key={station.id}
              position={station.location}
              onClick={() => setSelectedStation(station.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: getMarkerColor(station.congestionLevel),
                fillOpacity: 1,
                scale: 8,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
            />
          ))}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="relative">
        <GlassCard className="rounded-t-3xl rounded-b-none min-h-[40vh] p-6">
          {selectedStationData ? (
            <>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-xl font-semibold mb-1">{selectedStationData.name}</h3>
                  <p className="text-white/60 mb-2">{selectedStationData.location.address}</p>
                  <div className="flex space-x-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <MapPin size={16} /> {selectedStationData.distance} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> {selectedStationData.waitTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={16} color="#FCEE09" /> {selectedStationData.rating}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedStation(null)}>
                  <X className="text-white/60" />
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <NeonButton onClick={() => navigate(`/booking/${selectedStationData.id}`)}>
                  <Plug className="mr-2" /> Book Slot
                </NeonButton>
                <NeonButton variant="secondary" onClick={handleNavigate}>
                  <Navigation className="mr-2" /> Navigate
                </NeonButton>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Discover Charging Stations</h3>
              <p className="text-white/60">Tap on a map pin to view station details and navigate</p>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Discover;
 */
/* import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, OverlayView, InfoWindow } from '@react-google-maps/api';

// Define types
interface Location {
  lat: number;
  lng: number;
  name: string;
  description: string;
}

interface MapLocation {
  position: {
    lat: number;
    lng: number;
  };
  name: string;
  description: string;
}

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1c1c1c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ecaca' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1c1c1c' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2b2b2b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
];

const MapWithCurrentLocation: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc = { lat: latitude, lng: longitude };
          setCurrentPosition(userLoc);

          // Create 10 mock charging stations near user location
          const mocks: Location[] = [];
          for (let i = 0; i < 10; i++) {
            mocks.push({
              lat: latitude + (Math.random() * 0.02 - 0.01),
              lng: longitude + (Math.random() * 0.02 - 0.01),
              name: `EV Station ${i + 1}`,
              description: `Fast charging station ${i + 1}, open 24/7.`,
            });
          }
          setNearbyLocations(mocks);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setCurrentPosition({ lat: 28.6139, lng: 77.209 }); // Fallback: Delhi
        }
      );
    }
  }, []);

  const onMapLoad = () => setMapLoaded(true);

  const renderArrowMarker = (position: { lat: number; lng: number }) => (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div
        style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
        className="arrow-marker"
        onClick={() =>
          setSelectedLocation({
            position,
            name: 'You are here',
            description: 'This is your current location.',
          })
        }
      />
    </OverlayView>
  );

  const renderCyanGlowMarker = (position: { lat: number; lng: number }, location: Location) => (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div
        className="glow-pin"
        style={{ transform: 'translate(-50%, -50%)', cursor: 'pointer' }}
        onClick={() =>
          setSelectedLocation({
            position,
            name: location.name,
            description: location.description,
          })
        }
      />
    </OverlayView>
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <style>{`
        @keyframes glowBlink {
          0%, 100% {
            box-shadow: 0 0 6px #16FFBD, 0 0 12px #16FFBD;
            opacity: 1;
          }
          50% {
            box-shadow: 0 0 15px #16FFBD, 0 0 30px #16FFBD;
            opacity: 0.6;
          }
        }
        .glow-pin {
          width: 16px;
          height: 16px;
          background-color: #16FFBD;
          border-radius: 50%;
          border: 2px solid white;
          animation: glowBlink 1.5s infinite;
        }
        .arrow-marker {
          width: 20px;
          height: 20px;
          background-color: #FFD700;
          border: 2px solid white;
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          animation: glowBlink 1.5s infinite;
        }
      `}</style>

      <LoadScript googleMapsApiKey="AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg" onLoad={onMapLoad}>
        {mapLoaded && currentPosition && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true,
            }}
          >
            {renderArrowMarker(currentPosition)}

            {nearbyLocations.map((loc, index) =>
              renderCyanGlowMarker({ lat: loc.lat, lng: loc.lng }, loc)
            )}

            {selectedLocation && (
              <InfoWindow
                position={selectedLocation.position}
                onCloseClick={() => setSelectedLocation(null)}
              >
                <div>
                  <h3 style={{ marginBottom: 4, color: '#16FFBD' }}>{selectedLocation.name}</h3>
                  <p style={{ color: '#ccc' }}>{selectedLocation.description}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default MapWithCurrentLocation;
 */
/* import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, OverlayView, InfoWindow } from '@react-google-maps/api';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  vehicle: string;
}

interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
  status: 'available' | 'in-use' | 'out-of-service';
  power: string;
  price: string;
  connectors: string[];
  rating: number;
  reviews: Review[];
}

interface MapLocation {
  position: {
    lat: number;
    lng: number;
  };
  data: Location;
}

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1c1c1c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ecaca' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1c1c1c' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2b2b2b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
];

// Real charging stations in Electronic City, Bengaluru :cite[1]:cite[3]:cite[5]
const electronicCityStations: Location[] = [
  {
    lat: 12.8456,
    lng: 77.6602,
    name: 'REIL RTO Electronic City',
    address: 'Phase 2, Electronic City, Bengaluru, Karnataka 560099',
    status: 'available',
    power: '122 kW',
    price: '₹18.0/kWh',
    connectors: ['CCS-2', 'CHAdeMO', 'GBT'],
    rating: 4.2,
    reviews: [
      {
        name: 'Rahul',
        rating: 5,
        comment: 'Fast charging and good service',
        date: '2025-06-15',
        vehicle: 'Tata Nexon EV'
      },
      {
        name: 'Priya',
        rating: 4,
        comment: 'Clean station but sometimes crowded',
        date: '2025-06-22',
        vehicle: 'MG ZS EV'
      }
    ]
  },
  {
    lat: 12.8441,
    lng: 77.6589,
    name: 'GLIDA MG Bengaluru Electronic City',
    address: '195/6/2, Hosur Rd, Bengaluru, Karnataka 560100',
    status: 'in-use',
    power: '30 kW',
    price: '₹18.94/kWh',
    connectors: ['CCS-2'],
    rating: 4.55,
    reviews: [
      {
        name: 'Arun',
        rating: 5,
        comment: 'Convenient location near MG showroom',
        date: '2025-06-18',
        vehicle: 'MG Comet EV'
      },
      {
        name: 'Deepa',
        rating: 4,
        comment: 'Staff was helpful but charger speed could be better',
        date: '2025-06-25',
        vehicle: 'Tata Tiago EV'
      }
    ]
  },
  {
    lat: 12.8472,
    lng: 77.6628,
    name: 'Fiesta Homes EV Station',
    address: 'Doddanagamangala Rd, Silicon Town, Electronic City Phase II',
    status: 'available',
    power: '50 kW',
    price: '₹17.5/kWh',
    connectors: ['CCS-2', 'Type 2'],
    rating: 4.7,
    reviews: [
      {
        name: 'Vikram',
        rating: 5,
        comment: 'Excellent facility with clean waiting area',
        date: '2025-06-20',
        vehicle: 'Hyundai Kona'
      }
    ]
  },
  {
    lat: 12.8419,
    lng: 77.6553,
    name: 'Statiq Tech Mahindra Station',
    address: 'Phase 2, Electronic City, Bengaluru',
    status: 'available',
    power: '60 kW',
    price: '₹18.5/kWh',
    connectors: ['CCS-2', 'CHAdeMO'],
    rating: 4.91,
    reviews: [
      {
        name: 'Neha',
        rating: 5,
        comment: 'Never had to wait, always available',
        date: '2025-06-28',
        vehicle: 'BYD e6'
      }
    ]
  }
];

const MapWithChargingStations: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStation, setSelectedStation] = useState<MapLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to Electronic City coordinates
          setCurrentPosition({ lat: 12.8456, lng: 77.6602 });
        }
      );
    }
  }, []);

  const onMapLoad = () => setMapLoaded(true);

  const renderArrowMarker = (position: { lat: number; lng: number }) => (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div
        style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
        className="arrow-marker"
        onClick={() => setSelectedStation(null)}
      />
    </OverlayView>
  );

  const renderStationMarker = (station: Location) => (
    <OverlayView 
      position={{ lat: station.lat, lng: station.lng }} 
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        className={`glow-pin ${station.status}`}
        style={{ transform: 'translate(-50%, -50%)', cursor: 'pointer' }}
        onClick={() => setSelectedStation({
          position: { lat: station.lat, lng: station.lng },
          data: station
        })}
      />
    </OverlayView>
  );

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`star ${i <= rating ? 'full' : i - 0.5 <= rating ? 'half' : 'empty'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <style>{`
        @keyframes glowBlink {
          0%, 100% { box-shadow: 0 0 6px #16FFBD, 0 0 12px #16FFBD; opacity: 1; }
          50% { box-shadow: 0 0 15px #16FFBD, 0 0 30px #16FFBD; opacity: 0.6; }
        }
        @keyframes glowOrange {
          0%, 100% { box-shadow: 0 0 6px #FFA500, 0 0 12px #FFA500; }
          50% { box-shadow: 0 0 15px #FFA500, 0 0 30px #FFA500; }
        }
        @keyframes glowRed {
          0%, 100% { box-shadow: 0 0 6px #FF4444, 0 0 12px #FF4444; }
          50% { box-shadow: 0 0 15px #FF4444, 0 0 30px #FF4444; }
        }
        .glow-pin {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
        }
        .glow-pin.available {
          background-color: #16FFBD;
          animation: glowBlink 1.5s infinite;
        }
        .glow-pin.in-use {
          background-color: #FFA500;
          animation: glowOrange 1.5s infinite;
        }
        .glow-pin.out-of-service {
          background-color: #FF4444;
          animation: glowRed 1.5s infinite;
        }
        .arrow-marker {
          width: 20px;
          height: 20px;
          background-color: #FFD700;
          border: 2px solid white;
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          animation: glowBlink 1.5s infinite;
        }
        .info-window {
          background: #2b2b2b;
          color: white;
          padding: 16px;
          border-radius: 8px;
          max-width: 300px;
          font-family: Arial, sans-serif;
        }
        .info-window h3 {
          color: #16FFBD;
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 18px;
        }
        .info-window p {
          margin: 8px 0;
          color: #ccc;
        }
        .info-window .rating {
          display: flex;
          align-items: center;
          margin: 8px 0;
        }
        .info-window .star {
          color: #FFD700;
          font-size: 18px;
          margin-right: 2px;
        }
        .info-window .star.half {
          position: relative;
        }
        .info-window .star.half:after {
          content: '★';
          position: absolute;
          left: 0;
          width: 50%;
          overflow: hidden;
          color: #777;
        }
        .info-window .star.empty {
          color: #777;
        }
        .info-window .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          margin: 4px 0;
        }
        .info-window .status.available {
          background-color: #16FFBD33;
          color: #16FFBD;
        }
        .info-window .status.in-use {
          background-color: #FFA50033;
          color: #FFA500;
        }
        .info-window .status.out-of-service {
          background-color: #FF444433;
          color: #FF4444;
        }
        .info-window .review {
          border-top: 1px solid #444;
          padding: 8px 0;
        }
        .info-window .review:last-child {
          border-bottom: 1px solid #444;
        }
        .info-window .reviewer {
          font-weight: bold;
          color: #16FFBD;
        }
        .info-window .review-vehicle {
          font-style: italic;
          color: #888;
          font-size: 0.9em;
        }
        .info-window .connector {
          display: inline-block;
          padding: 2px 6px;
          background-color: #333;
          border-radius: 4px;
          margin-right: 4px;
          font-size: 0.8em;
        }
      `}</style>

      <LoadScript googleMapsApiKey="AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg" onLoad={onMapLoad}>
        {mapLoaded && currentPosition && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true,
            }}
          >
            {renderArrowMarker(currentPosition)}

            {electronicCityStations.map((station) => renderStationMarker(station))}

            {selectedStation && (
              <InfoWindow
                position={selectedStation.position}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className="info-window">
                  <h3>{selectedStation.data.name}</h3>
                  <p>{selectedStation.data.address}</p>
                  
                  <div className="rating">
                    {renderStars(selectedStation.data.rating)}
                    <span style={{ marginLeft: '8px' }}>{selectedStation.data.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className={`status ${selectedStation.data.status}`}>
                    {selectedStation.data.status.replace('-', ' ').toUpperCase()}
                  </div>
                  
                  <p>
                    <strong>Power:</strong> {selectedStation.data.power}
                    <br />
                    <strong>Price:</strong> {selectedStation.data.price}
                  </p>
                  
                  <div style={{ margin: '8px 0' }}>
                    <strong>Connectors:</strong>
                    {selectedStation.data.connectors.map((connector, i) => (
                      <span key={i} className="connector">{connector}</span>
                    ))}
                  </div>
                  
                  <h4 style={{ color: '#16FFBD', marginBottom: '8px' }}>Recent Reviews:</h4>
                  {selectedStation.data.reviews.map((review, i) => (
                    <div key={i} className="review">
                      <div>
                        <span className="reviewer">{review.name}</span>
                        <div style={{ display: 'inline-block', marginLeft: '8px' }}>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p>{review.comment}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="review-vehicle">{review.vehicle}</span>
                        <small style={{ color: '#777' }}>{review.date}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default MapWithChargingStations; */
/* import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, OverlayView, InfoWindow } from '@react-google-maps/api';
import { FaSolarPanel, FaCar, FaBolt, FaFilter, FaRobot, FaRoute, FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { MdElectricCar, MdLocationOn, MdDirections } from 'react-icons/md';

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  vehicle: string;
}

interface Location {
  lat: number;
  lng: number;
  name: string;
  address: string;
  status: 'available' | 'in-use' | 'out-of-service';
  power: string;
  price: string;
  connectors: string[];
  rating: number;
  reviews: Review[];
  solarPowered?: boolean;
  fastCharging?: boolean;
  amenities?: string[];
}

interface MapLocation {
  position: {
    lat: number;
    lng: number;
  };
  data: Location;
}

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1c1c1c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ecaca' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1c1c1c' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2b2b2b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
];

const electronicCityStations: Location[] = [
  {
    lat: 12.8456,
    lng: 77.6602,
    name: 'REIL RTO Electronic City',
    address: 'Phase 2, Electronic City, Bengaluru, Karnataka 560099',
    status: 'available',
    power: '122 kW',
    price: '₹18.0/kWh',
    connectors: ['CCS-2', 'CHAdeMO', 'GBT'],
    rating: 4.2,
    solarPowered: true,
    fastCharging: true,
    amenities: ['Restroom', 'Cafe', 'Waiting Area'],
    reviews: [
      {
        name: 'Rahul',
        rating: 5,
        comment: 'Fast charging and good service',
        date: '2025-06-15',
        vehicle: 'Tata Nexon EV'
      },
      {
        name: 'Priya',
        rating: 4,
        comment: 'Clean station but sometimes crowded',
        date: '2025-06-22',
        vehicle: 'MG ZS EV'
      }
    ]
  },
  {
    lat: 12.8441,
    lng: 77.6589,
    name: 'GLIDA MG Bengaluru Electronic City',
    address: '195/6/2, Hosur Rd, Bengaluru, Karnataka 560100',
    status: 'in-use',
    power: '30 kW',
    price: '₹18.94/kWh',
    connectors: ['CCS-2'],
    rating: 4.55,
    fastCharging: false,
    amenities: ['MG Showroom', 'Service Center'],
    reviews: [
      {
        name: 'Arun',
        rating: 5,
        comment: 'Convenient location near MG showroom',
        date: '2025-06-18',
        vehicle: 'MG Comet EV'
      },
      {
        name: 'Deepa',
        rating: 4,
        comment: 'Staff was helpful but charger speed could be better',
        date: '2025-06-25',
        vehicle: 'Tata Tiago EV'
      }
    ]
  },
  {
    lat: 12.8472,
    lng: 77.6628,
    name: 'Fiesta Homes EV Station',
    address: 'Doddanagamangala Rd, Silicon Town, Electronic City Phase II',
    status: 'available',
    power: '50 kW',
    price: '₹17.5/kWh',
    connectors: ['CCS-2', 'Type 2'],
    rating: 4.7,
    solarPowered: true,
    fastCharging: true,
    amenities: ['Restaurant', 'Shopping'],
    reviews: [
      {
        name: 'Vikram',
        rating: 5,
        comment: 'Excellent facility with clean waiting area',
        date: '2025-06-20',
        vehicle: 'Hyundai Kona'
      }
    ]
  },
  {
    lat: 12.8419,
    lng: 77.6553,
    name: 'Statiq Tech Mahindra Station',
    address: 'Phase 2, Electronic City, Bengaluru',
    status: 'available',
    power: '60 kW',
    price: '₹18.5/kWh',
    connectors: ['CCS-2', 'CHAdeMO'],
    rating: 4.91,
    fastCharging: true,
    amenities: ['Tech Park Access', 'Security'],
    reviews: [
      {
        name: 'Neha',
        rating: 5,
        comment: 'Never had to wait, always available',
        date: '2025-06-28',
        vehicle: 'BYD e6'
      }
    ]
  }
];

const MapWithChargingStations: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStation, setSelectedStation] = useState<MapLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filters, setFilters] = useState({
    solar: false,
    fastCharging: false,
    available: true,
    rating: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<Location | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          // Generate AI suggestion based on location
          generateAiSuggestion(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to Electronic City coordinates
          setCurrentPosition({ lat: 12.8456, lng: 77.6602 });
          generateAiSuggestion(12.8456, 77.6602);
        }
      );
    }
  }, []);

  const generateAiSuggestion = (lat: number, lng: number) => {
    // Simple AI suggestion logic - finds highest rated available station within 2km
    const suggestedStation = electronicCityStations
      .filter(station => station.status === 'available')
      .sort((a, b) => b.rating - a.rating)[0];
    
    setAiSuggestion(suggestedStation);
  };

  const onMapLoad = () => setMapLoaded(true);

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const filteredStations = electronicCityStations.filter(station => {
    if (filters.solar && !station.solarPowered) return false;
    if (filters.fastCharging && !station.fastCharging) return false;
    if (filters.available && station.status !== 'available') return false;
    if (filters.rating > 0 && station.rating < filters.rating) return false;
    return true;
  });

  const openDirections = (station: Location) => {
    if (!currentPosition) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentPosition.lat},${currentPosition.lng}&destination=${station.lat},${station.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star full" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="star half" />);
      } else {
        stars.push(<FaRegStar key={i} className="star empty" />);
      }
    }
    return stars;
  };

  const renderArrowMarker = (position: { lat: number; lng: number }) => (
    <OverlayView position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
      <div
        style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }}
        className="arrow-marker"
        onClick={() => setSelectedStation(null)}
      />
    </OverlayView>
  );

  const renderStationMarker = (station: Location) => (
    <OverlayView 
      position={{ lat: station.lat, lng: station.lng }} 
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        className={`glow-pin ${station.status}`}
        style={{ transform: 'translate(-50%, -50%)', cursor: 'pointer' }}
        onClick={() => setSelectedStation({
          position: { lat: station.lat, lng: station.lng },
          data: station
        })}
      />
    </OverlayView>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <style>{`
        @keyframes glowBlink {
          0%, 100% { box-shadow: 0 0 6px #16FFBD, 0 0 12px #16FFBD; opacity: 1; }
          50% { box-shadow: 0 0 15px #16FFBD, 0 0 30px #16FFBD; opacity: 0.6; }
        }
        @keyframes glowOrange {
          0%, 100% { box-shadow: 0 0 6px #FFA500, 0 0 12px #FFA500; }
          50% { box-shadow: 0 0 15px #FFA500, 0 0 30px #FFA500; }
        }
        @keyframes glowRed {
          0%, 100% { box-shadow: 0 0 6px #FF4444, 0 0 12px #FF4444; }
          50% { box-shadow: 0 0 15px #FF4444, 0 0 30px #FF4444; }
        }
        .glow-pin {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
        }
        .glow-pin.available {
          background-color: #16FFBD;
          animation: glowBlink 1.5s infinite;
        }
        .glow-pin.in-use {
          background-color: #FFA500;
          animation: glowOrange 1.5s infinite;
        }
        .glow-pin.out-of-service {
          background-color: #FF4444;
          animation: glowRed 1.5s infinite;
        }
        .arrow-marker {
          width: 20px;
          height: 20px;
          background-color: #FFD700;
          border: 2px solid white;
          clip-path: polygon(0 100%, 50% 0, 100% 100%);
          animation: glowBlink 1.5s infinite;
        }
        .info-window {
          background: #2b2b2b;
          color: white;
          padding: 16px;
          border-radius: 8px;
          max-width: 300px;
          font-family: Arial, sans-serif;
        }
        .info-window h3 {
          color: #16FFBD;
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 18px;
        }
        .info-window p {
          margin: 8px 0;
          color: #ccc;
        }
        .info-window .rating {
          display: flex;
          align-items: center;
          margin: 8px 0;
        }
        .info-window .star {
          color: #FFD700;
          font-size: 14px;
          margin-right: 2px;
        }
        .info-window .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
          margin: 4px 0;
        }
        .info-window .status.available {
          background-color: #16FFBD33;
          color: #16FFBD;
        }
        .info-window .status.in-use {
          background-color: #FFA50033;
          color: #FFA500;
        }
        .info-window .status.out-of-service {
          background-color: #FF444433;
          color: #FF4444;
        }
        .info-window .review {
          border-top: 1px solid #444;
          padding: 8px 0;
        }
        .info-window .review:last-child {
          border-bottom: 1px solid #444;
        }
        .info-window .reviewer {
          font-weight: bold;
          color: #16FFBD;
        }
        .info-window .review-vehicle {
          font-style: italic;
          color: #888;
          font-size: 0.9em;
        }
        .info-window .connector {
          display: inline-block;
          padding: 2px 6px;
          background-color: #333;
          border-radius: 4px;
          margin-right: 4px;
          font-size: 0.8em;
        }
        .info-window .amenity {
          display: inline-flex;
          align-items: center;
          margin-right: 8px;
          font-size: 0.9em;
        }
        .info-window .amenity svg {
          margin-right: 4px;
        }
        .filter-panel {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
          background: rgba(43, 43, 43, 0.9);
          border-radius: 8px;
          padding: 16px;
          color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          max-width: 300px;
        }
        .filter-toggle {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
          background: #16FFBD;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .filter-toggle svg {
          color: #1c1c1c;
          font-size: 20px;
        }
        .filter-option {
          display: flex;
          align-items: center;
          margin: 8px 0;
          cursor: pointer;
        }
        .filter-option svg {
          margin-right: 8px;
        }
        .filter-option.active {
          color: #16FFBD;
        }
        .ai-suggestion {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
          background: rgba(43, 43, 43, 0.9);
          border-radius: 8px;
          padding: 16px;
          color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          max-width: 300px;
          border-left: 4px solid #16FFBD;
        }
        .ai-suggestion h3 {
          display: flex;
          align-items: center;
          margin-top: 0;
          color: #16FFBD;
        }
        .ai-suggestion h3 svg {
          margin-right: 8px;
        }
        .ai-suggestion p {
          margin: 8px 0;
        }
        .direction-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #16FFBD;
          color: #1c1c1c;
          border: none;
          border-radius: 4px;
          padding: 8px 12px;
          margin-top: 8px;
          cursor: pointer;
          font-weight: bold;
        }
        .direction-btn svg {
          margin-right: 8px;
        }
        .rating-filter {
          display: flex;
          margin: 12px 0;
        }
        .rating-filter span {
          cursor: pointer;
          margin-right: 8px;
        }
      `}</style>

      {aiSuggestion && (
        <div className="ai-suggestion">
          <h3>
            <FaRobot /> AI Recommended Station
          </h3>
          <p><strong>{aiSuggestion.name}</strong></p>
          <p>Rating: {aiSuggestion.rating.toFixed(1)}</p>
          <p>Power: {aiSuggestion.power}</p>
          <p>Price: {aiSuggestion.price}</p>
          <button 
            className="direction-btn" 
            onClick={() => openDirections(aiSuggestion)}
          >
            <FaRoute /> Get Directions
          </button>
        </div>
      )}

      <button 
        className="filter-toggle" 
        onClick={() => setShowFilters(!showFilters)}
      >
        <FaFilter />
      </button>

      {showFilters && (
        <div className="filter-panel">
          <h3>Filter Stations</h3>
          
          <div className="filter-option" onClick={() => handleFilterChange('available')}>
            <MdElectricCar />
            <span className={filters.available ? 'active' : ''}>Available Now</span>
          </div>
          
          <div className="filter-option" onClick={() => handleFilterChange('solar')}>
            <FaSolarPanel />
            <span className={filters.solar ? 'active' : ''}>Solar Powered</span>
          </div>
          
          <div className="filter-option" onClick={() => handleFilterChange('fastCharging')}>
            <FaBolt />
            <span className={filters.fastCharging ? 'active' : ''}>Fast Charging</span>
          </div>
          
          <div>
            <p>Minimum Rating:</p>
            <div className="rating-filter">
              {[0, 3, 4, 4.5].map(rating => (
                <span 
                  key={rating} 
                  className={filters.rating === rating ? 'active' : ''}
                  onClick={() => setFilters({...filters, rating})}
                >
                  {rating === 0 ? 'Any' : rating}+
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <LoadScript googleMapsApiKey="AIzaSyDsfHwAB8GKbmiZu8n40d3M6n0ZtsCzwcg" onLoad={onMapLoad}>
        {mapLoaded && currentPosition && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={15}
            options={{
              styles: darkMapStyle,
              disableDefaultUI: true,
            }}
          >
            {renderArrowMarker(currentPosition)}

            {filteredStations.map((station) => renderStationMarker(station))}

            {selectedStation && (
              <InfoWindow
                position={selectedStation.position}
                onCloseClick={() => setSelectedStation(null)}
              >
                <div className="info-window">
                  <h3>{selectedStation.data.name}</h3>
                  <p>{selectedStation.data.address}</p>
                  
                  <div className="rating">
                    {renderStars(selectedStation.data.rating)}
                    <span style={{ marginLeft: '8px' }}>{selectedStation.data.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className={`status ${selectedStation.data.status}`}>
                    {selectedStation.data.status.replace('-', ' ').toUpperCase()}
                  </div>
                  
                  <p>
                    <strong>Power:</strong> {selectedStation.data.power}
                    <br />
                    <strong>Price:</strong> {selectedStation.data.price}
                  </p>
                  
                  <div style={{ margin: '8px 0' }}>
                    <strong>Connectors:</strong>
                    {selectedStation.data.connectors.map((connector, i) => (
                      <span key={i} className="connector">{connector}</span>
                    ))}
                  </div>
                  
                  {selectedStation.data.amenities && (
                    <div style={{ margin: '8px 0' }}>
                      <strong>Amenities:</strong>
                      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '4px' }}>
                        {selectedStation.data.amenities.map((amenity, i) => (
                          <span key={i} className="amenity">
                            <MdLocationOn /> {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedStation.data.solarPowered && (
                    <div className="amenity">
                      <FaSolarPanel /> Solar Powered
                    </div>
                  )}
                  
                  {selectedStation.data.fastCharging && (
                    <div className="amenity">
                      <FaBolt /> Fast Charging
                    </div>
                  )}
                  
                  <button 
                    className="direction-btn" 
                    onClick={() => openDirections(selectedStation.data)}
                    style={{ width: '100%', margin: '12px 0' }}
                  >
                    <MdDirections /> Get Directions
                  </button>
                  
                  <h4 style={{ color: '#16FFBD', marginBottom: '8px' }}>Recent Reviews:</h4>
                  {selectedStation.data.reviews.map((review, i) => (
                    <div key={i} className="review">
                      <div>
                        <span className="reviewer">{review.name}</span>
                        <div style={{ display: 'flex', marginLeft: '8px' }}>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p>{review.comment}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="review-vehicle">{review.vehicle}</span>
                        <small style={{ color: '#777' }}>{review.date}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default MapWithChargingStations; */
/* import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { FaCar, FaPlug, FaDirections, FaArrowLeft, FaStar, FaPhone, FaClock } from 'react-icons/fa';
import useLoadGoogleMaps from './config/useLoadGoogleMaps'; // Assuming this hook correctly loads the Google Maps script

interface Station {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    isOpen?: () => boolean;
  };
  formatted_phone_number?: string;
}

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const MapWithChargingStations: React.FC = () => {
  // IMPORTANT: Ensure useLoadGoogleMaps handles the 'places' library
  // The script URL should look something like:
  // `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`
  const mapsLoaded = useLoadGoogleMaps("AIzaSyAQUzpRgDRUkX3644dlBWvuvizH5rIH4Hk"); 
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user's current location once
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLoading(false); // Set loading to false once user location is obtained
        },
        (error) => {
          console.error("Geolocation error:", error);
          const defaultLocation = { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore, India
          setUserLocation(defaultLocation);
          setLoading(false); // Set loading to false even if geolocation fails
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      const defaultLocation = { lat: 12.9716, lng: 77.5946 }; // Default to Bangalore, India
      setUserLocation(defaultLocation);
      setLoading(false); // Set loading to false if geolocation is not supported
    }
  }, []);

  // Use useCallback to memoize the findNearbyStations function
  const findNearbyStations = useCallback((mapInstance: google.maps.Map, location: { lat: number; lng: number }) => {
    if (!mapInstance || !location) return;

    const service = new google.maps.places.PlacesService(mapInstance);
    service.nearbySearch(
      {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: 5000,
        keyword: "EV charging station"
      },
      (results: google.maps.places.PlaceResult[] | null, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const fetchedStations = results.map(result => ({
            place_id: result.place_id || '',
            name: result.name || '',
            geometry: {
              location: {
                lat: () => result.geometry?.location?.lat() || 0,
                lng: () => result.geometry?.location?.lng() || 0
              }
            },
            formatted_address: result.formatted_address,
            rating: result.rating,
            user_ratings_total: result.user_ratings_total,
            opening_hours: result.opening_hours,
            formatted_phone_number: result.formatted_phone_number
          } as Station));
          setStations(fetchedStations);
        } else {
          console.error("Places API error:", status);
        }
      }
    );
  }, []); // Dependencies for useCallback. Empty array means it's created once.

  // This effect runs when both map and userLocation are available
  useEffect(() => {
    if (map && userLocation) {
      findNearbyStations(map, userLocation);
    }
  }, [map, userLocation, findNearbyStations]); // Re-run when map or userLocation changes

  const showStationDetails = (station: Station) => {
    setSelectedStation(station);

    if (!userLocation || !map) return; // Ensure map is available for DirectionsService

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
        destination: new google.maps.LatLng(station.geometry.location.lat(), station.geometry.location.lng()),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  const showAllStations = () => {
    setSelectedStation(null);
    setDirections(null);
  };

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    // You could potentially trigger findNearbyStations here directly as well,
    // but the useEffect that depends on `map` and `userLocation` is cleaner.
  }, []); // useCallback to prevent re-creation of the function on every render

  // Helper function to get location as LatLngLiteral
  const getLocationLiteral = (location: { lat: () => number; lng: () => number }) => {
    return {
      lat: location.lat(),
      lng: location.lng()
    };
  };

  if (!mapsLoaded) {
    return <div>Loading Google Maps...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '70%', height: '100%' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          // Center the map on user location or a default if not yet available
          center={userLocation || { lat: 12.9716, lng: 77.5946 }} 
          zoom={14}
          onLoad={onMapLoad} // This is crucial for setting the 'map' state
        >
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // More standard blue dot for user
              }}
            />
          )}

          {stations.map((station) => (
            <Marker
              key={station.place_id}
              position={getLocationLiteral(station.geometry.location)}
              title={station.name}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" // Green dot for stations
              }}
              onClick={() => showStationDetails(station)}
            />
          ))}

          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      <div style={{
        width: '30%',
        height: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#f9f9f9',
        overflowY: 'auto',
        borderLeft: '2px solid #ccc'
      }}>
        <h2 style={{ marginTop: 0, color: '#1e90ff' }}>
          <FaPlug style={{ marginRight: '8px' }} />
          Nearby EV Charging Stations
        </h2>

        {selectedStation ? (
          <>
            <button
              onClick={showAllStations}
              style={{
                marginBottom: '15px',
                padding: '8px 12px',
                backgroundColor: '#1e90ff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Show All Stations
            </button>

            <div style={{
              marginBottom: '20px',
              padding: '15px',
              background: '#fff',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <strong>{selectedStation.name}</strong>
              <br /><br />
              {selectedStation.formatted_address || "No address"}
              <br /><br />
              <FaStar style={{ color: '#FFD700', marginRight: '5px' }} />
              Rating: {selectedStation.rating || "N/A"}
              ({selectedStation.user_ratings_total || 0} reviews)
              <br /><br />
              {selectedStation.formatted_phone_number && (
                <>
                  <FaPhone style={{ marginRight: '5px' }} />
                  Phone: {selectedStation.formatted_phone_number}
                  <br /><br />
                </>
              )}
              {selectedStation.opening_hours && (
                <>
                  <FaClock style={{ marginRight: '5px' }} />
                  {selectedStation.opening_hours.isOpen?.() ? (
                    <span style={{ color: 'green' }}>Open Now</span>
                  ) : (
                    <span style={{ color: 'red' }}>Closed</span>
                  )}
                  <br /><br />
                </>
              )}
              <a
                href={`https://www.google.com/maps/dir/${userLocation?.lat},${userLocation?.lng}/${selectedStation.geometry.location.lat()},${selectedStation.geometry.location.lng()}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#007bff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}
              >
                <FaDirections style={{ marginRight: '5px' }} />
                Start Navigation
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=EV+charging+station&query_place_id=${selectedStation.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#007bff',
                  textDecoration: 'none'
                }}
              >
                View on Google Maps
              </a>
            </div>

            <div style={{ marginTop: '20px', fontSize: '14px', lineHeight: '1.6' }}>
              <h3>Turn-by-Turn Directions</h3>
              {directions?.routes[0]?.legs[0]?.steps.map((step, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: `<strong>Step ${i + 1}:</strong> ${step.instructions}` }} />
              ))}
            </div>
          </>
        ) : (
          <div id="stationInfo">
            {loading ? (
              <p>Loading stations...</p>
            ) : stations.length === 0 ? (
              <p>No stations found. Try moving the map or checking your location.</p>
            ) : (
              stations.map((station) => (
                <div
                  key={station.place_id}
                  style={{
                    marginBottom: '20px',
                    padding: '15px',
                    background: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <strong>{station.name}</strong>
                  <br />
                  {station.formatted_address || "No address"}
                  <br />
                  <FaStar style={{ color: '#FFD700', marginRight: '5px' }} />
                  Rating: {station.rating || "N/A"}
                  ({station.user_ratings_total || 0} reviews)
                  <br />
                  {station.opening_hours && (
                    station.opening_hours.isOpen?.() ? (
                      <span style={{ color: 'green' }}>Open Now</span>
                    ) : (
                      <span style={{ color: 'red' }}>Closed</span>
                    )
                  )}
                  <br /><br />
                  <button
                    onClick={() => showStationDetails(station)}
                    style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      marginTop: '5px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <FaDirections style={{ marginRight: '5px' }} />
                    Get Directions
                  </button>
                  <br />
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=EV+charging+station&query_place_id=${station.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#007bff',
                      textDecoration: 'none',
                      fontSize: '14px'
                    }}
                  >
                    View on Google Maps
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapWithChargingStations; */
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { FaCarBattery, FaChargingStation, FaDirections, FaArrowLeft, FaStar, FaPhone, FaClock, FaCalendarAlt, FaRobot, FaTimes, FaExpandAlt, FaCompressAlt, FaBolt } from 'react-icons/fa';
import useLoadGoogleMaps from './config/useLoadGoogleMaps';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

interface Station {
  place_id: string;
  name: string;
  geometry: {
    location: {
      lat: () => number;
      lng: () => number;
    };
  };
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: {
    isOpen?: () => boolean;
  };
  formatted_phone_number?: string;
}

interface OCMData {
  id?: string;
  name?: string;
  address?: {
    line1?: string;
    line2?: string;
    town?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  location?: {
    lat?: number;
    lng?: number;
  };
  operator?: string;
  status?: string;
  connections?: Array<{
    type?: string;
    power_kw?: number;
    voltage?: number;
    amps?: number;
    level?: string;
    current?: string;
  }>;
  pricing?: string;
  usage_type?: string;
  number_of_points?: number;
  date_created?: string;
  date_last_verified?: string;
  data_provider?: string;
  error?: string;
}

interface StationWithOCM extends Station {
  ocmData?: OCMData;
}

interface AIRecommendation {
  recommendation: string;
  stations?: Array<{
    source: string;
    id: string;
    name: string;
    address: string;
    location: {
      lat: number;
      lng: number;
    };
    distance_km: number;
    rating: number;
    operator?: string;
    connectors: Array<{
      type: string;
      power_kw?: number;
      level?: string;
    }>;
    fastest_connector?: {
      type: string;
      power_kw?: number;
    };
    user_ratings_total?: number;
    opening_hours?: boolean | null;
  }>;
  is_generic: boolean;
}

interface UserEVData {
  evName?: string;
  evModel?: string;
  batteryRemaining: number;
}

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a1a1a" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#777777" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#555555" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#999999" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bbbbbb" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#777777" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#111111" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#666666" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1a1a1a" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#888888" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#3a3a3a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#4c4c4c" }] },
  { featureType: "road.highway.controlled_access", stylers: [{ color: "#5e5e5e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#666666" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#777777" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#333333" }] },
];

const MapWithChargingStations: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const mapsLoaded = useLoadGoogleMaps("YOUR_Maps_API_KEY");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<StationWithOCM | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAiSuggestion, setShowAiSuggestion] = useState(true);
  const [bestStation, setBestStation] = useState<Station | null>(null);
  const [isAiPopupExpanded, setIsAiPopupExpanded] = useState(false);
  const [userEVData, setUserEVData] = useState<UserEVData | null>(null);
  const [aiRecommendation, setAIRecommendation] = useState<AIRecommendation | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);

  const defaultCoimbatoreLocation = { lat: 11.0045, lng: 76.9616 };
  const glowingCyan = 'rgba(0, 255, 255, 0.7)';
  const glowingGreen = 'rgba(22, 255, 189, 0.7)';
  const primaryBg = 'rgb(11 11 11)';
  const secondaryBg = 'rgb(25 25 25)';
  const accentColor = 'rgb(22 255 189)';
  const textColor = '#e0e0e0';
  const mutedTextColor = '#aaaaaa';

  useEffect(() => {
    const fetchUserDataAndRecommendation = async () => {
      try {
        const user = auth.currentUser;
        if (!user || !userLocation) return;

        const userProfileRef = doc(db, 'userProfiles', user.uid);
        const docSnap = await getDoc(userProfileRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          const evData = {
            evName: data.evName,
            evModel: data.evModel,
            batteryRemaining: data.batteryRemaining || 0
          };
          setUserEVData(evData);

          setLoadingRecommendation(true);
          const response = await fetch('http://localhost:5501/ai_recommendation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_lat: userLocation.lat,
              user_lng: userLocation.lng,
              ev_name: data.evName,
              ev_model: data.evModel,
              battery_percent: data.batteryRemaining
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const recommendation = await response.json();
          setAIRecommendation(recommendation);
        }
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      } finally {
        setLoadingRecommendation(false);
      }
    };

    fetchUserDataAndRecommendation();
  }, [userLocation, auth]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation(defaultCoimbatoreLocation);
          setLoading(false);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
      setUserLocation(defaultCoimbatoreLocation);
      setLoading(false);
    }
  }, []);

  const findNearbyStations = useCallback((mapInstance: google.maps.Map, location: { lat: number; lng: number }) => {
    if (!mapInstance || !location) return;

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.warn("Google Maps 'places' library not fully loaded, displaying only mock data if applicable.");
      setStations([]);
      return;
    }

    const service = new google.maps.places.PlacesService(mapInstance);
    service.nearbySearch(
      {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius: 5000,
        keyword: "EV charging station"
      },
      (results: google.maps.places.PlaceResult[] | null, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
          const fetchedStations = results.map(result => ({
            place_id: result.place_id || '',
            name: result.name || '',
            geometry: {
              location: {
                lat: () => result.geometry?.location?.lat() || 0,
                lng: () => result.geometry?.location?.lng() || 0
              }
            },
            formatted_address: result.formatted_address,
            rating: result.rating,
            user_ratings_total: result.user_ratings_total,
            opening_hours: result.opening_hours,
            formatted_phone_number: result.formatted_phone_number
          } as Station));
          setStations(fetchedStations);
        } else {
          console.error("Places API error or no results:", status);
          setStations([]);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (map && userLocation) {
      findNearbyStations(map, userLocation);
    }
  }, [map, userLocation, findNearbyStations]);

  const showStationDetails = async (station: Station): Promise<void> => {
    setSelectedStation(station);
    setDirections(null);
    setShowAiSuggestion(false);

    try {
      const response = await fetch(`http://localhost:5501/station_details?lat=${station.geometry.location.lat()}&lng=${station.geometry.location.lng()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: OCMData = await response.json();
      
      setSelectedStation(prev => ({
        ...prev,
        ocmData: data
      } as StationWithOCM));
    } catch (error) {
      console.error("Failed to fetch station details:", error);
      setSelectedStation(prev => ({
        ...prev,
        ocmData: { error: "Could not load detailed charging information" }
      } as StationWithOCM));
    }

    if (!userLocation || !map) return;

    if (window.google?.maps?.DirectionsService) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
          destination: new google.maps.LatLng(station.geometry.location.lat(), station.geometry.location.lng()),
          travelMode: google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirections(result);
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    } else {
      console.warn("Directions Service not available. Cannot fetch directions.");
    }
  };

  const showAllStations = () => {
    setSelectedStation(null);
    setDirections(null);
    if (bestStation) setShowAiSuggestion(true);
  };

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const getLocationLiteral = (location: { lat: () => number; lng: () => number }) => {
    return {
      lat: location.lat(),
      lng: location.lng()
    };
  };

  const handleBookSlot = async (station: Station) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      if (station.place_id !== 'zyntra_user_location') {
        const stationRef = doc(db, "stations", station.place_id);
        const docSnap = await getDoc(stationRef);
        
        if (!docSnap.exists()) {
          await setDoc(stationRef, {
            id: station.place_id,
            name: station.name || 'Unknown Station',
            address: station.formatted_address || 'Address not available',
            location: {
              lat: station.geometry.location.lat() || userLocation?.lat || 0,
              lng: station.geometry.location.lng() || userLocation?.lng || 0
            },
            createdAt: new Date().toISOString(),
            bookings: []
          });
        }
      }

      navigate(`/book/${station.place_id}`, {
        state: {
          stationName: station.name,
          stationAddress: station.formatted_address || 
                        (station.place_id === 'zyntra_user_location' ? 'Your Current Location' : ''),
          isZyntraStation: station.place_id === 'zyntra_user_location',
          userLocation: station.place_id === 'zyntra_user_location' ? userLocation : null
        }
      });
    } catch (error) {
      console.error("Error initiating booking:", error);
      navigate(`/book/${station.place_id}`, {
        state: {
          stationName: station.name,
          stationAddress: station.formatted_address
        }
      });
    }
  };

  const userMarkerIcon = {
    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
    fillColor: '#00BFFF',
    fillOpacity: 1,
    strokeColor: '#00FFFF',
    strokeWeight: 2.5,
    scale: 2.2,
    anchor: new google.maps.Point(12, 24),
  };

  const evStationMarkerIcon = {
    path: 'M17.5 6.5c-.28 0-.5.22-.5.5v2.5h-10v-2.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5v3c0 .28.22.5.5.5h11c.28 0 .5-.22-.5-.5v-3c0-.28-.22-.5-.5-.5zm-11 5h-1.5c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5h1.5c.28 0 .5-.22-.5-.5v-1.5c0-.28-.22-.5-.5-.5zm11 0h-1.5c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5h1.5c.28 0 .5-.22-.5-.5v-1.5c0-.28-.22-.5-.5-.5zm-11 3.5h-1.5c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5h1.5c.28 0 .5-.22-.5-.5v-1.5c0-.28-.22-.5-.5-.5zm11 0h-1.5c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5h1.5c.28 0 .5-.22-.5-.5v-1.5c0-.28-.22-.5-.5-.5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 5c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z',
    fillColor: '#39FF14',
    fillOpacity: 1,
    strokeColor: '#00FF00',
    strokeWeight: 2,
    scale: 1.2,
    anchor: new google.maps.Point(12, 12),
  };

  const zyntraMarkerIcon = {
    path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
    fillColor: '#FF00FF',
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
    scale: 1.8,
    anchor: new google.maps.Point(12, 12),
  };

  if (!mapsLoaded) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgb(11 11 11)', color: '#eee' }}>
      <p style={{ fontSize: '1.2em', letterSpacing: '1px', textShadow: '0 0 8px rgba(22, 255, 189, 0.6)' }}>Loading EV Map Interface...</p>
    </div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Orbitron, sans-serif', background: primaryBg, color: textColor }}>
      <div style={{ width: '70%', height: '100%', position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCoimbatoreLocation}
          zoom={14}
          onLoad={onMapLoad}
          options={{
            styles: darkMapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {userLocation && (
            <>
              <Marker
                position={userLocation}
                title="Your Location"
                icon={userMarkerIcon}
              />
              <Marker
                position={userLocation}
                title="Zyntra Mobile Charger"
                icon={zyntraMarkerIcon}
                onClick={() => {
                  const zyntraStation: Station = {
                    place_id: 'zyntra_user_location',
                    name: 'Zyntra Mobile Charger',
                    geometry: {
                      location: {
                        lat: () => userLocation.lat,
                        lng: () => userLocation.lng
                      }
                    },
                    formatted_address: 'Your Current Location',
                    rating: 4.9,
                    user_ratings_total: 1200,
                    opening_hours: { isOpen: () => true },
                    formatted_phone_number: '+91 1800 123 4567'
                  };
                  showStationDetails(zyntraStation);
                }}
              />
            </>
          )}

          {stations.map((station) => (
            <Marker
              key={station.place_id}
              position={getLocationLiteral(station.geometry.location)}
              title={station.name}
              icon={evStationMarkerIcon}
              onClick={() => showStationDetails(station)}
            />
          ))}

          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: '#00FFFF',
                  strokeOpacity: 0.8,
                  strokeWeight: 7,
                }
              }}
            />
          )}
        </GoogleMap>

        {!showAiSuggestion && bestStation && (
          <button
            onClick={() => setShowAiSuggestion(true)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: accentColor,
              color: primaryBg,
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: `0 0 15px ${accentColor}88`,
              transition: 'all 0.3s ease',
              zIndex: 11,
              fontSize: '1.5em',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1EE0B9';
              e.currentTarget.style.boxShadow = `0 0 25px ${accentColor}`;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = accentColor;
              e.currentTarget.style.boxShadow = `0 0 15px ${accentColor}88`;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <FaRobot />
          </button>
        )}

        {showAiSuggestion && (
          <div style={{
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: secondaryBg,
    border: `1px solid ${glowingGreen}88`,
    borderRadius: '15px',
    padding: '15px',
    boxShadow: `0 0 40px ${glowingGreen}44, inset 0 0 15px ${glowingGreen}22`,
    zIndex: 10,
    maxWidth: isAiPopupExpanded ? '400px' : '280px',
    maxHeight: '70vh', // Fixed maximum height
    overflow: 'hidden', // Hide overflow of container
    color: textColor,
    fontFamily: 'Roboto, sans-serif',
    animation: 'fadeInSlide 0.7s ease-out forwards',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }}>
            <style>
              {`
                @keyframes fadeInSlide {
                  from { opacity: 0; transform: translateX(-50px) translateY(-20px); }
                  to { opacity: 1; transform: translateX(0) translateY(0); }
                }
                .charge-bar {
                  background-color: #333;
                  border-radius: 5px;
                  height: 10px;
                  overflow: hidden;
                  border: 1px solid ${accentColor};
                  box-shadow: 0 0 8px ${accentColor}55;
                }
                .charge-fill {
                  height: 100%;
                  background: linear-gradient(90deg, #39FF14, #00BFFF);
                  transition: width 0.5s ease-in-out;
                  box-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
                }
              `}
            </style>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <h3 style={{
                margin: 0,
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                textShadow: `0 0 12px ${accentColor}88`,
                fontSize: '1.2em',
              }}>
                <FaRobot style={{ marginRight: '8px', fontSize: '1.1em', color: glowingCyan }} />
                AI Reco
              </h3>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button
                  onClick={() => setIsAiPopupExpanded(!isAiPopupExpanded)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: mutedTextColor,
                    fontSize: '1.1em',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = textColor}
                  onMouseOut={(e) => e.currentTarget.style.color = mutedTextColor}
                >
                  {isAiPopupExpanded ? <FaCompressAlt /> : <FaExpandAlt />}
                </button>
                <button
                  onClick={() => setShowAiSuggestion(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: mutedTextColor,
                    fontSize: '1.3em',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = textColor}
                  onMouseOut={(e) => e.currentTarget.style.color = mutedTextColor}
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {userEVData && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: primaryBg, borderRadius: '6px', border: `1px solid ${glowingCyan}44` }}>
                <FaCarBattery style={{ color: accentColor, fontSize: '1.4em', textShadow: `0 0 10px ${accentColor}66` }} />
                <div style={{ flexGrow: 1 }}>
                  <p style={{ margin: '0 0 3px 0', fontSize: '0.85em', color: mutedTextColor }}>
                    {userEVData.evName} {userEVData.evModel}
                  </p>
                  <div className="charge-bar">
                    <div className="charge-fill" style={{ 
                      width: `${userEVData.batteryRemaining}%`,
                      background: userEVData.batteryRemaining < 20 ? 'linear-gradient(90deg, #FF4500, #FF8C00)' : 
                                 userEVData.batteryRemaining < 50 ? 'linear-gradient(90deg, #FFA500, #FFD700)' :
                                 'linear-gradient(90deg, #39FF14, #00BFFF)'
                    }} />
                  </div>
                  <span style={{ fontSize: '1em', fontWeight: 'bold', color: textColor, marginTop: '3px', display: 'block' }}>
                    <span style={{
                      color: userEVData.batteryRemaining < 20 ? '#FF4500' : 
                            userEVData.batteryRemaining < 50 ? '#FFD700' : glowingGreen,
                      textShadow: `0 0 8px ${userEVData.batteryRemaining < 20 ? '#FF450088' : 
                                  userEVData.batteryRemaining < 50 ? '#FFD70088' : `${glowingGreen}88`}`
                    }}>
                      {userEVData.batteryRemaining}%
                    </span>
                  </span>
                </div>
              </div>
            )}

            {loadingRecommendation ? (
              <div style={{ padding: '15px', textAlign: 'center' }}>
                <p>Finding best charging options...</p>
              </div>
            ) : aiRecommendation ? (
                  <div style={{ 
                          background: primaryBg, 
                          padding: '15px', 
                          borderRadius: '8px',
                          overflowY: 'auto', // Scrollable content
                          maxHeight: '60vh', // Fixed height
                          flexGrow: 1 // Take remaining space
                        }}>
                <p style={{ 
                  margin: '0 0 10px 0', 
                  fontStyle: aiRecommendation.is_generic ? 'italic' : 'normal',
                  color: aiRecommendation.is_generic ? mutedTextColor : textColor
                }}>
                  {aiRecommendation.recommendation}
                </p>

                {aiRecommendation.stations && aiRecommendation.stations.length > 0 && (
                  <div style={{ 
            marginTop: '15px',
            maxHeight: '40vh', // Constrained height
            overflowY: 'auto' // Scrollable stations
          }}>
                    <h4 style={{ 
                      margin: '0 0 10px 0', 
                      color: accentColor,
                      fontSize: '1.1em'
                    }}>
                      Recommended Stations:
                    </h4>
                    
                    {aiRecommendation.stations.map((station) => {
                      const stationForMap: Station = {
                        place_id: station.id,
                        name: station.name,
                        geometry: {
                          location: {
                            lat: () => station.location.lat,
                            lng: () => station.location.lng
                          }
                        },
                        formatted_address: station.address,
                        rating: station.rating,
                        user_ratings_total: station.user_ratings_total,
                        opening_hours: station.opening_hours !== undefined ? {
                          isOpen: () => station.opening_hours || false
                        } : undefined
                      };
                      
                      return (
                        <div 
                          key={station.id}
                          style={{
                            padding: '12px',
                            marginBottom: '10px',
                            background: secondaryBg,
                            borderRadius: '8px',
                            border: `1px solid ${glowingGreen}33`,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onClick={() => {
                            showStationDetails(stationForMap);
                            setShowAiSuggestion(false);
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#333333';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = secondaryBg;
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h5 style={{ margin: '0 0 5px 0', color: textColor }}>
                              {station.name}
                            </h5>
                            <span style={{ 
                              color: accentColor,
                              fontSize: '0.9em'
                            }}>
                              {station.distance_km.toFixed(1)} km
                            </span>
                          </div>
                          <p style={{ 
                            margin: '0 0 5px 0', 
                            fontSize: '0.9em',
                            color: mutedTextColor
                          }}>
                            {station.address}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                            <FaStar style={{ 
                              color: '#FFD700', 
                              marginRight: '5px', 
                              fontSize: '0.9em' 
                            }} />
                            <span style={{ fontSize: '0.9em' }}>
                              {station.rating.toFixed(1)}/5
                              {station.user_ratings_total && ` (${station.user_ratings_total})`}
                            </span>
                          </div>
                          
                          {station.fastest_connector && (
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              marginTop: '5px'
                            }}>
                              <FaBolt style={{ 
                                color: '#00BFFF',
                                marginRight: '5px',
                                fontSize: '0.9em'
                              }} />
                              <span style={{ fontSize: '0.85em' }}>
                                Fastest: {station.fastest_connector.type}
                                {station.fastest_connector.power_kw && ` (${station.fastest_connector.power_kw} kW)`}
                              </span>
                            </div>
                          )}
                          
                          <div style={{ 
                            display: 'flex', 
                            gap: '8px',
                            marginTop: '10px'
                          }}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBookSlot(stationForMap);
                              }}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: glowingGreen,
                                color: primaryBg,
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85em',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                flexGrow: 1,
                                justifyContent: 'center'
                              }}
                            >
                              <FaCalendarAlt /> Book Slot
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                showStationDetails(stationForMap);
                                setShowAiSuggestion(false);
                              }}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: glowingCyan,
                                color: primaryBg,
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.85em',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                flexGrow: 1,
                                justifyContent: 'center'
                              }}
                            >
                              <FaDirections /> View
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: mutedTextColor }}>Could not load recommendations</p>
            )}
          </div>
        )}

        {userLocation && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            left: 'auto',
            backgroundColor: 'rgba(40, 0, 60, 0.9)',
            background: 'linear-gradient(135deg, rgba(70, 0, 90, 0.9) 0%, rgba(120, 0, 150, 0.9) 100%)',
            border: `1px solid #FF00FF`,
            borderRadius: '15px',
            padding: '20px',
            boxShadow: `0 0 30px rgba(255, 0, 255, 0.6), inset 0 0 15px rgba(255, 105, 255, 0.4)`,
            zIndex: 10,
            maxWidth: '280px',
            color: '#FFFFFF',
            fontFamily: 'Roboto, sans-serif',
            animation: 'fadeInSlideRight 0.7s ease-out forwards',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            borderTop: `3px solid #FF66FF`,
          }}>
            <style>
              {`
                @keyframes fadeInSlideRight {
                  from { opacity: 0; transform: translateX(50px) translateY(-20px); }
                  to { opacity: 1; transform: translateX(0) translateY(0); }
                }
              `}
            </style>
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              backgroundColor: '#FF00FF',
              color: 'white',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: `0 0 15px #FF00FF`
            }}>
              Z
            </div>
            
            <h3 style={{
              margin: '0 0 12px 0',
              color: '#FF66FF',
              display: 'flex',
              alignItems: 'center',
              textShadow: `0 0 10px #FF00FF`,
              fontSize: '1.3em',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>
              <FaChargingStation style={{ 
                marginRight: '10px', 
                color: '#FF66FF',
                filter: 'drop-shadow(0 0 5px #FF00FF)'
              }} />
              ZYNTRA STATION
            </h3>
            
            <p style={{ 
              margin: '0 0 15px 0', 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '0.95em',
              lineHeight: '1.5'
            }}>
              Mobile charging unit available at your location. 
              <span style={{
                display: 'block',
                marginTop: '5px',
                color: '#FF66FF',
                fontWeight: 'bold'
              }}>
                No need to travel - we come to you!
              </span>
            </p>
            
            <button
              onClick={() => {
                const zyntraStation: Station = {
                  place_id: 'zyntra_user_location',
                  name: 'Zyntra Mobile Charger',
                  geometry: {
                    location: {
                      lat: () => userLocation.lat,
                      lng: () => userLocation.lng
                    }
                  },
                  formatted_address: 'Your Current Location',
                  rating: 4.9,
                  user_ratings_total: 1200,
                  opening_hours: { isOpen: () => true },
                  formatted_phone_number: '+91 1800 123 4567'
                };
                handleBookSlot(zyntraStation);
              }}
              style={{
                padding: '12px 15px',
                background: 'linear-gradient(90deg, #FF00FF 0%, #CC00FF 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1em',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: `0 0 20px rgba(255, 0, 255, 0.7)`,
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'center',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #FF66FF 0%, #DD00FF 100%)';
                e.currentTarget.style.boxShadow = `0 0 30px rgba(255, 0, 255, 0.9)`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'linear-gradient(90deg, #FF00FF 0%, #CC00FF 100%)';
                e.currentTarget.style.boxShadow = `0 0 20px rgba(255, 0, 255, 0.7)`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaCalendarAlt style={{ 
                marginRight: '10px',
                filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))'
              }} /> 
              Book Mobile Unit
              <span style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(transparent, rgba(255,255,255,0.1), transparent)',
                transform: 'rotate(30deg)',
                pointerEvents: 'none'
              }}></span>
            </button>
          </div>
        )}
      </div>

      <div style={{
        width: '30%',
        height: '100vh',
        padding: '30px',
        boxSizing: 'border-box',
        backgroundColor: primaryBg,
        color: textColor,
        overflowY: 'auto',
        borderLeft: `1px solid ${glowingGreen}`,
        boxShadow: `inset 5px 0 15px rgba(0,0,0,0.5), 0 0 20px ${glowingGreen}33`,
      }}>
        <h2 style={{
          marginTop: 0,
          color: accentColor,
          borderBottom: `1px solid ${glowingGreen}`,
          paddingBottom: '20px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          textShadow: `0 0 15px ${accentColor}dd`,
          fontSize: '1.8em',
          fontWeight: 'bold',
        }}>
          <FaChargingStation style={{ marginRight: '15px', fontSize: '1.5em', color: glowingGreen }} />
          EV Charging Network
        </h2>

        {selectedStation ? (
          <>
            <button
              onClick={showAllStations}
              style={{
                marginBottom: '25px',
                padding: '12px 20px',
                backgroundColor: accentColor,
                color: primaryBg,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.1em',
                fontWeight: 'bold',
                transition: 'all 0.3s ease-in-out',
                boxShadow: `0 0 15px ${accentColor}88`,
                width: '100%',
                justifyContent: 'center',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#1EE0B9';
                e.currentTarget.style.boxShadow = `0 0 25px ${accentColor}`;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = accentColor;
                e.currentTarget.style.boxShadow = `0 0 15px ${accentColor}88`;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <FaArrowLeft style={{ marginRight: '12px' }} />
              Back to All Stations
            </button>

            <div style={{
              marginBottom: '25px',
              padding: '25px',
              background: secondaryBg,
              border: `1px solid ${glowingGreen}44`,
              borderRadius: '12px',
              boxShadow: `0 0 20px ${glowingGreen}22`,
            }}>
              <h3 style={{ color: accentColor, marginTop: 0, marginBottom: '15px', fontSize: '1.6em', textShadow: `0 0 10px ${accentColor}66` }}>{selectedStation.name}</h3>
              {selectedStation.formatted_address && (
                <p style={{ color: mutedTextColor, marginBottom: '12px', fontSize: '1.1em' }}>{selectedStation.formatted_address}</p>
              )}
              <p style={{ color: textColor, display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '1.1em' }}>
                <FaStar style={{ color: '#FFD700', marginRight: '10px', textShadow: '0 0 5px #FFD700' }} />
                Rating: {selectedStation.rating ? `${selectedStation.rating} / 5` : "N/A"}
                {selectedStation.user_ratings_total && ` (${selectedStation.user_ratings_total} reviews)`}
              </p>
              {selectedStation.formatted_phone_number && (
                <p style={{ color: textColor, display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '1.1em' }}>
                  <FaPhone style={{ marginRight: '10px', color: glowingGreen }} />
                  Phone: {selectedStation.formatted_phone_number}
                </p>
              )}
              {selectedStation.opening_hours && (
                <p style={{ color: textColor, display: 'flex', alignItems: 'center', marginBottom: '20px', fontSize: '1.1em' }}>
                  <FaClock style={{ marginRight: '10px', color: glowingCyan }} />
                  {selectedStation.opening_hours.isOpen?.() ? (
                    <span style={{ color: '#39FF14', fontWeight: 'bold', textShadow: '0 0 8px #39FF14' }}>Open Now</span>
                  ) : (
                    <span style={{ color: '#FF4500', fontWeight: 'bold', textShadow: '0 0 8px #FF4500' }}>Closed</span>
                  )}
                </p>
              )}
              <a
                href={`http://maps.google.com/maps?saddr=${userLocation?.lat},${userLocation?.lng}&daddr=${selectedStation.geometry.location.lat()},${selectedStation.geometry.location.lng()}&dirflg=d`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: glowingCyan,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                  textShadow: `0 0 10px ${glowingCyan}66`,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#87CEEB';
                  e.currentTarget.style.textShadow = `0 0 15px ${glowingCyan}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = glowingCyan;
                  e.currentTarget.style.textShadow = `0 0 10px ${glowingCyan}66`;
                }}
              >
                <FaDirections style={{ marginRight: '10px' }} />
                Start Navigation
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStation.name)}&query_place_id=${selectedStation.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: glowingCyan,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                  textShadow: `0 0 10px ${glowingCyan}66`,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#87CEEB';
                  e.currentTarget.style.textShadow = `0 0 15px ${glowingCyan}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = glowingCyan;
                  e.currentTarget.style.textShadow = `0 0 10px ${glowingCyan}66`;
                }}
              >
                View on Google Maps
              </a>
              {selectedStation?.ocmData && (
                <div style={{
                  marginTop: '20px',
                  padding: '20px',
                  background: secondaryBg,
                  border: `1px solid ${glowingGreen}44`,
                  borderRadius: '12px',
                  boxShadow: `0 0 20px ${glowingGreen}22`,
                }}>
                  <h4 style={{ color: accentColor, marginTop: 0, marginBottom: '15px' }}>
                    Charging Details
                  </h4>
                  
                  {selectedStation.ocmData?.connections && selectedStation.ocmData.connections.length > 0 ? (
                    <div>
                      <p style={{ color: textColor, marginBottom: '10px' }}>
                        <strong>Connector Types:</strong>
                      </p>
                      <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {selectedStation.ocmData.connections.map((conn, i) => (
                          <li key={i} style={{ color: mutedTextColor, marginBottom: '8px' }}>
                            {conn.type} - {conn.power_kw ?? 'N/A'} kW
                            {conn.level && ` (${conn.level})`}
                            {conn.current && ` | ${conn.current}`}
                          </li>
                        ))}
                      </ul>
                      
                      {selectedStation.ocmData.pricing && (
                        <p style={{ color: textColor, marginTop: '15px' }}>
                          <strong>Pricing:</strong> {selectedStation.ocmData.pricing}
                        </p>
                      )}
                      
                      {selectedStation.ocmData.operator && (
                        <p style={{ color: textColor, marginTop: '10px' }}>
                          <strong>Operator:</strong> {selectedStation.ocmData.operator}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: mutedTextColor }}>No detailed charging information available</p>
                  )}
                </div>
              )}
              {selectedStation && (
                <button
                  onClick={() => handleBookSlot(selectedStation)}
                  style={{
                    marginTop: '20px',
                    padding: '12px 20px',
                    backgroundColor: glowingGreen,
                    color: primaryBg,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1.1em',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease-in-out',
                    boxShadow: `0 0 15px ${glowingGreen}88`,
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#1EE0B9';
                    e.currentTarget.style.boxShadow = `0 0 25px ${glowingGreen}`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = glowingGreen;
                    e.currentTarget.style.boxShadow = `0 0 15px ${glowingGreen}88`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <FaCalendarAlt style={{ marginRight: '12px' }} />
                  Book a Slot
                </button>
              )}
            </div>

            {directions && directions.routes[0]?.legs[0]?.steps.length > 0 && (
              <div style={{
                marginTop: '25px',
                fontSize: '1em',
                lineHeight: '1.7',
                background: secondaryBg,
                padding: '20px',
                borderRadius: '12px',
                border: `1px solid ${glowingGreen}44`,
                boxShadow: `0 0 20px ${glowingGreen}22`,
              }}>
                <h3 style={{ color: accentColor, marginTop: 0, marginBottom: '20px', textShadow: `0 0 10px ${accentColor}66` }}>Turn-by-Turn Directions</h3>
                <ol style={{ paddingLeft: '25px', margin: 0 }}>
                  {directions.routes[0].legs[0].steps.map((step, i) => (
                    <li key={i} style={{ marginBottom: '15px', color: mutedTextColor }}>
                      <p dangerouslySetInnerHTML={{ __html: `<strong>${i + 1}.</strong> ${step.instructions}` }} style={{ color: textColor, margin: 0 }} />
                      {step.distance && <span style={{ color: '#90CAF9', fontSize: '0.9em', textShadow: '0 0 5px #90CAF933' }}> ({step.distance.text})</span>}
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </>
        ) : (
          <div id="stationInfo">
            {loading ? (
              <p style={{ color: mutedTextColor, fontSize: '1.1em', textShadow: '0 0 5px rgba(255,255,255,0.2)' }}>Locating EV Charging Stations...</p>
            ) : stations.length === 0 ? (
              <p style={{ color: mutedTextColor, fontSize: '1.1em', textShadow: '0 0 5px rgba(255,255,255,0.2)' }}>No EV stations found. Try moving the map or checking your location.</p>
            ) : (
              stations.map((station) => (
                <div
                  key={station.place_id}
                  style={{
                    marginBottom: '20px',
                    padding: '20px',
                    background: secondaryBg,
                    border: `1px solid ${glowingGreen}33`,
                    borderRadius: '10px',
                    boxShadow: `0 0 15px ${glowingGreen}11`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#333333';
                    e.currentTarget.style.boxShadow = `0 0 25px ${glowingGreen}44`;
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = secondaryBg;
                    e.currentTarget.style.boxShadow = `0 0 15px ${glowingGreen}11`;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  onClick={() => showStationDetails(station)}
                >
                  <h4 style={{ color: accentColor, margin: '0 0 10px 0', fontSize: '1.4em', textShadow: `0 0 8px ${accentColor}44` }}>{station.name}</h4>
                  {station.formatted_address && (
                    <p style={{ color: mutedTextColor, margin: '0 0 10px 0', fontSize: '1em' }}>{station.formatted_address}</p>
                  )}
                  <p style={{ color: textColor, display: 'flex', alignItems: 'center', margin: '0 0 10px 0', fontSize: '1em' }}>
                    <FaStar style={{ color: '#FFD700', marginRight: '10px', textShadow: '0 0 5px #FFD700' }} />
                    Rating: {station.rating ? `${station.rating} / 5` : "N/A"}
                    {station.user_ratings_total && ` (${station.user_ratings_total} reviews)`}
                  </p>
                  {station.opening_hours && (
                    <p style={{ color: textColor, display: 'flex', alignItems: 'center', margin: '0', fontSize: '1em' }}>
                      <FaClock style={{ marginRight: '10px', color: glowingCyan }} />
                      {station.opening_hours.isOpen?.() ? (
                        <span style={{ color: '#39FF14', fontWeight: 'bold', textShadow: '0 0 8px #39FF14' }}>Open Now</span>
                      ) : (
                        <span style={{ color: '#FF4500', fontWeight: 'bold', textShadow: '0 0 8px #FF4500' }}>Closed</span>
                      )}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapWithChargingStations;