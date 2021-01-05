/**
 * Interfaz que representa al Usuario
 */
export interface UsuarioI {
  /** Identificador único del usuario */
  userId: number;
  /** Nombre del usuario */
  nickname: string;
  /** Dirección de correo electrónico del usuario */
  email: string;
  /** Contraseña del usuario */
  password?: string;
}
