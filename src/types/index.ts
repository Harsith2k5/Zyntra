export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  vehicles: Vehicle[];
  wallet: {
    balance: number;
    greenPoints: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  };
  preferences: {
    fleetMode: boolean;
    notifications: boolean;
    darkMode: boolean;
  };
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  batteryCapacity: number;
  currentCharge: number;
  range: number;
}

export interface ChargingStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  distance: number;
  waitTime: number;
  pricePerKwh: number; // Price per kilowatt-hour
  power: number;
  rating: number;
  amenities: string[];
  plugTypes: string[];
  isAIPick: boolean;
  congestionLevel: 'low' | 'medium' | 'high';
  solarPowered: boolean;
  isActive?: boolean;
  images: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BookingSlot {
  id: string;
  stationId: string;
  time: string;
  duration: number;
  cost: number;
  isAvailable: boolean;
  congestionLevel: 'low' | 'medium' | 'high';
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  distance: number;
  duration: number;
  chargingStops: ChargingStation[];
  co2Saved: number;
  estimatedCost: number;
}

export interface Notification {
  id: string;
  type: 'ai' | 'payment' | 'environmental' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}