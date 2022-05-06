import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export const errorMessage = (err, texto) => {
  if (err.message && err.name != 'CastError') {
    texto = err.message;
  }

  if (err.status == 401) {
    throw new UnauthorizedException(texto);
  }

  throw new BadRequestException(texto);
};
