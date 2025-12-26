# Senior Frontend Portfolio Dashboard

A modern, feature-rich React dashboard application showcasing advanced frontend development skills including authentication, role-based access control, theming, and responsive design.

## Features

- **Authentication System** - Login and registration with validation
- **Dashboard** - Analytics widgets with key metrics
- **User Management** - Full CRUD operations for users
- **Settings** - Profile management, password change, and 2FA setup
- **Dark/Light Theme** - Toggle between themes with CSS variables
- **Toast Notifications** - User-friendly feedback system
- **Search & Filter** - Advanced filtering with debounced search
- **Role-Based Access Control** - Admin, Editor, and Viewer roles
- **Responsive Design** - Mobile-friendly with collapsible sidebar
- **State Management** - Zustand with localStorage persistence

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Navigation
- **Zustand** - State management
- **Axios** - API requests
- **Lucide React** - Icons
- **QRCode.react** - 2FA QR code generation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/rashcyber/senior-frontend-portfolio.git
cd senior-frontend-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Demo Credentials

This is a demo application with flexible authentication:

| Method | Credentials |
|--------|-------------|
| **Quick Demo** | Any valid email + password (6+ characters) |
| **Example** | Email: `demo@example.com` / Password: `password123` |

You can also **register a new account** by clicking "Don't have an account? Sign Up" on the login page.

## User Roles

The app includes a role-based permission system. You can switch roles in **Settings > User Role & Permissions**:

| Role | Permissions |
|------|-------------|
| **Admin** | Create, Read, Update, Delete, Manage Users |
| **Editor** | Create, Read, Update |
| **Viewer** | Read only |

## Project Structure

```
src/
├── api/              # API configuration
├── components/       # Reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── FilterPanel.jsx
│   ├── Input.jsx
│   ├── Layout.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   ├── RoleBadge.jsx
│   ├── Sidebar.jsx
│   ├── Table.jsx
│   ├── Toast.jsx
│   └── ...
├── hooks/            # Custom React hooks
│   ├── useDebounce.js
│   └── useFetch.js
├── pages/            # Page components
│   ├── Analytics.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Settings.jsx
│   └── Users.jsx
├── store/            # Zustand state stores
│   ├── useAppStore.js
│   ├── useAuthStore.js
│   └── useToastStore.js
└── styles/           # CSS stylesheets
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Features Breakdown

### Authentication
- Email/password login with validation
- User registration with password strength requirements
- Show/hide password toggle
- Persistent sessions with localStorage

### User Management
- View all users (API + locally added)
- Add new users with form validation
- Edit existing local users
- Delete users with confirmation modal
- Search users by name, email, or phone
- Filter by status (New/Existing) and source (Local/API)

### Settings
- Update profile information
- Change password with current password verification
- Enable Two-Factor Authentication (2FA) with QR code
- Switch between light/dark themes
- Change user roles (demo mode)

### Security Features
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- Role-based UI element visibility
- Protected routes for authenticated users

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**rashcyber**

---

Built with React + Vite
