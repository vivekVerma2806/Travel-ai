import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/User.js";
import Trip from "./models/Trip.js";
import Booking from "./models/Booking.js";
import Message from "./models/Message.js";
import Notification from "./models/Notification.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/travelai";

async function seedDatabase() {
    console.log("==========================================");
    console.log("🌱 Starting TravelAI Database Seeding");
    console.log("📡 Connecting to MongoDB at:", MONGO_URI);
    console.log("==========================================");

    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected Successfully");

        // Clear existing data
        console.log("🧹 Clearing existing collections...");
        await Promise.all([
            User.deleteMany({}),
            Trip.deleteMany({}),
            Booking.deleteMany({}),
            Message.deleteMany({}),
            Notification.deleteMany({}),
        ]);
        console.log("✨ Cleared existing users, trips, bookings, messages, and notifications.");

        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const adminPasswordHash = await bcrypt.hash("Admin@123", salt);
        const organiserPasswordHash = await bcrypt.hash("Organiser@123", salt);
        const userPasswordHash = await bcrypt.hash("User@123", salt);

        // 1. Create Users
        console.log("👤 Creating seed users...");
        const users = await User.insertMany([
            {
                username: "admin",
                email: "admin@travelai.com",
                password: adminPasswordHash,
                role: "admin",
                isVerified: true,
                bio: "Platform Administrator & Travel Curator. Oversees verified trips and community standards.",
                phone: "+1 555-0100",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                favorites: []
            },
            {
                username: "sarah_explorer",
                email: "organiser@travelai.com",
                password: organiserPasswordHash,
                role: "organiser",
                isVerified: true,
                bio: "Certified Alpine & Asian Cultural Tour Organiser. 8+ years leading group expeditions.",
                phone: "+1 555-0144",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
                favorites: []
            },
            {
                username: "alex_traveler",
                email: "user@travelai.com",
                password: userPasswordHash,
                role: "user",
                isVerified: true,
                bio: "Backpacker, urban explorer, and street food photographer.",
                phone: "+1 555-0188",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
                favorites: []
            },
            {
                username: "elena_wander",
                email: "elena@travelai.com",
                password: userPasswordHash,
                role: "user",
                isVerified: true,
                bio: "Weekend wanderer and architecture admirer.",
                phone: "+1 555-0199",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=80",
                favorites: []
            },
            {
                username: "pending_traveler",
                email: "pending@travelai.com",
                password: userPasswordHash,
                role: "user",
                isVerified: false, // For testing admin approval flow
                bio: "New community applicant waiting for verification.",
                phone: "+1 555-0200",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
                favorites: []
            }
        ]);

        const adminUser = users.find(u => u.username === "admin");
        const organiserUser = users.find(u => u.username === "sarah_explorer");
        const alexUser = users.find(u => u.username === "alex_traveler");
        const elenaUser = users.find(u => u.username === "elena_wander");

        // 2. Create Trips
        console.log("✈️ Creating seed trips with rich itinerary data...");

        const tokyoTripData = {
            locationInfo: {
                lat: 35.6762,
                lng: 139.6503,
                displayName: "Tokyo, Japan",
                type: "city",
                photoUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80"
            },
            hotels: [
                {
                    hotelName: "Hotel Gracery Shinjuku",
                    address: "1-19-1 Kabukicho, Shinjuku City, Tokyo",
                    price: "$140-$220 per night",
                    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80",
                    geoCoordinates: { lat: 35.6953, lng: 139.7022 },
                    rating: "4.7",
                    description: "Modern hotel in the vibrant Shinjuku district, famous for the iconic Godzilla head.",
                    amenities: ["Free WiFi", "City View", "Restaurant", "24/7 Front Desk"]
                },
                {
                    hotelName: "Keio Plaza Hotel Tokyo",
                    address: "2-2-1 Nishi-Shinjuku, Shinjuku City, Tokyo",
                    price: "$200-$350 per night",
                    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80",
                    geoCoordinates: { lat: 35.6897, lng: 139.6923 },
                    rating: "4.8",
                    description: "Upscale high-rise hotel featuring panoramic views and luxury amenities.",
                    amenities: ["Pool", "Free WiFi", "Spa", "Fitness Center"]
                }
            ],
            itinerary: [
                {
                    day: 1,
                    theme: "Historic Asakusa & Tradition",
                    places: [
                        {
                            placeName: "Senso-ji Temple",
                            details: "Tokyo's oldest and most significant ancient Buddhist temple located in Asakusa.",
                            imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: 35.7148, lng: 139.7967 },
                            ticketPricing: "Free",
                            rating: "4.8",
                            travelTime: "15 min from center",
                            bestTimeToVisit: "Morning (Less crowd)"
                        },
                        {
                            placeName: "Nakamise Shopping Street",
                            details: "Vibrant shopping street packed with traditional souvenirs, matcha ice cream, and snacks.",
                            imageUrl: "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: 35.7126, lng: 139.7966 },
                            ticketPricing: "Free",
                            rating: "4.6",
                            travelTime: "2 min walk",
                            bestTimeToVisit: "11:00 AM - 4:00 PM"
                        }
                    ]
                },
                {
                    day: 2,
                    theme: "Modern Neon & Shibuya Crossing",
                    places: [
                        {
                            placeName: "Shibuya Scramble Crossing",
                            details: "The world's busiest pedestrian intersection, a breathtaking symbol of modern Tokyo.",
                            imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: 35.6595, lng: 139.7004 },
                            ticketPricing: "Free",
                            rating: "4.9",
                            travelTime: "20 min from center",
                            bestTimeToVisit: "Evening (Neon Lights)"
                        },
                        {
                            placeName: "Meiji Shrine & Yoyogi Park",
                            details: "Tranquil Shinto shrine surrounded by an evergreen forest right next to Harajuku.",
                            imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: 35.6764, lng: 139.6993 },
                            ticketPricing: "Free",
                            rating: "4.8",
                            travelTime: "10 min walk",
                            bestTimeToVisit: "Early Morning"
                        }
                    ]
                },
                {
                    day: 3,
                    theme: "Futuristic Digital Art & Odaiba Waterfront",
                    places: [
                        {
                            placeName: "teamLab Planets Tokyo",
                            details: "Immersive museum of digital artwork where visitors walk through water and digital light.",
                            imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: 35.6517, lng: 139.7891 },
                            ticketPricing: "$25-$35",
                            rating: "4.9",
                            travelTime: "25 min from center",
                            bestTimeToVisit: "1:00 PM - 5:00 PM"
                        }
                    ]
                }
            ],
            generatedAt: new Date().toISOString()
        };

        const parisTripData = {
            locationInfo: {
                lat: 48.8566,
                lng: 2.3522,
                displayName: "Paris, France",
                type: "city",
                photoUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=80"
            },
            hotels: [
                {
                    hotelName: "Hotel Le Grand Paris",
                    address: "Rue de Rivoli, 75001 Paris, France",
                    price: "$220-$400 per night",
                    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80",
                    geoCoordinates: { lat: 48.8606, lng: 2.3376 },
                    rating: "4.8",
                    description: "Exquisite boutique hotel nestled walking distance from the Louvre museum.",
                    amenities: ["Free WiFi", "Breakfast Included", "Concierge Service"]
                }
            ],
            itinerary: [
                {
                    day: 1,
                    theme: "Iconic Landmarks & The River Seine",
                    places: [
                        {
                            placeName: "Eiffel Tower",
                            details: "Wrought-iron lattice tower on the Champ de Mars, the defining symbol of Paris.",
                            imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: 48.8584, lng: 2.2945 },
                            ticketPricing: "$18-$30",
                            rating: "4.9",
                            travelTime: "20 min from center",
                            bestTimeToVisit: "Sunset or Evening"
                        },
                        {
                            placeName: "Louvre Museum",
                            details: "The world's largest art museum and a historic monument featuring the Mona Lisa.",
                            imageUrl: "https://images.unsplash.com/photo-1565099824688-e93eb20fe622?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: 48.8606, lng: 2.3376 },
                            ticketPricing: "$20",
                            rating: "4.8",
                            travelTime: "15 min",
                            bestTimeToVisit: "Morning"
                        }
                    ]
                }
            ],
            generatedAt: new Date().toISOString()
        };

        const swissTripData = {
            locationInfo: {
                lat: 46.6863,
                lng: 7.8632,
                displayName: "Interlaken, Switzerland",
                type: "town",
                photoUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&auto=format&fit=crop&q=80"
            },
            hotels: [
                {
                    hotelName: "Alpine Swiss Chalet Lodge",
                    address: "Bahnhofstrasse, 3800 Interlaken, Switzerland",
                    price: "$130-$210 per night",
                    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80",
                    geoCoordinates: { lat: 46.685, lng: 7.86 },
                    rating: "4.7",
                    description: "Cozy mountain lodge with panoramic views of Eiger, Mönch, and Jungfrau.",
                    amenities: ["Free WiFi", "Mountain Views", "Ski Storage"]
                }
            ],
            itinerary: [
                {
                    day: 1,
                    theme: "Lakes & Jungfrau Summit",
                    places: [
                        {
                            placeName: "Lake Brienz & Giessbach Falls",
                            details: "Crystal turquoise glacial lake surrounded by steep Alpine cliffs and waterfalls.",
                            imageUrl: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: 46.72, lng: 7.98 },
                            ticketPricing: "Free",
                            rating: "4.9",
                            travelTime: "25 min",
                            bestTimeToVisit: "Morning to Afternoon"
                        }
                    ]
                }
            ],
            generatedAt: new Date().toISOString()
        };

        const baliTripData = {
            locationInfo: {
                lat: -8.4095,
                lng: 115.1889,
                displayName: "Bali, Indonesia",
                type: "island",
                photoUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80"
            },
            hotels: [
                {
                    hotelName: "Ubud Valley Sanctuary Resort",
                    address: "Jl. Raya Ubud, Gianyar, Bali",
                    price: "$80-$160 per night",
                    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80",
                    geoCoordinates: { lat: -8.5, lng: 115.26 },
                    rating: "4.9",
                    description: "Lush tropical retreat overlooking emerald rice terraces and sacred springs.",
                    amenities: ["Infinity Pool", "Yoga Shala", "Organic Breakfast"]
                }
            ],
            itinerary: [
                {
                    day: 1,
                    theme: "Sacred Temples & Rice Terraces",
                    places: [
                        {
                            placeName: "Tegallalang Rice Terrace",
                            details: "Dramatic terraced hillside famous for its scenic beauty, swings, and irrigation system.",
                            imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&auto=format&fit=crop&q=80",
                            geoCoordinates: { lat: -8.43, lng: 115.28 },
                            ticketPricing: "$5",
                            rating: "4.8",
                            travelTime: "20 min",
                            bestTimeToVisit: "Sunrise"
                        }
                    ]
                }
            ],
            generatedAt: new Date().toISOString()
        };

        const trips = await Trip.insertMany([
            {
                userId: organiserUser._id,
                destination: "Tokyo, Japan",
                tripData: tokyoTripData,
                duration: 5,
                budget: "Standard",
                isPublic: true,
                status: "approved",
                capacity: 8,
                price: 1200,
                requestOrganiser: true,
                organiserStatus: "approved",
            },
            {
                userId: adminUser._id,
                destination: "Paris, France",
                tripData: parisTripData,
                duration: 4,
                budget: "Luxury",
                isPublic: true,
                status: "approved",
                capacity: 10,
                price: 1800,
                requestOrganiser: false,
                organiserStatus: "pending",
            },
            {
                userId: alexUser._id,
                destination: "Interlaken, Switzerland",
                tripData: swissTripData,
                duration: 3,
                budget: "Budget",
                isPublic: true,
                status: "approved",
                capacity: 6,
                price: 650,
                requestOrganiser: false,
                organiserStatus: "pending",
            },
            {
                userId: elenaUser._id,
                destination: "Bali, Indonesia",
                tripData: baliTripData,
                duration: 7,
                budget: "Standard",
                isPublic: true,
                status: "pending", // Pending admin review
                capacity: 12,
                price: 950,
                requestOrganiser: true,
                organiserStatus: "pending",
            }
        ]);

        const tokyoTrip = trips.find(t => t.destination.includes("Tokyo"));
        const parisTrip = trips.find(t => t.destination.includes("Paris"));
        const baliTrip = trips.find(t => t.destination.includes("Bali"));

        // Add favorites
        alexUser.favorites.push(tokyoTrip._id, parisTrip._id);
        await alexUser.save();

        // 3. Create Bookings / Join Requests
        console.log("🎫 Creating seed bookings & join requests...");
        await Booking.insertMany([
            {
                userId: alexUser._id,
                destination: tokyoTrip.destination,
                tripId: tokyoTrip._id,
                hotelName: "Hotel Gracery Shinjuku",
                price: "$140",
                userName: alexUser.username,
                userEmail: alexUser.email,
                status: "approved", // Approved member of Tokyo trip
            },
            {
                userId: elenaUser._id,
                destination: tokyoTrip.destination,
                tripId: tokyoTrip._id,
                hotelName: "Keio Plaza Hotel Tokyo",
                price: "$200",
                userName: elenaUser.username,
                userEmail: elenaUser.email,
                status: "approved", // Approved member of Tokyo trip
            },
            {
                userId: alexUser._id,
                destination: parisTrip.destination,
                tripId: parisTrip._id,
                hotelName: "Hotel Le Grand Paris",
                price: "$220",
                userName: alexUser.username,
                userEmail: alexUser.email,
                status: "pending", // Pending join request for testing admin/creator approval
            }
        ]);

        // 4. Create Group Messages for Tokyo Trip Chat
        console.log("💬 Creating seed group chat messages...");
        await Message.insertMany([
            {
                tripId: tokyoTrip._id,
                userId: organiserUser._id,
                username: organiserUser.username,
                message: "Konnichiwa everyone! 🌸 Welcome to the Tokyo Expedition. Feel free to ask questions here.",
                type: "text",
                createdAt: new Date(Date.now() - 3600000 * 2)
            },
            {
                tripId: tokyoTrip._id,
                userId: alexUser._id,
                username: alexUser.username,
                message: "Super excited! Looking forward to the teamLab digital art exhibit.",
                type: "text",
                createdAt: new Date(Date.now() - 3600000)
            },
            {
                tripId: tokyoTrip._id,
                userId: elenaUser._id,
                username: elenaUser.username,
                message: "Count me in! I also booked our morning tea ceremony slot in Asakusa 🍵",
                type: "text",
                createdAt: new Date(Date.now() - 1800000)
            }
        ]);

        // 5. Create Notifications
        console.log("🔔 Creating seed notifications...");
        await Notification.insertMany([
            {
                userId: alexUser._id,
                type: "booking_status",
                message: "Your join request for Tokyo, Japan has been approved by the organiser!",
                link: `/view-trip/${tokyoTrip._id}`,
                isRead: false
            },
            {
                userId: organiserUser._id,
                type: "booking_request",
                message: `New join request from ${alexUser.username} for Tokyo, Japan`,
                link: "/organiser",
                isRead: false
            },
            {
                userId: adminUser._id,
                type: "system",
                message: `New trip awaiting approval: Bali, Indonesia by ${elenaUser.username}`,
                link: "/admin",
                isRead: false
            }
        ]);

        console.log("==========================================");
        console.log("🎉 DATABASE SEEDED SUCCESSFULLY!");
        console.log("==========================================");
        console.log("\n🔑 SEED CREDENTIALS FOR TESTING:\n");
        console.log("👑 ADMIN ACCOUNT:");
        console.log("   Email:    admin@travelai.com");
        console.log("   Password: Admin@123");
        console.log("   Role:     admin (Has access to /admin moderation dashboard)\n");
        console.log("🎒 ORGANISER ACCOUNT:");
        console.log("   Email:    organiser@travelai.com");
        console.log("   Password: Organiser@123");
        console.log("   Role:     organiser (Has access to /organiser management portal)\n");
        console.log("👤 REGULAR USER ACCOUNT:");
        console.log("   Email:    user@travelai.com");
        console.log("   Password: User@123");
        console.log("   Role:     user (Has approved membership in Tokyo trip chat)\n");
        console.log("👤 REGULAR USER 2:");
        console.log("   Email:    elena@travelai.com");
        console.log("   Password: User@123\n");
        console.log("⏳ PENDING VERIFICATION USER:");
        console.log("   Email:    pending@travelai.com");
        console.log("   Password: User@123 (For testing admin approval)\n");
        console.log("==========================================");

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed with error:", error);
        process.exit(1);
    }
}

seedDatabase();
