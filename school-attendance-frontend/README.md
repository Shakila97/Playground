# School Attendance Management System - Frontend

A modern React frontend for the School Attendance Management System built with TypeScript, Vite, and Tailwind CSS.

## Features

- **Role-based Authentication**: Support for Admin, Teacher, Student, and Parent roles
- **Dashboard**: Personalized dashboard based on user role
- **Attendance Marking**: Teachers can mark attendance for their classes
- **Attendance Viewing**: View attendance records with filtering and search
- **Student Management**: Admin interface for managing student information
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Modern UI**: Clean and intuitive user interface with Lucide React icons

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons
- **Date-fns** for date utilities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env.local
```

3. Update the API URL in `.env.local`:
```
VITE_API_URL=http://localhost:7000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard components
│   ├── attendance/     # Attendance-related components
│   ├── students/       # Student management components
│   └── common/         # Shared components
├── contexts/           # React contexts (Auth, etc.)
├── services/           # API services
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## Demo Accounts

The application includes demo accounts for testing:

- **Admin**: `admin` / `password`
- **Teacher**: `teacher` / `password`
- **Student**: `student` / `password`
- **Parent**: `parent` / `password`

## API Integration

The frontend is designed to work with the .NET Web API backend. Make sure the backend is running on the configured port (default: 7000).

### Available Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/student/{id}` - Get student attendance
- `GET /api/attendance/class/{id}/date/{date}` - Get class attendance by date

## Features by Role

### Administrator
- View system-wide statistics
- Manage students
- Access all attendance records
- Export data

### Teacher
- Mark attendance for classes
- View attendance records
- Filter by class and date

### Student
- View personal attendance records
- Check attendance status

### Parent
- View child's attendance records
- Monitor attendance patterns

## Development Notes

- The application uses mock data for demonstration purposes
- In production, replace mock data with actual API calls
- Authentication tokens are stored in localStorage
- The app automatically redirects to login on token expiration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.