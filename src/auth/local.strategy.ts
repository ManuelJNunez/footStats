import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  validate(email: string, password: string) {
    const valid = this.authService.validateUser(email, password);
    if (!valid) {
      throw new UnauthorizedException();
    }

    return valid;
  }
}
