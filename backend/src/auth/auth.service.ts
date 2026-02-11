import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // Explicitly access the getter to include it in the returned object
      const permissions = user.permissions;
      const { passwordHash, ...result } = user;
      return { ...result, permissions };
    }
    return null;
  }

  async login(user: any) {
    const permissions = user.permissions; // Uses the getter from User entity to flatten
    
    const payload = { 
      email: user.email, 
      sub: user.id,
      permissions: permissions // Embed permissions in token
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        permissions: permissions
      }
    };
  }
}
