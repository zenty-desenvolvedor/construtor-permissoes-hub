
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Shield, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UsersTableProps {
  users?: User[];
  isLoading: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManagePermissions: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UsersTable({
  users,
  isLoading,
  canEdit,
  canDelete,
  canManagePermissions,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Carregando usuários...
            </TableCell>
          </TableRow>
        ) : users?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Nenhum usuário encontrado
            </TableCell>
          </TableRow>
        ) : (
          users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.userType?.typeName}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {canManagePermissions && (
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/permissoes?userTypeId=${user.id}`}>
                        <Shield className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-construction-danger hover:text-white hover:bg-construction-danger"
                      onClick={() => onDelete(user)}
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
  );
}
