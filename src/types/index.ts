
export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  userTypeId: string;
  userType?: UserType;
}

export interface UserType {
  id: string;
  typeName: string;
}

export interface Module {
  id: string;
  moduleName: string;
}

export interface Permission {
  id: string;
  userTypeId: string;
  moduleId: string;
  canAccess: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  module?: Module;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  permissions: UserPermission[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UserPermission {
  moduleId: string;
  moduleName: string;
  canAccess: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (moduleId: string, action: 'access' | 'create' | 'edit' | 'delete') => boolean;
}
