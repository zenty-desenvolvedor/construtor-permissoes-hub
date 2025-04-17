
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { api } from '@/services/api';
import { Module, Permission, UserType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Save, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface PermissionTableRow {
  moduleId: string;
  moduleName: string;
  canAccess: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  existingPermissionId?: string;
  isDirty: boolean;
}

export default function PermissionManagement() {
  const { hasPermission } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUserTypeId = searchParams.get('userTypeId') || '';
  
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedUserTypeId, setSelectedUserTypeId] = useState<string>(initialUserTypeId);
  const [permissionRows, setPermissionRows] = useState<PermissionTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const canEdit = hasPermission('4', 'edit');
  
  useEffect(() => {
    Promise.all([
      api.getUserTypes(),
      api.getModules()
    ]).then(([userTypesData, modulesData]) => {
      setUserTypes(userTypesData);
      setModules(modulesData);
      
      if (!selectedUserTypeId && userTypesData.length > 0) {
        setSelectedUserTypeId(userTypesData[0].id);
      }
      
      setIsLoading(false);
    }).catch(error => {
      console.error('Error loading initial data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados necessários."
      });
      setIsLoading(false);
    });
  }, []);
  
  useEffect(() => {
    if (selectedUserTypeId) {
      loadPermissions(selectedUserTypeId);
    }
  }, [selectedUserTypeId, modules]);
  
  const loadPermissions = async (userTypeId: string) => {
    try {
      setIsLoading(true);
      
      const permissions = await api.getPermissionsByUserType(userTypeId);
      
      // Create a row for each module
      const rows: PermissionTableRow[] = modules.map(module => {
        const existingPermission = permissions.find(p => p.moduleId === module.id);
        
        return {
          moduleId: module.id,
          moduleName: module.moduleName,
          canAccess: existingPermission?.canAccess || false,
          canCreate: existingPermission?.canCreate || false,
          canEdit: existingPermission?.canEdit || false,
          canDelete: existingPermission?.canDelete || false,
          existingPermissionId: existingPermission?.id,
          isDirty: false
        };
      });
      
      setPermissionRows(rows);
    } catch (error) {
      console.error('Error loading permissions:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar permissões",
        description: "Não foi possível carregar as permissões para este tipo de usuário."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePermissionChange = (
    index: number, 
    field: 'canAccess' | 'canCreate' | 'canEdit' | 'canDelete',
    value: boolean
  ) => {
    // Handle special logic for canAccess
    if (field === 'canAccess' && value === false) {
      // If turning off access, also turn off all other permissions
      setPermissionRows(prev => {
        const newRows = [...prev];
        newRows[index] = {
          ...newRows[index],
          canAccess: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          isDirty: true
        };
        return newRows;
      });
    } else if (field !== 'canAccess' && value === true) {
      // If turning on any permission, make sure canAccess is also turned on
      setPermissionRows(prev => {
        const newRows = [...prev];
        newRows[index] = {
          ...newRows[index],
          [field]: value,
          canAccess: true, // Ensure canAccess is true if any permission is granted
          isDirty: true
        };
        return newRows;
      });
    } else {
      // Normal case: just update the specific permission
      setPermissionRows(prev => {
        const newRows = [...prev];
        newRows[index] = {
          ...newRows[index],
          [field]: value,
          isDirty: true
        };
        return newRows;
      });
    }
  };
  
  const handleSavePermissions = async () => {
    try {
      setIsSaving(true);
      
      // Filter only changed permissions
      const changedRows = permissionRows.filter(row => row.isDirty);
      
      if (changedRows.length === 0) {
        toast({
          title: "Nenhuma alteração",
          description: "Não foram detectadas alterações nas permissões."
        });
        setIsSaving(false);
        return;
      }
      
      // Prepare permissions to save
      const promises = changedRows.map(row => {
        const permission: Omit<Permission, 'id'> = {
          userTypeId: selectedUserTypeId,
          moduleId: row.moduleId,
          canAccess: row.canAccess,
          canCreate: row.canCreate,
          canEdit: row.canEdit,
          canDelete: row.canDelete
        };
        
        if (row.existingPermissionId) {
          return api.updatePermission({
            ...permission,
            id: row.existingPermissionId
          });
        } else {
          return api.createPermission(permission);
        }
      });
      
      await Promise.all(promises);
      
      toast({
        title: "Permissões salvas",
        description: "As permissões foram atualizadas com sucesso."
      });
      
      // Reload permissions to refresh the UI
      await loadPermissions(selectedUserTypeId);
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar permissões",
        description: "Não foi possível salvar as permissões."
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const getSelectedUserTypeName = () => {
    const userType = userTypes.find(ut => ut.id === selectedUserTypeId);
    return userType ? userType.typeName : 'Selecione um tipo';
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Permissões</h1>
          <p className="text-muted-foreground">
            Configure permissões por tipo de usuário e módulo
          </p>
        </div>
        
        {canEdit && permissionRows.some(row => row.isDirty) && (
          <Button 
            onClick={handleSavePermissions} 
            className="bg-construction-primary hover:bg-construction-secondary"
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar Permissões'}
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="space-y-2 flex-1 max-w-xs">
          <label htmlFor="userType" className="text-sm font-medium">
            Tipo de Usuário
          </label>
          <Select
            value={selectedUserTypeId}
            onValueChange={setSelectedUserTypeId}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um tipo de usuário" />
            </SelectTrigger>
            <SelectContent>
              {userTypes.map(userType => (
                <SelectItem key={userType.id} value={userType.id}>
                  {userType.typeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="self-end"
          onClick={() => loadPermissions(selectedUserTypeId)}
          disabled={isLoading || !selectedUserTypeId}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Módulo</TableHead>
              <TableHead className="text-center">Pode Acessar</TableHead>
              <TableHead className="text-center">Pode Cadastrar</TableHead>
              <TableHead className="text-center">Pode Editar</TableHead>
              <TableHead className="text-center">Pode Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando permissões...
                </TableCell>
              </TableRow>
            ) : permissionRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhum módulo encontrado para configurar permissões
                </TableCell>
              </TableRow>
            ) : (
              permissionRows.map((row, index) => (
                <TableRow key={row.moduleId} className={row.isDirty ? 'bg-construction-light/30' : ''}>
                  <TableCell className="font-medium">
                    {row.moduleName}
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.canAccess}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(index, 'canAccess', checked === true)
                      }
                      disabled={!canEdit}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.canCreate}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(index, 'canCreate', checked === true)
                      }
                      disabled={!canEdit || !row.canAccess}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.canEdit}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(index, 'canEdit', checked === true)
                      }
                      disabled={!canEdit || !row.canAccess}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={row.canDelete}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(index, 'canDelete', checked === true)
                      }
                      disabled={!canEdit || !row.canAccess}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {canEdit && permissionRows.some(row => row.isDirty) && (
        <div className="bg-construction-light p-4 rounded-lg border flex items-center justify-between">
          <div>
            <p className="font-medium">Alterações não salvas</p>
            <p className="text-sm text-muted-foreground">
              Há alterações nas permissões que precisam ser salvas.
            </p>
          </div>
          <Button 
            onClick={handleSavePermissions} 
            className="bg-construction-primary hover:bg-construction-secondary"
            disabled={isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar Permissões'}
          </Button>
        </div>
      )}
      
      <div className="bg-construction-light p-4 rounded-lg border">
        <h3 className="font-medium text-lg mb-2">
          Permissões para {getSelectedUserTypeName()}
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure as permissões para cada módulo do sistema. As permissões são acumulativas,
          onde cada checkbox representa:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
          <li><span className="font-medium">Pode Acessar:</span> O usuário pode visualizar o módulo</li>
          <li><span className="font-medium">Pode Cadastrar:</span> O usuário pode criar novos registros no módulo</li>
          <li><span className="font-medium">Pode Editar:</span> O usuário pode modificar registros existentes no módulo</li>
          <li><span className="font-medium">Pode Excluir:</span> O usuário pode remover registros do módulo</li>
        </ul>
      </div>
    </div>
  );
}
