import { Injectable } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  validateUser(email: string, pass: string): boolean {
    const user = this.userService.findByEmail(email);

    return user.validarPassword(pass);
  }

  login(user) {
    return {
      token: this.jwtService.sign(user),
    };
  }
}
