
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
import { Module } from '@/types';
import { Plus, Pencil, Trash } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function ModuleManagement() {
  const { hasPermission } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [moduleName, setModuleName] = useState('');
  
  const canCreate = hasPermission('3', 'create');
  const canEdit = hasPermission('3', 'edit');
  const canDelete = hasPermission('3', 'delete');
  
  useEffect(() => {
    fetchModules();
  }, []);
  
  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const data = await api.getModules();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar módulos",
        description: "Não foi possível carregar a lista de módulos."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenDialog = (module?: Module) => {
    if (module) {
      setCurrentModule(module);
      setModuleName(module.moduleName);
    } else {
      setCurrentModule(null);
      setModuleName('');
    }
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentModule(null);
    setModuleName('');
  };
  
  const handleOpenDeleteDialog = (module: Module) => {
    setCurrentModule(module);
    setDeleteDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    try {
      if (moduleName.trim() === '') {
        toast({
          variant: "destructive",
          title: "Nome inválido",
          description: "O nome do módulo não pode estar vazio."
        });
        return;
      }
      
      if (currentModule) {
        // Update existing module
        await api.updateModule({
          ...currentModule,
          moduleName
        });
        toast({
          title: "Módulo atualizado",
          description: `O módulo ${moduleName} foi atualizado com sucesso.`
        });
      } else {
        // Create new module
        await api.createModule({ moduleName });
        toast({
          title: "Módulo criado",
          description: `O módulo ${moduleName} foi criado com sucesso.`
        });
      }
      
      handleCloseDialog();
      fetchModules();
    } catch (error) {
      console.error('Error saving module:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o módulo."
      });
    }
  };
  
  const handleDelete = async () => {
    try {
      if (!currentModule) return;
      
      await api.deleteModule(currentModule.id);
      toast({
        title: "Módulo excluído",
        description: `O módulo ${currentModule.moduleName} foi excluído com sucesso.`
      });
      
      setDeleteDialogOpen(false);
      setCurrentModule(null);
      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o módulo."
      });
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Módulos</h1>
          <p className="text-muted-foreground">
            Crie e gerencie os módulos do sistema
          </p>
        </div>
        
        {canCreate && (
          <Button onClick={() => handleOpenDialog()} className="bg-construction-primary hover:bg-construction-secondary">
            <Plus className="mr-2 h-4 w-4" />
            Novo Módulo
          </Button>
        )}
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome do Módulo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Carregando módulos...
                </TableCell>
              </TableRow>
            ) : modules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Nenhum módulo encontrado
                </TableCell>
              </TableRow>
            ) : (
              modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">{module.id}</TableCell>
                  <TableCell>{module.moduleName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {canEdit && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleOpenDialog(module)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-construction-danger hover:text-white hover:bg-construction-danger"
                          onClick={() => handleOpenDeleteDialog(module)}
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
              {currentModule ? 'Editar Módulo' : 'Novo Módulo'}
            </DialogTitle>
            <DialogDescription>
              {currentModule
                ? 'Edite as informações do módulo existente.'
                : 'Preencha as informações para criar um novo módulo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="moduleName" className="text-sm font-medium">
                Nome do Módulo
              </label>
              <Input
                id="moduleName"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                placeholder="Ex: Usuários, Vendas, Produtos..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
            <Button 
              className="bg-construction-primary hover:bg-construction-secondary"
              onClick={handleSubmit}
            >
              {currentModule ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Módulo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o módulo "{currentModule?.moduleName}"?
              Esta ação não pode ser desfeita e todas as permissões relacionadas a este módulo
              também serão excluídas.
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
