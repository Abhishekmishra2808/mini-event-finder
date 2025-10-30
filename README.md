# Mini Event Finder 🎉

A full-stack event discovery platform built with modern web technologies, featuring a clean Apple-inspired design philosophy. Discover, create, and manage local events with ease.

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
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd c:\Users\abhis\Desktop\Projects\assign
   ```

2. **Set up the Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend server will start on `http://localhost:3000`

3. **Set up the Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the application

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

The UI follows Apple's design principles:
- **Minimalism** - Clean, uncluttered interfaces
- **Clarity** - Clear typography and visual hierarchy
- **Depth** - Subtle shadows and hover effects
- **Smooth transitions** - Polished animations and interactions
- **Whitespace** - Generous spacing for better readability

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

## 🌍 Geolocation Features

The app includes smart location-based features:
- **Browser geolocation** - Get user's current position
- **Distance calculation** - Haversine formula for accurate distances
- **Radius filtering** - Find events within 5, 10, 25, 50, or 100 km
- **Distance display** - Shows km away on event cards
- **Location search** - Filter events by city/location name

## 📱 Screenshots & Features

### Home Page
- Grid layout of all events
- Live search bar for instant filtering
- Location enable/disable toggle
- Radius selector for distance filtering
- Loading states with spinner
- Error handling with clear messages

### Event Detail Page
- Full event information display
- Date and time formatting
- Location with coordinates
- Participant count with progress bar
- Available spots indicator
- Join event button (disabled when full)

### Create Event Page
- Clean form with validation
- Date/time picker
- Location finder (preset cities)
- Manual coordinate entry option
- Real-time form validation
- Success navigation to new event

## 🎯 Future Enhancements

- Google Places API integration for autocomplete
- User authentication and authorization
- Event registration/RSVP functionality
- User-uploaded images for events
- Social sharing features
- Email notifications
- Calendar integration (.ics export)
- Map view with event markers
- Persistent database (MongoDB/PostgreSQL)
- Real-time event updates (WebSocket)

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Developer Notes

- The backend uses in-memory storage, so data is lost on server restart
- Location finder uses preset cities (Dublin, London, Paris, New York, Tokyo)
- For production, integrate Google Places API for real geocoding
- All coordinates use WGS84 datum (standard GPS coordinates)
- Distances are calculated as the crow flies (straight-line distance)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

**Built with ❤️ using modern web technologies**
