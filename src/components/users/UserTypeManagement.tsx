
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { api } from '@/services/api';
import { UserType } from '@/types';
import { Plus, Pencil, Trash, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

export default function UserTypeManagement() {
  const { hasPermission } = useAuth();
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<UserType | null>(null);
  const [typeName, setTypeName] = useState('');
  
  const canCreate = hasPermission('2', 'create');
  const canEdit = hasPermission('2', 'edit');
  const canDelete = hasPermission('2', 'delete');
  const canManagePermissions = hasPermission('4', 'access');
  
  useEffect(() => {
    fetchUserTypes();
  }, []);
  
  const fetchUserTypes = async () => {
    try {
      setIsLoading(true);
      const data = await api.getUserTypes();
      setUserTypes(data);
    } catch (error) {
      console.error('Error fetching user types:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar tipos de usuário",
        description: "Não foi possível carregar a lista de tipos de usuário."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenDialog = (userType?: UserType) => {
    if (userType) {
      setCurrentUserType(userType);
      setTypeName(userType.typeName);
    } else {
      setCurrentUserType(null);
      setTypeName('');
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentUserType(null);
    setTypeName('');
  };
  
  const handleOpenDeleteDialog = (userType: UserType) => {
    setCurrentUserType(userType);
    setDeleteDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    try {
      if (typeName.trim() === '') {
        toast({
          variant: "destructive",
          title: "Nome inválido",
          description: "O nome do tipo de usuário não pode estar vazio."
        });
        return;
      }
      
      if (currentUserType) {
        // Update existing user type
        await api.updateUserType({
          ...currentUserType,
          typeName
        });
        toast({
          title: "Tipo de usuário atualizado",
          description: `O tipo de usuário ${typeName} foi atualizado com sucesso.`
        });
      } else {
        // Create new user type
        await api.createUserType({ typeName });
        toast({
          title: "Tipo de usuário criado",
          description: `O tipo de usuário ${typeName} foi criado com sucesso.`
        });
      }
      
      handleCloseDialog();
      fetchUserTypes();
    } catch (error) {
      console.error('Error saving user type:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o tipo de usuário."
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!currentUserType) return;
      
      await api.deleteUserType(currentUserType.id);
      toast({
        title: "Tipo de usuário excluído",
        description: `O tipo de usuário ${currentUserType.typeName} foi excluído com sucesso.`
      });
      
      setDeleteDialogOpen(false);
      setCurrentUserType(null);
      fetchUserTypes();
    } catch (error) {
      console.error('Error deleting user type:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o tipo de usuário."
      });
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Tipos de Usuário</h1>
          <p className="text-muted-foreground">
            Crie e gerencie os tipos de usuário do sistema
          </p>
        </div>
        
        {canCreate && (
          <Button onClick={() => handleOpenDialog()} className="bg-construction-primary hover:bg-construction-secondary">
            <Plus className="mr-2 h-4 w-4" />
            Novo Tipo
          </Button>
        )}
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome do Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Carregando tipos de usuário...
                </TableCell>
              </TableRow>
            ) : userTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Nenhum tipo de usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              userTypes.map((userType) => (
                <TableRow key={userType.id}>
                  <TableCell className="font-medium">{userType.id}</TableCell>
                  <TableCell>{userType.typeName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {canManagePermissions && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          asChild
                        >
                          <Link to={`/permissoes?userTypeId=${userType.id}`}>
                            <Shield className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {canEdit && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleOpenDialog(userType)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-construction-danger hover:text-white hover:bg-construction-danger"
                          onClick={() => handleOpenDeleteDialog(userType)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentUserType ? 'Editar Tipo de Usuário' : 'Novo Tipo de Usuário'}
            </DialogTitle>
            <DialogDescription>
              {currentUserType
                ? 'Edite as informações do tipo de usuário existente.'
                : 'Preencha as informações para criar um novo tipo de usuário.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="typeName" className="text-sm font-medium">
                Nome do Tipo
              </label>
              <Input
                id="typeName"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
                placeholder="Ex: Administrador, Vendedor, Cliente..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
            <Button 
              className="bg-construction-primary hover:bg-construction-secondary"
              onClick={handleSubmit}
            >
              {currentUserType ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tipo de Usuário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o tipo de usuário "{currentUserType?.typeName}"?
              Esta ação não pode ser desfeita e todas as permissões e usuários relacionados a este tipo
              também serão afetados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-construction-danger hover:bg-red-600"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
