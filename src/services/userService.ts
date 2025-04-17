
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { UserFormData } from "@/components/users/schemas/userFormSchema";

export const userService = {
  async createUser(data: UserFormData) {
    console.log("Creating user with data:", data);
    
    try {
      // Validate that userTypeId is a valid UUID format
      if (!data.userTypeId || !isValidUUID(data.userTypeId)) {
        console.error("Invalid userTypeId format:", data.userTypeId);
        throw new Error(`Invalid user type ID format. Expected UUID, got: ${data.userTypeId}`);
      }
      
      const { data: insertedData, error } = await supabase
        .from('usuarios')
        .insert({
          nome_completo: data.fullName,
          nome_usuario: data.username,
          email: data.email,
          senha_hash: data.password, // In a real app, this should be hashed
          tipo_usuario_id: data.userTypeId
        })
        .select();

      if (error) {
        console.error("Error creating user:", error);
        throw error;
      }
      
      console.log("User created successfully:", insertedData);
      return insertedData;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  },

  async updateUser(userId: string, data: UserFormData) {
    try {
      // Validate that userTypeId is a valid UUID format
      if (!data.userTypeId || !isValidUUID(data.userTypeId)) {
        console.error("Invalid userTypeId format:", data.userTypeId);
        throw new Error(`Invalid user type ID format. Expected UUID, got: ${data.userTypeId}`);
      }
      
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

      const { data: updatedData, error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('id', userId)
        .select();

      if (error) {
        console.error("Error updating user:", error);
        throw error;
      }
      
      return updatedData;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  },

  async deleteUser(userId: string) {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in deleteUser:", error);
      throw error;
    }
  },

  async getUsers() {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          userType:tipo_usuario_id (
            id,
            nome_tipo
          )
        `);

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
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
    } catch (error) {
      console.error("Error in getUsers:", error);
      throw error;
    }
  },
  
  async getUserTypes() {
    try {
      const { data, error } = await supabase
        .from('tipos_usuario')
        .select('*');
        
      if (error) {
        console.error("Error fetching user types:", error);
        throw error;
      }
      
      return data.map(type => ({
        id: type.id,
        typeName: type.nome_tipo
      }));
    } catch (error) {
      console.error("Error in getUserTypes:", error);
      throw error;
    }
  }
};

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
