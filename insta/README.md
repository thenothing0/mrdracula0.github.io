# Instagram Hunter v5.1 - Web Application

A modern, powerful React-based web application for Instagram account hunting and email availability checking. Built with Vite, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Multi-Source Username Fetching**: GraphQL API, Instagram API, Search, and Followers
- **Email Availability Checking**: Hotmail, Outlook, Yahoo, and Gmail
- **Instagram Profile Analysis**: Followers, following, posts, verification status
- **Smart Scoring System**: Accounts scored from 0-100 based on multiple factors
- **Real-time Statistics**: Live dashboard with comprehensive metrics
- **Export Functions**: CSV and JSON export capabilities
- **Telegram Integration**: Option to send results to Telegram bot
- **Proxy Support**: Built-in proxy management for rate limiting

### Technical Features
- **Modern React**: Built with React 19 and TypeScript
- **Beautiful UI**: Tailwind CSS with gradient designs
- **State Management**: Context API with useReducer
- **Local Storage**: Persistent data storage in browser
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Live statistics and progress tracking
- **Multi-threading**: Simulated concurrent workers

## 📊 Statistics Tracked

- Total accounts checked
- Available emails found
- Instagram accounts found/not found
- Fetch success/failure rates
- Email provider counts (Yahoo, Outlook, Gmail)
- Best performing account
- Real-time speed metrics
- Elapsed time counter

## 🎯 Scoring System

Accounts are scored based on:
- **Follower Count**: 5-30 points
- **Account Age**: 0-25 points (older accounts score higher)
- **Email Availability**: 5 points per available email
- **Verification Status**: 10 points for verified accounts
- **Reset Email**: 15 points if reset email available
- **Public Account**: 3 points bonus

## 🛠️ Usage

### Getting Started

1. **Configure Settings**
   - Select email type (Hotmail, Outlook, Yahoo, or All)
   - Choose fetch method (GraphQL, API, Search, Followers, or All)
   - Set thread count (1-10)
   - Configure minimum followers filter
   - Enable/disable extra checks

2. **Start Hunting**
   - Click "🚀 Start Hunting" to begin
   - Monitor real-time statistics
   - View found accounts in results table

3. **Export Results**
   - Filter results by score, verification, etc.
   - Export to CSV or JSON format
   - Data persists in browser localStorage

### Settings Explained

- **Email Type**: Primary email provider to check
- **Check All Providers**: Also check other email providers
- **Fetch Method**: Source for finding usernames
- **Threads**: Number of concurrent workers (simulated)
- **Min Followers**: Filter accounts by follower count
- **Telegram**: Optional notifications to Telegram bot

## 🏗️ Architecture

### Components
- **Header**: App title and elapsed time
- **StatsDashboard**: Real-time statistics cards
- **ControlPanel**: Settings and action controls
- **ResultsTable**: Found accounts with filtering

### State Management
- **AppContext**: Global state using React Context
- **Reducer**: Handles all state updates
- **LocalStorage**: Persists data between sessions

### Utilities
- **hunter.ts**: Core hunting logic and mock APIs
- **Mock Data**: Realistic Instagram account simulation
- **Formatters**: Number formatting and display helpers

## 🔧 Technical Stack

- **React**: 19.2.3
- **TypeScript**: 5.9.3
- **Vite**: 7.2.4
- **Tailwind CSS**: 4.1.17
- **Node**: Built with Node.js support

## 🎯 Demo Mode

This application runs in demo mode with:
- Simulated API responses
- Mock Instagram data
- Realistic success/failure rates
- Full functionality for testing

## 📱 UI Features

- **Dark Gradients**: Professional appearance
- **Responsive Grid**: Adapts to screen size
- **Hover Effects**: Interactive elements
- **Status Indicators**: Visual feedback
- **Progress Bars**: Real-time progress
- **Filter Controls**: Easy data filtering

## 🚀 Performance

- **Efficient Rendering**: Optimized React components
- **Debounced Updates**: Smooth UI updates
- **Memory Management**: Automatic cleanup
- **Local Processing**: No server required

## 💾 Data Persistence

All data is stored in browser localStorage:
- Found accounts
- Application settings
- Statistics history
- Session state

## 📤 Export Formats

### CSV Export
Includes all account data:
- Username, Name, Followers, Following, Posts
- Created Date, Verification Status
- Email availability for all providers
- Reset email information
- Score and timestamp

### JSON Export
Complete account objects with all metadata

## 🎨 Design

Modern, professional interface with:
- Gradient backgrounds
- Card-based layout
- Consistent spacing
- Accessible colors
- Smooth transitions

## 🔒 Privacy

- No external API calls in demo mode
- All data stays in your browser
- No personal information collected
- Works offline after loading

## 🎯 Use Cases

- **Security Research**: Identify available usernames
- **Brand Protection**: Find similar account names
- **Marketing**: Analyze Instagram presence
- **Development**: Test Instagram integrations
- **Learning**: Understand web automation

## 📈 Future Enhancements

Potential features for production:
- Real Instagram API integration
- Advanced proxy rotation
- CAPTCHA solving
- Multi-account support
- Advanced filtering
- Historical data analysis
- Cloud synchronization

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open your browser and navigate to the displayed URL (usually http://localhost:5173)

## 🎯 Demo Experience

The current implementation provides a complete demo experience:
- Realistic Instagram account data
- Simulated API responses
- Full hunting workflow
- All features functional
- Export capabilities
- Persistent storage

Perfect for testing, learning, and demonstration purposes!
