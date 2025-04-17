
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { User } from '@/types';
import { userFormSchema, UserFormData } from './schemas/userFormSchema';
import { FullNameField } from './form-fields/FullNameField';
import { UsernameField } from './form-fields/UsernameField';
import { EmailField } from './form-fields/EmailField';
import { PasswordField } from './form-fields/PasswordField';
import { UserTypeField } from './form-fields/UserTypeField';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, isLoading = false }: UserFormProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      userTypeId: user?.userTypeId || '',
    },
  });

  // Debugging
  useEffect(() => {
    console.log("Form values:", form.watch());
    console.log("Form errors:", form.formState.errors);
  }, [form.watch(), form.formState.errors]);

  const handleSubmit = async (data: UserFormData) => {
    try {
      // Add the ID of the user to the data if editing
      const submitData = user ? { ...data, id: user.id } : data;
      
      console.log("Submitting data:", submitData);
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting user form:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o usuário',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FullNameField form={form} />
        <UsernameField form={form} />
        <EmailField form={form} />
        <PasswordField form={form} user={user} />
        <UserTypeField form={form} />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {user ? 'Atualizando...' : 'Cadastrando...'}
            </>
          ) : (
            user ? 'Atualizar Usuário' : 'Cadastrar Usuário'
          )}
        </Button>
      </form>
    </Form>
  );
}
