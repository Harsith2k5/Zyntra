// scripts/generateMockZyntraUsers.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCs9NcsPuMrYC8GG6_qOAHUzVEZQe3gXGs",
  authDomain: "zyntra-dfb88.firebaseapp.com",
  projectId: "zyntra-dfb88",
  storageBucket: "zyntra-dfb88.appspot.com",
  messagingSenderId: "761863681183",
  appId: "1:761863681183:web:e371fb2906edc0a02f9eaa",
  measurementId: "G-L1YJP72SDQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const generateMockData = (count) => {
  const mockRecords = [];
  const userIds = [
    'lq57b4uZW9R7mu5824N9sGE4xhH2',
    'qtgxKvayiNUiroFGySFfxbN5GMG2',
    'user3',
    'user4',
    'user5'
  ];
  const userNames = ['pinggo', 'Harsith S', 'User Three', 'User Four', 'User Five'];
  const slotTimes = [
    '09:00 AM', '11:00 AM', '01:00 PM', 
    '03:00 PM', '05:00 PM', '07:00 PM'
  ];
  const statuses = ['reserved', 'completed', 'cancelled'];

  for (let i = 0; i < count; i++) {
    const randomDays = Math.floor(Math.random() * 365);
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + randomDays);
    
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    baseDate.setHours(randomHours, randomMinutes);
    
    const randomUserIndex = Math.floor(Math.random() * userIds.length);
    const randomSlotTime = slotTimes[Math.floor(Math.random() * slotTimes.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const bookings = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, idx) => ({
      bookedAt: new Date(baseDate.getTime() + (idx * 30 * 60 * 1000)).toISOString(),
      pin: Math.floor(1000 + Math.random() * 9000),
      slotTime: randomSlotTime,
      status: randomStatus,
      userId: userIds[randomUserIndex],
      userName: userNames[randomUserIndex]
    }));
    
    const revenue = bookings
      .filter(booking => booking.status === 'completed')
      .map(booking => ({
        amount: parseFloat((20 + Math.random() * 80).toFixed(2)),
        date: booking.bookedAt,
        kWh: (10 + Math.random() * 30).toFixed(2),
        userId: booking.userId
      }));
    
    mockRecords.push({
      address: "Your Current Location",
      bookings,
      createdAt: new Date().toISOString(),
      id: `location_${i}`,
      isZyntra: true,
      location: {
        lat: 11.03054306673987 + (Math.random() * 0.01 - 0.005),
        lng: 76.93841992944145 + (Math.random() * 0.01 - 0.005),
        name: "Zyntra Mobile Charger",
        phone: "+91 1800 123 4567",
        rating: 4.9 - (Math.random() * 0.2)
      },
      revenue,
      totalRevenue: revenue.reduce((sum, r) => sum + r.amount, 0),
      user_ratings_total: 1200 + Math.floor(Math.random() * 100)
    });
  }
  
  return mockRecords;
};

const addMockDataToFirestore = async () => {
  try {
    const mockData = generateMockData(100);
    const collectionRef = collection(db, 'zyntra_user_location');
    
    for (const data of mockData) {
      await addDoc(collectionRef, data);
      console.log(`Added document with ID: ${data.id}`);
    }
    
    console.log('Successfully added 100 mock records!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding mock data:', error);
    process.exit(1);
  }
};

// Run the function
addMockDataToFirestore();