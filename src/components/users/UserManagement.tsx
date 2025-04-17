
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { UserForm } from './UserForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { UsersTable } from './components/UsersTable';
import { DeleteUserDialog } from './components/DeleteUserDialog';
import { userService } from '@/services/userService';

export default function UserManagement() {
  const { hasPermission } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, refetch: refetchUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  const canCreate = hasPermission('1', 'create');
  const canEdit = hasPermission('1', 'edit');
  const canDelete = hasPermission('1', 'delete');
  const canManagePermissions = hasPermission('4', 'access');

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      console.log("Submitting user data:", data);
      
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, data);
        toast({
          title: 'Usuário atualizado',
          description: 'O usuário foi atualizado com sucesso.',
        });
      } else {
        await userService.createUser(data);
        toast({
          title: 'Usuário cadastrado',
          description: 'O usuário foi criado com sucesso.',
        });
      }
      
      handleCloseDialog();
      await refetchUsers(); // Importante: recarregar a lista de usuários
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o usuário. Verifique os logs para mais detalhes.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedUser) return;
      
      setIsLoading(true);
      await userService.deleteUser(selectedUser.id);
      
      toast({
        title: 'Usuário excluído',
        description: `O usuário ${selectedUser.fullName} foi excluído com sucesso.`,
      });

      setDeleteDialogOpen(false);
      setSelectedUser(null);
      await refetchUsers(); // Importante: recarregar a lista de usuários
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o usuário.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gerenciar Usuários
          </h1>
          <p className="text-muted-foreground">
            Crie e gerencie os usuários do sistema
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={() => handleOpenDialog()}
            className="bg-construction-primary hover:bg-construction-secondary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        )}
      </div>

      <div className="border rounded-lg">
        <UsersTable
          users={users}
          isLoading={isLoadingUsers}
          canEdit={canEdit}
          canDelete={canDelete}
          canManagePermissions={canManagePermissions}
          onEdit={handleOpenDialog}
          onDelete={(user) => {
            setSelectedUser(user);
            setDeleteDialogOpen(true);
          }}
        />
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? 'Edite as informações do usuário existente.'
                : 'Preencha as informações para criar um novo usuário.'}
            </DialogDescription>
          </DialogHeader>
          <UserForm user={selectedUser} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={deleteDialogOpen}
        user={selectedUser}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}
