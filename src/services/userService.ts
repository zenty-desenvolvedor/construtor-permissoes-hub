
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { UserFormData } from "@/components/users/schemas/userFormSchema";

export const userService = {
  async createUser(data: UserFormData) {
    const { error } = await supabase
      .from('usuarios')
      .insert({
        nome_completo: data.fullName,
        nome_usuario: data.username,
        email: data.email,
        senha_hash: data.password, // In a real app, this should be hashed
        tipo_usuario_id: data.userTypeId
      });

    if (error) throw error;
  },

  async updateUser(userId: string, data: UserFormData) {
    const updateData: any = {
      nome_completo: data.fullName,
      nome_usuario: data.username,
      email: data.email,
      tipo_usuario_id: data.userTypeId
    };

    // Only include password if it's provided (for updates)
    if (data.password) {
      updateData.senha_hash = data.password;
    }

    const { error } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', userId);

    if (error) throw error;
  },

  async deleteUser(userId: string) {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  },

  async getUsers() {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        userType:tipo_usuario_id (
          id,
          nome_tipo
        )
      `);

    if (error) throw error;
    return data.map(user => ({
      id: user.id,
      fullName: user.nome_completo,
      username: user.nome_usuario,
      email: user.email,
      userTypeId: user.tipo_usuario_id,
      userType: user.userType ? {
        id: user.userType.id,
        typeName: user.userType.nome_tipo
      } : undefined
    }));
  }
};
