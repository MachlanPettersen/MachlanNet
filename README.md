# 🏗️ machlan.net

Hey there! Welcome to my personal website's repository. This is where I play around with new ideas and show off what I can do. The site is built with React and TypeScript on the frontend, with a Node.js backend and MongoDB for data persistence.

## 🎨 Frontend (This Repo)

### Tech Stack
- **React** with **TypeScript** for type safety
- **Styled Components** for component-level styling
- **React Router** for navigation
- **React Query** for server state management
- **Phosphor Icons** because I love their icons

### Features
- 🌓 Dark/Light theme switching with smooth transitions
- ✍️ Interactive guestbook with canvas drawing
- 🎵 Real-time Spotify integration showing what I'm listening to
- 📱 Responsive design that works across all devices

### Key Components
- `ThemeContext`: Manages the application's theme state
- `GuestBook`: Interactive canvas component for visitors to leave their mark
- `NowPlaying`: Real-time Spotify integration component
- Custom styled components for consistent UI elements

### Environment Variables
```
REACT_APP_SPOTIFY_REFRESH_TOKEN=your_refresh_token
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret
```

## 🔧 Backend

### Tech Stack
- **Node.js** with **Express**
- **MongoDB** for data storage
- **JWT** for admin authentication

### API Endpoints
- `/api/signatures`: Guestbook signature management
  - GET: Fetch all signatures
  - POST: Create new signature
  - DELETE: Remove signature (admin only)
- `/api/suggestions`: Song suggestion management (Coming soon)
  - GET: Fetch all suggestions
  - POST: Create new suggestion
  - DELETE: Remove suggestion (admin only)

### Environment Variables
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=port_number
```

## 🗄️ Database

### MongoDB Collections
- `signatures`: Stores guestbook entries
- `suggestions`: Stores song suggestions

## 🚀 Deployment

The application is deployed on Render.com with the following configuration:

### Frontend
- Automatic deployments from the main branch
- Static site hosting
- My domain: machlan.net

### Backend
- Node.js environment
- Auto-scaling enabled
- API endpoint: https://machlannetbackend.onrender.com

## 🏃‍♂️ Running Locally

1. Clone the repository
```bash
git clone https://github.com/yourusername/machlan.net.git
cd machlan.net
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory and add your environment variables.

4. Start the development server
```bash
npm run dev
```

## 👋 Contributing

While this is primarily a personal project, I'm always open to suggestions and improvements! Feel free to:
- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by Machlan
