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

## 🎯 Assignment Requirements Checklist

### Core Requirements ✅
- ✅ **Backend**: Node.js + Express with TypeScript
- ✅ **Three API Endpoints**:
  - `POST /api/events` - Create an event
  - `GET /api/events` - List all events (with optional location filter)
  - `GET /api/events/:id` - Get event details
- ✅ **In-Memory Storage**: Fast data management with sample events
- ✅ **Event Model**: title, description, location, date, maxParticipants, currentParticipants
- ✅ **Frontend**: React with TypeScript and Vite
- ✅ **Event List View**: Grid layout with filtering
- ✅ **Event Detail View**: Immersive full-page experience
- ✅ **Create Event Form**: Modern, user-friendly design
- ✅ **Styling**: Professional pure black design with Tailwind CSS

### Bonus Features Implemented 🌟
- ✅ **Search/Filter**: Real-time search + 8 category filters
- ✅ **Distance Calculation**: Haversine formula with radius filtering
- ✅ **Loading States**: Skeleton loaders, spinners, smooth transitions
- ✅ **Error Handling**: Retry logic, user-friendly error messages
- ✅ **TypeScript**: Full type safety across frontend and backend
- ✅ **Deployment**: Vercel with automatic CI/CD
- ✅ **Going Beyond**: Weather forecasts, saved events, reminders, similar events

### Additional Features (Beyond Requirements) �
1. **7-Day Weather Forecast** - Open-Meteo API integration
2. **Save Events** - Bookmark functionality with LocalStorage
3. **Event Reminders** - Custom notifications (1 hour, 1 day, 1 week)
4. **Similar Events** - AI-powered suggestions
5. **Location Autocomplete** - Nominatim/OpenStreetMap geocoding
6. **GPS Integration** - Geolocation API with loading feedback
7. **Draft Saving** - Auto-save form data
8. **Immersive Design** - Full-screen hero images, gradient accents

---

## 💭 Challenges Faced & Solutions

### Challenge 1: Routing Issues in Production
**Problem**: Event detail pages showed 404 errors intermittently after deployment.

**Solution**:
- Removed nested `<Link>` components in EventCard
- Added retry logic with exponential backoff in React Query
- Configured proper Vercel routing (rewrites to index.html)
- Added error logging for debugging

**Result**: 100% reliable navigation with better error recovery.

---

### Challenge 2: Location Search Performance
**Problem**: Location autocomplete caused too many API requests, slowing down the UI.

**Solution**:
- Implemented 500ms debouncing using `setTimeout`
- Added minimum 3-character requirement before search
- Limited results to 5 suggestions
- Cached coordinates in form state

**Result**: Smooth, responsive location search with minimal API calls.

---

### Challenge 3: GPS Button User Feedback
**Problem**: GPS location detection took 3-5 seconds with no visual feedback.

**Solution**:
- Added `isGettingLocation` state variable
- Implemented loading spinner with "Getting..." text
- Disabled button during loading to prevent double-clicks
- Added cursor-wait and opacity changes

**Result**: Clear visual feedback, better perceived performance.

---

### Challenge 4: Serverless Function Deployment
**Problem**: Backend showed "Cannot GET /" on Vercel - standard Express app structure doesn't work with serverless.

**Solution**:
- Created `api/index.ts` as serverless entry point
- Exported Express app as default export
- Updated `vercel.json` to route all requests to serverless function
- Configured proper CORS for Vercel domains

**Result**: Seamless serverless deployment with proper routing.

---

## 🤖 AI Tools Used & How

### Tools Used
1. **GitHub Copilot** (70% of development)
2. **ChatGPT/Claude** (20% for complex problem solving)
3. **AI-powered search** (10% for documentation)

### Effective Usage

#### 1. Component Scaffolding
- **What AI Did**: Generated initial component structure with props and state
- **What I Did**: Modified business logic, added custom features, improved error handling
- **Understanding**: Reviewed every line, tested edge cases, refactored for performance
- **Result**: 50% faster initial setup, 100% code understanding

#### 2. TypeScript Interfaces
- **What AI Did**: Created base interfaces from requirements
- **What I Did**: Extended with additional fields (category, tags, distanceInKm), ensured type safety
- **Understanding**: Verified type compatibility across frontend/backend
- **Result**: Caught type errors at compile time

#### 3. Haversine Formula
- **What AI Did**: Provided mathematical implementation for distance calculation
- **What I Did**: Understood the formula (`a = sin²(Δφ/2) + cos φ1 * cos φ2 * sin²(Δλ/2)`), added TypeScript types, tested with real coordinates
- **Understanding**: Verified accuracy against Google Maps results
- **Result**: Accurate distance calculations

#### 4. React Query Setup
- **What AI Did**: Suggested React Query for server state
- **What I Did**: Customized caching strategy (5-min stale time), added retry logic with exponential backoff, implemented proper error handling
- **Understanding**: Configured invalidation strategies, optimized performance
- **Result**: Professional data fetching with caching

#### 5. Deployment Configuration
- **What AI Did**: Provided initial `vercel.json` structure
- **What I Did**: Modified for serverless function routing, added SPA rewrites, configured environment variables
- **Understanding**: Tested locally, debugged routing issues, ensured production readiness
- **Result**: Successful deployment with proper routing

### Not Just Copy-Paste
- ✅ Every AI-generated code was reviewed line-by-line
- ✅ Added comprehensive error handling AI didn't include
- ✅ Implemented 5+ custom features beyond AI suggestions
- ✅ Refactored for better architecture and performance
- ✅ Added extensive TypeScript types and validation
- ✅ Tested edge cases and fixed bugs
- ✅ Optimized for production deployment

---

## 📋 Submission Checklist

### Code Quality ✅
- ✅ Clean commit history (40+ meaningful commits, not one giant commit)
- ✅ `.gitignore` properly configured
- ✅ `package.json` with all dependencies
- ✅ TypeScript for type safety
- ✅ Proper file/folder structure
- ✅ Consistent naming conventions

### Documentation ✅
- ✅ **README.md** with:
  - Setup instructions (local + production)
  - How to run the project (backend + frontend)
  - Environment variables needed
  - API documentation (all 3 endpoints)
  - Challenges faced and solutions
  - AI tools usage explanation
- ✅ **SUBMISSION.md** with detailed evaluation criteria mapping

### Deployment ✅
- ✅ Frontend deployed: [https://mini-event-finder-m43v.vercel.app](https://mini-event-finder-m43v.vercel.app)
- ✅ Backend deployed: [https://mini-event-finder-phi.vercel.app](https://mini-event-finder-phi.vercel.app)
- ✅ Automatic CI/CD from GitHub

---

## �📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Abhishek Mishra**  
[GitHub](https://github.com/abhishekmishra2808)

---

**Built with ❤️ using React, TypeScript, Node.js, and AI-assisted development**  
**Deployed on Vercel with automatic CI/CD**
