
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { UserFormData } from '../schemas/userFormSchema';

interface FullNameFieldProps {
  form: UseFormReturn<UserFormData>;
}

export function FullNameField({ form }: FullNameFieldProps) {
  return (
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome Completo</FormLabel>
          <FormControl>
            <Input placeholder="Digite o nome completo" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
