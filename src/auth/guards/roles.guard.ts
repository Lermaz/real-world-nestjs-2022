import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info: Error, context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const hasRole = () => roles.some((role) => user._rol === role) as any;

    if (!user) {
      throw new UnauthorizedException('You do not have permissions to enter');
    }
    if (!(user._rol && hasRole())) {
      throw new UnauthorizedException('You do not have permissions to enter');
    }

    return user && user._rol && hasRole();
  }
}
