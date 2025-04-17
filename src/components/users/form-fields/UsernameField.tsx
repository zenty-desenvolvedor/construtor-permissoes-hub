
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { UserFormData } from '../schemas/userFormSchema';

interface UsernameFieldProps {
  form: UseFormReturn<UserFormData>;
}

export function UsernameField({ form }: UsernameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome de Usuário</FormLabel>
          <FormControl>
            <Input placeholder="Digite o nome de usuário" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
