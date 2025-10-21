import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, UserRole, AuthState, LoginRequest } from '../types';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER_SUCCESS'; payload: { user: User; token: string } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isAuthenticated: false, user: null, token: null, role: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.user.role,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isAuthenticated: false, user: null, token: null, role: null };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, token: null, role: null };
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.user.role,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Check for stored auth data on app load
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch({ type: 'LOAD_USER_SUCCESS', payload: { user, token } });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      // For demo purposes, we'll simulate a login
      // In a real app, you'd call the actual API
      const mockUser: User = {
        userId: 1,
        username: credentials.username,
        email: credentials.username + '@school.com',
        passwordHash: '',
        role: credentials.username === 'admin' ? UserRole.Admin : 
              credentials.username === 'teacher' ? UserRole.Teacher :
              credentials.username === 'student' ? UserRole.Student : UserRole.Parent,
        linkedId: 1,
        status: 'Active'
      };

      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: mockUser, token: mockToken } });
      
      // Set teacher ID for API calls if user is a teacher
      if (mockUser.role === UserRole.Teacher) {
        apiService.setTeacherId(mockUser.linkedId || 1);
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};