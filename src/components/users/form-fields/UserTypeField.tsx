
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { UserFormData } from '../schemas/userFormSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/userService';

interface UserTypeFieldProps {
  form: UseFormReturn<UserFormData>;
}

export function UserTypeField({ form }: UserTypeFieldProps) {
  const { data: userTypes, isLoading: isLoadingUserTypes } = useQuery({
    queryKey: ['userTypes'],
    queryFn: userService.getUserTypes,
  });

  return (
    <FormField
      control={form.control}
      name="userTypeId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tipo de Usuário</FormLabel>
          <Select
            disabled={isLoadingUserTypes}
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {userTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.typeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
