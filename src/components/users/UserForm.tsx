
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

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
}

export function UserForm({ user, onSubmit }: UserFormProps) {
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
      // Adicione o ID do usuário aos dados se estiver editando
      const submitData = user ? { ...data, id: user.id } : data;
      
      console.log("Submitting data:", submitData);
      await onSubmit(submitData);
      form.reset();
      toast({
        title: user ? 'Usuário atualizado' : 'Usuário criado',
        description: user
          ? 'O usuário foi atualizado com sucesso'
          : 'O usuário foi criado com sucesso',
      });
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
        <Button type="submit" className="w-full">
          {user ? 'Atualizar' : 'Cadastrar'} Usuário
        </Button>
      </form>
    </Form>
  );
}
