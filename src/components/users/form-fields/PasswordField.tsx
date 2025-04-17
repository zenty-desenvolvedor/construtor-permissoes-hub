
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { UserFormData } from '../schemas/userFormSchema';
import { User } from '@/types';

interface PasswordFieldProps {
  form: UseFormReturn<UserFormData>;
  user?: User;
}

export function PasswordField({ form, user }: PasswordFieldProps) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{user ? 'Nova Senha' : 'Senha'}</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder={user ? 'Digite a nova senha' : 'Digite a senha'}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
