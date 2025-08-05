import { User, ChargingStation, BookingSlot, Trip, Notification } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex@example.com',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  vehicles: [
    {
      id: '1',
      brand: 'Tesla',
      model: 'Model 3',
      batteryCapacity: 75,
      currentCharge: 68,
      range: 412
    },
    {
      id: '2',
      brand: 'BMW',
      model: 'iX',
      batteryCapacity: 105,
      currentCharge: 45,
      range: 324
    }
  ],
  wallet: {
    balance: 2450,
    greenPoints: 1280,
    tier: 'Gold'
  },
  preferences: {
    fleetMode: false,
    notifications: true,
    darkMode: true
  }
};

export const mockStations: ChargingStation[] = [
  {
    id: '1',
    name: 'EcoCharge Hub',
    location: {
      lat: 28.6129,
      lng: 77.2295,
      address: '123 Green Street, Delhi'
    },
    distance: 2.3,
    waitTime: 4,
    pricePerKwh: 14,
    power: 150,
    rating: 4.8,
    amenities: ['Coffee Shop', 'Restrooms', 'WiFi'],
    plugTypes: ['Type 2', 'CCS', 'CHAdeMO'],
    isAIPick: true,
    congestionLevel: 'low',
    solarPowered: true,
    isActive: true,
    images: [
      'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    reviews: [
      {
        id: '1',
        user: 'Sarah M.',
        rating: 5,
        comment: 'Fast charging and great coffee!',
        date: '2024-01-15'
      },
      {
        id: '2',
        user: 'Mike R.',
        rating: 4,
        comment: 'Clean facilities, slightly expensive.',
        date: '2024-01-14'
      }
    ]
  },
  {
    id: '2',
    name: 'PowerGrid Station',
    location: {
      lat: 28.6199,
      lng: 77.2200,
      address: '456 Tech Park, Gurgaon'
    },
    distance: 5.7,
    waitTime: 12,
    pricePerKwh: 12,
    power: 100,
    rating: 4.2,
    amenities: ['Shopping Mall', 'Food Court'],
    plugTypes: ['Type 2', 'CCS'],
    isAIPick: false,
    congestionLevel: 'medium',
    solarPowered: false,
    isActive: true,
    images: [
      'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    reviews: [
      {
        id: '3',
        user: 'John D.',
        rating: 4,
        comment: 'Good location in the mall.',
        date: '2024-01-13'
      }
    ]
  },
  {
    id: '3',
    name: 'QuickCharge Express',
    location: {
      lat: 28.6050,
      lng: 77.2400,
      address: '789 Highway Plaza, Noida'
    },
    distance: 8.2,
    waitTime: 25,
    pricePerKwh: 18,
    power: 200,
    rating: 3.9,
    amenities: ['24/7 Service', 'Security'],
    plugTypes: ['CCS', 'CHAdeMO'],
    isAIPick: false,
    congestionLevel: 'high',
    solarPowered: false,
    isActive: false,
    images: [
      'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    reviews: [
      {
        id: '4',
        user: 'Lisa K.',
        rating: 4,
        comment: 'Always available, bit crowded.',
        date: '2024-01-12'
      }
    ]
  }
];

export const mockBookingSlots: BookingSlot[] = [
  {
    id: '1',
    stationId: '1',
    time: '10:00 AM',
    duration: 30,
    cost: 210,
    isAvailable: true,
    congestionLevel: 'low'
  },
  {
    id: '2',
    stationId: '1',
    time: '11:00 AM',
    duration: 30,
    cost: 210,
    isAvailable: true,
    congestionLevel: 'low'
  },
  {
    id: '3',
    stationId: '1',
    time: '12:00 PM',
    duration: 30,
    cost: 245,
    isAvailable: true,
    congestionLevel: 'medium'
  },
  {
    id: '4',
    stationId: '1',
    time: '1:00 PM',
    duration: 30,
    cost: 280,
    isAvailable: false,
    congestionLevel: 'high'
  },
  {
    id: '5',
    stationId: '1',
    time: '2:00 PM',
    duration: 30,
    cost: 245,
    isAvailable: true,
    congestionLevel: 'medium'
  }
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    from: 'Home',
    to: 'Office',
    distance: 45,
    duration: 65,
    chargingStops: [mockStations[0]],
    co2Saved: 5.2,
    estimatedCost: 340
  },
  {
    id: '2',
    from: 'Delhi',
    to: 'Jaipur',
    distance: 280,
    duration: 320,
    chargingStops: [mockStations[0], mockStations[1]],
    co2Saved: 32.4,
    estimatedCost: 1580
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'ai',
    title: 'Perfect Charging Spot Found!',
    message: 'EcoCharge Hub has no wait time and solar power available.',
    timestamp: '2024-01-15T10:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'payment',
    title: 'Charging Session Complete',
    message: 'Your session at PowerGrid Station cost ₹245. Wallet balance: ₹2,205.',
    timestamp: '2024-01-15T09:15:00Z',
    read: false
  },
  {
    id: '3',
    type: 'environmental',
    title: 'GreenPoints Earned!',
    message: 'You saved 5.2kg CO₂ today. +50 GreenPoints added.',
    timestamp: '2024-01-15T08:45:00Z',
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Charging Station Issue',
    message: 'QuickCharge Express reported a temporary outage. Alternative suggestions available.',
    timestamp: '2024-01-15T07:30:00Z',
    read: true
  }
];

export const mockAnalytics = {
  overview: {
    totalSessions: 1245,
    peakHour: '6:00 PM',
    revenue: 45680,
    utilizationRate: 78
  },
  usage: {
    daily: [
      { day: 'Mon', sessions: 180, revenue: 3240 },
      { day: 'Tue', sessions: 165, revenue: 2970 },
      { day: 'Wed', sessions: 195, revenue: 3510 },
      { day: 'Thu', sessions: 210, revenue: 3780 },
      { day: 'Fri', sessions: 225, revenue: 4050 },
      { day: 'Sat', sessions: 140, revenue: 2520 },
      { day: 'Sun', sessions: 130, revenue: 2340 }
    ],
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      sessions: Math.floor(Math.random() * 50) + 10,
      load: Math.random() * 100
    }))
  },
  forecast: {
    nextWeek: [
      { day: 'Mon', predicted: 185, actual: 180 },
      { day: 'Tue', predicted: 170, actual: 165 },
      { day: 'Wed', predicted: 200, actual: 195 },
      { day: 'Thu', predicted: 215, actual: 210 },
      { day: 'Fri', predicted: 230, actual: 225 },
      { day: 'Sat', predicted: 145, actual: null },
      { day: 'Sun', predicted: 135, actual: null }
    ]
  }
};