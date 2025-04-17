
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, AuthState, LoginCredentials, UserPermission } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Mock API functions - these would connect to your Spring Boot backend
const mockLogin = async (credentials: LoginCredentials) => {
  // This would be replaced with actual API call
  console.log('Login attempt with:', credentials);
  
  // Simulate API response - in a real app this would come from backend
  if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
    return {
      user: {
        id: '1',
        fullName: 'Admin User',
        username: 'admin',
        email: 'admin@example.com',
        userTypeId: '1',
        userType: {
          id: '1',
          typeName: 'Administrador'
        }
      },
      token: 'mock-jwt-token',
      permissions: [
        {
          moduleId: '1',
          moduleName: 'Usuários',
          canAccess: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        },
        {
          moduleId: '2',
          moduleName: 'Tipos de Usuário',
          canAccess: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        },
        {
          moduleId: '3',
          moduleName: 'Módulos',
          canAccess: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        },
        {
          moduleId: '4',
          moduleName: 'Permissões',
          canAccess: true,
          canCreate: true,
          canEdit: true,
          canDelete: true
        }
      ]
    };
  } else if (credentials.email === 'vendedor@example.com' && credentials.password === 'password') {
    return {
      user: {
        id: '2',
        fullName: 'Vendedor',
        username: 'vendedor',
        email: 'vendedor@example.com',
        userTypeId: '2',
        userType: {
          id: '2',
          typeName: 'Vendedor'
        }
      },
      token: 'mock-jwt-token',
      permissions: [
        {
          moduleId: '1',
          moduleName: 'Usuários',
          canAccess: true,
          canCreate: false,
          canEdit: false,
          canDelete: false
        },
        {
          moduleId: '5',
          moduleName: 'Vendas',
          canAccess: true,
          canCreate: true,
          canEdit: true,
          canDelete: false
        }
      ]
    };
  } else if (credentials.email === 'cliente@example.com' && credentials.password === 'password') {
    return {
      user: {
        id: '3',
        fullName: 'Cliente',
        username: 'cliente',
        email: 'cliente@example.com',
        userTypeId: '3',
        userType: {
          id: '3',
          typeName: 'Cliente'
        }
      },
      token: 'mock-jwt-token',
      permissions: [
        {
          moduleId: '6',
          moduleName: 'Pedidos',
          canAccess: true,
          canCreate: true,
          canEdit: false,
          canDelete: false
        }
      ]
    };
  }
  
  throw new Error('Credenciais inválidas');
};

const initialAuthState: AuthState = {
  user: null,
  token: null,
  permissions: [],
  isAuthenticated: false,
  isLoading: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Check for saved auth state in localStorage
    const savedAuth = localStorage.getItem('authState');
    return savedAuth ? JSON.parse(savedAuth) : initialAuthState;
  });

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await mockLogin(credentials);
      
      const newAuthState: AuthState = {
        user: response.user,
        token: response.token,
        permissions: response.permissions,
        isAuthenticated: true,
        isLoading: false
      };
      
      setAuthState(newAuthState);
      localStorage.setItem('authState', JSON.stringify(newAuthState));
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo, ${response.user.fullName}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({ ...initialAuthState, isLoading: false });
      
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Email ou senha inválidos.",
      });
      
      throw error;
    }
  };

  const logout = () => {
    setAuthState(initialAuthState);
    localStorage.removeItem('authState');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const hasPermission = (moduleId: string, action: 'access' | 'create' | 'edit' | 'delete'): boolean => {
    if (!authState.isAuthenticated) return false;
    
    const modulePermission = authState.permissions.find(p => p.moduleId === moduleId);
    if (!modulePermission) return false;
    
    switch (action) {
      case 'access':
        return modulePermission.canAccess;
      case 'create':
        return modulePermission.canCreate;
      case 'edit':
        return modulePermission.canEdit;
      case 'delete':
        return modulePermission.canDelete;
      default:
        return false;
    }
  };

  const value: AuthContextType = {
    authState,
    login,
    logout,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
