import { SetMetadata } from '@nestjs/common';

export const Roles = (..._rol: string[]) => SetMetadata('roles', _rol);
