# Mini Event Finder 🎉

A full-stack event discovery platform with a sleek pure black design. Discover, create, and manage local events with advanced features like weather forecasts, saved events, reminders, and location-based filtering.

**Live Demo**: [https://mini-event-finder-m43v.vercel.app](https://mini-event-finder-m43v.vercel.app)  
**API**: [https://mini-event-finder-phi.vercel.app](https://mini-event-finder-phi.vercel.app)

## 🌟 Features

### 🚀 5 Innovative Features

1. **⛅ 7-Day Weather Forecast** - See weather predictions for each event using Open-Meteo API
2. **💾 Save Events** - Bookmark your favorite events to a dedicated "Saved Events" page
3. **⏰ Event Reminders** - Set custom reminders (1 hour, 1 day, 1 week before) with local notifications
4. **🎯 Similar Events** - AI-powered similar event suggestions based on category and location
5. **📍 Location-Based Discovery** - Find events near you with radius filtering (5-100km)

### Backend (Node.js + Express + TypeScript)
- **RESTful API** with three main endpoints:
  - `POST /api/events` - Create new events
  - `GET /api/events/:id` - Get event details
  - `GET /api/events` - List events with intelligent filtering
- **Location-based filtering** using location name search
- **Distance calculation** using the Haversine formula
- **Radius filtering** to find events within a specific distance
- **In-memory storage** for fast, simple data management

### Frontend (React + TypeScript + Vite)
- **Pure black design** - Modern, sleek dark theme (#000000 background)
- **Hero images** - Category-specific Unsplash images on event cards
- **Immersive detail pages** - Full-width hero sections with overlaid titles
- **React Query** for seamless data fetching, caching, and state management
- **React Router** for smooth navigation
- **Tailwind CSS** for utility-first styling
- **Real-time search** - Filter events by title, description, or location
- **Category filtering** - 8 categories (Sports, Music, Tech, Food, Art, Networking, Education, Other)
- **Geolocation support** - Find events near you with loading animations
- **Distance display** - See how far events are from your location
- **Loading & error states** - Professional UX with skeleton loaders and error messages
- **Responsive design** - Works beautifully on all devices
- **Consistent card heights** - Flexbox layout ensures uniform grid appearance

## 🏗️ Project Structure

```
assign/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── events.ts          # Event API endpoints
│   │   ├── types/
│   │   │   └── event.types.ts     # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── distance.ts        # Haversine formula implementation
│   │   └── index.ts               # Express server setup
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── EventCard.tsx      # Reusable event card component
│   │   ├── pages/
│   │   │   ├── HomePage.tsx       # Event listing page
│   │   │   ├── EventDetailPage.tsx # Event details page
│   │   │   └── CreateEventPage.tsx # Event creation form
│   │   ├── services/
│   │   │   └── api.ts             # Axios API service layer
│   │   ├── types/
│   │   │   └── event.types.ts     # TypeScript interfaces
│   │   ├── App.tsx                # Main app component with routing
│   │   ├── main.tsx               # App entry point
│   │   └── index.css              # Tailwind styles
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   Server runs on `http://localhost:3000`

2. **Frontend Setup** (new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs on `http://localhost:5173`

### Deployment

Deployed on Vercel with automatic CI/CD from GitHub.

**Environment Variables:**
- Frontend: `VITE_API_URL` - API endpoint URL
- Backend: `FRONTEND_URL` - Frontend URL for CORS

## 📖 API Documentation

### Create Event
**POST** `/api/events`

Creates a new event with auto-generated ID and initialized participant count.

**Request Body:**
```json
{
  "title": "Summer Music Festival",
  "description": "An amazing outdoor music festival",
  "date": "2024-07-15T18:00:00",
  "maxParticipants": 100,
  "location": {
    "name": "Central Park, New York",
    "lat": 40.7829,
    "lng": -73.9654
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Summer Music Festival",
  "description": "An amazing outdoor music festival",
  "date": "2024-07-15T18:00:00",
  "maxParticipants": 100,
  "currentParticipants": 0,
  "location": {
    "name": "Central Park, New York",
    "lat": 40.7829,
    "lng": -73.9654
  }
}
```

### Get Event by ID
**GET** `/api/events/:id`

Retrieves a single event by its unique ID.

**Response:** `200 OK` or `404 Not Found`

### List Events
**GET** `/api/events`

Returns all events with optional filtering.

**Query Parameters:**
- `location` (optional) - Filter by location name
- `lat` (optional) - User's latitude for distance calculation
- `lng` (optional) - User's longitude for distance calculation
- `radius` (optional) - Maximum distance in kilometers (requires lat & lng)

**Examples:**
```
GET /api/events
GET /api/events?location=Dublin
GET /api/events?lat=53.3498&lng=-6.2603&radius=50
```

**Response:** `200 OK`
```json
[
  {
    "id": "...",
    "title": "...",
    "description": "...",
    "date": "...",
    "maxParticipants": 100,
    "currentParticipants": 25,
    "location": { ... },
    "distanceInKm": 12.5  // Only present when lat/lng provided
  }
]
```

## 🎨 Design Philosophy

- **Pure Black Theme** - Modern dark design with #000000 background
- **Visual Hierarchy** - 4-tier text color system for clarity
- **Hero Images** - Category-specific Unsplash images
- **Consistent Layout** - Uniform card heights with flexbox
- **Smooth Interactions** - Hover effects, scale transforms, loading states

## 🛠️ Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **UUID** - Unique ID generation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router v6** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and caching
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework



## 📱 Key Pages

- **Home** - Event grid with search, filters, and location-based discovery
- **Event Detail** - Immersive hero section with weather, reminders, and similar events
- **Create Event** - Form with location autocomplete and category selection
- **Saved Events** - Bookmarked events with quick access

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Abhishek Mishra**  
[GitHub](https://github.com/abhishekmishra2808)

---

**Built with ❤️ using React, TypeScript, Node.js, and deployed on Vercel**
