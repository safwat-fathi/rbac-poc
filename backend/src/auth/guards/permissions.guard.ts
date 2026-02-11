import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    // User permissions are embedded in the JWT payload and available on request.user
    // structure: { userId: '...', email: '...', permissions: ['perm1', 'perm2'] }
    
    if (!user || !user.permissions) {
       // Ideally this shouldn't happen if AuthGuard is validated strictly before, 
       // but strictly speaking we should just fail safe
       return false;
    }

    const hasPermission = requiredPermissions.every((permission) =>
      user.permissions.includes(permission),
    );
    
    return hasPermission;
  }
}
