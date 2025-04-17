
import * as z from 'zod';

export const userFormSchema = z.object({
  fullName: z.string().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
  username: z.string().min(3, 'Nome de usuário deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  userTypeId: z.string().uuid('Tipo de usuário é obrigatório'),
});

export type UserFormData = z.infer<typeof userFormSchema>;
