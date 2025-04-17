
import { LoginCredentials, Module, Permission, User, UserType } from '@/types';

// This is a mock API service. In a real application, you'd connect to your Spring Boot backend
// using fetch, axios, or another HTTP client.

// Mock data
const mockModules: Module[] = [
  { id: '1', moduleName: 'Usuários' },
  { id: '2', moduleName: 'Tipos de Usuário' },
  { id: '3', moduleName: 'Módulos' },
  { id: '4', moduleName: 'Permissões' },
  { id: '5', moduleName: 'Vendas' },
  { id: '6', moduleName: 'Pedidos' },
  { id: '7', moduleName: 'Produtos' },
  { id: '8', moduleName: 'Clientes' }
];

const mockUserTypes: UserType[] = [
  { id: '1', typeName: 'Administrador' },
  { id: '2', typeName: 'Vendedor' },
  { id: '3', typeName: 'Cliente' }
];

const mockUsers: User[] = [
  { id: '1', fullName: 'Admin User', username: 'admin', email: 'admin@example.com', userTypeId: '1' },
  { id: '2', fullName: 'Vendedor', username: 'vendedor', email: 'vendedor@example.com', userTypeId: '2' },
  { id: '3', fullName: 'Cliente', username: 'cliente', email: 'cliente@example.com', userTypeId: '3' }
];

const mockPermissions: Permission[] = [
  // Admin permissions
  { id: '1', userTypeId: '1', moduleId: '1', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
  { id: '2', userTypeId: '1', moduleId: '2', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
  { id: '3', userTypeId: '1', moduleId: '3', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
  { id: '4', userTypeId: '1', moduleId: '4', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
  { id: '5', userTypeId: '1', moduleId: '5', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
  { id: '6', userTypeId: '1', moduleId: '6', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
  { id: '7', userTypeId: '1', moduleId: '7', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
  { id: '8', userTypeId: '1', moduleId: '8', canAccess: true, canCreate: true, canEdit: true, canDelete: true },
  
  // Seller permissions
  { id: '9', userTypeId: '2', moduleId: '1', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
  { id: '10', userTypeId: '2', moduleId: '5', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
  { id: '11', userTypeId: '2', moduleId: '6', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
  { id: '12', userTypeId: '2', moduleId: '7', canAccess: true, canCreate: false, canEdit: false, canDelete: false },
  { id: '13', userTypeId: '2', moduleId: '8', canAccess: true, canCreate: true, canEdit: true, canDelete: false },
  
  // Customer permissions
  { id: '14', userTypeId: '3', moduleId: '6', canAccess: true, canCreate: true, canEdit: false, canDelete: false },
  { id: '15', userTypeId: '3', moduleId: '7', canAccess: true, canCreate: false, canEdit: false, canDelete: false }
];

// API functions
export const api = {
  // Auth
  login: async (credentials: LoginCredentials) => {
    // This would be a real API call in your application
    console.log('API Login with:', credentials);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    // In a real app, you'd check password hash with BCrypt
    const isValidPassword = credentials.password === 'password';
    if (!isValidPassword) {
      throw new Error('Senha incorreta');
    }
    
    const userType = mockUserTypes.find(t => t.id === user.userTypeId);
    const userPermissions = mockPermissions
      .filter(p => p.userTypeId === user.userTypeId)
      .map(p => {
        const module = mockModules.find(m => m.id === p.moduleId);
        return {
          moduleId: p.moduleId,
          moduleName: module?.moduleName || 'Unknown Module',
          canAccess: p.canAccess,
          canCreate: p.canCreate,
          canEdit: p.canEdit,
          canDelete: p.canDelete
        };
      });
    
    return {
      user: { ...user, userType },
      token: 'mock-jwt-token',
      permissions: userPermissions
    };
  },
  
  // Users
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.map(user => ({
      ...user,
      userType: mockUserTypes.find(t => t.id === user.userTypeId)
    }));
  },
  
  createUser: async (user: Omit<User, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser = { ...user, id: String(mockUsers.length + 1) };
    mockUsers.push(newUser);
    return newUser;
  },
  
  // Updated: Changed the signature to accept a User object with ID included
  updateUser: async (user: User) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockUsers.findIndex(u => u.id === user.id);
    if (index !== -1) {
      mockUsers[index] = user;
      return user;
    }
    throw new Error('Usuário não encontrado');
  },
  
  deleteUser: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      const deletedUser = mockUsers[index];
      mockUsers.splice(index, 1);
      return deletedUser;
    }
    throw new Error('Usuário não encontrado');
  },
  
  // User Types
  getUserTypes: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockUserTypes];
  },
  
  createUserType: async (userType: Omit<UserType, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newUserType = { ...userType, id: String(mockUserTypes.length + 1) };
    mockUserTypes.push(newUserType);
    return newUserType;
  },
  
  updateUserType: async (userType: UserType) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUserTypes.findIndex(t => t.id === userType.id);
    if (index !== -1) {
      mockUserTypes[index] = userType;
      return userType;
    }
    throw new Error('Tipo de usuário não encontrado');
  },
  
  deleteUserType: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockUserTypes.findIndex(t => t.id === id);
    if (index !== -1) {
      const deletedType = mockUserTypes[index];
      mockUserTypes.splice(index, 1);
      return deletedType;
    }
    throw new Error('Tipo de usuário não encontrado');
  },
  
  // Modules
  getModules: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockModules];
  },
  
  createModule: async (module: Omit<Module, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newModule = { ...module, id: String(mockModules.length + 1) };
    mockModules.push(newModule);
    return newModule;
  },
  
  updateModule: async (module: Module) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockModules.findIndex(m => m.id === module.id);
    if (index !== -1) {
      mockModules[index] = module;
      return module;
    }
    throw new Error('Módulo não encontrado');
  },
  
  deleteModule: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockModules.findIndex(m => m.id === id);
    if (index !== -1) {
      const deletedModule = mockModules[index];
      mockModules.splice(index, 1);
      return deletedModule;
    }
    throw new Error('Módulo não encontrado');
  },
  
  // Permissions
  getPermissions: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPermissions.map(permission => ({
      ...permission,
      module: mockModules.find(m => m.id === permission.moduleId)
    }));
  },
  
  getPermissionsByUserType: async (userTypeId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPermissions
      .filter(p => p.userTypeId === userTypeId)
      .map(permission => ({
        ...permission,
        module: mockModules.find(m => m.id === permission.moduleId)
      }));
  },
  
  updatePermission: async (permission: Permission) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPermissions.findIndex(p => 
      p.userTypeId === permission.userTypeId && p.moduleId === permission.moduleId
    );
    
    if (index !== -1) {
      mockPermissions[index] = permission;
      return permission;
    } else {
      // If permission doesn't exist, create it
      const newPermission = { 
        ...permission, 
        id: String(mockPermissions.length + 1) 
      };
      mockPermissions.push(newPermission);
      return newPermission;
    }
  },
  
  createPermission: async (permission: Omit<Permission, 'id'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPermission = { 
      ...permission, 
      id: String(mockPermissions.length + 1) 
    };
    mockPermissions.push(newPermission);
    return newPermission;
  },
  
  deletePermission: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPermissions.findIndex(p => p.id === id);
    if (index !== -1) {
      const deletedPermission = mockPermissions[index];
      mockPermissions.splice(index, 1);
      return deletedPermission;
    }
    throw new Error('Permissão não encontrada');
  }
};
