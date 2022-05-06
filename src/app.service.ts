import { Injectable } from '@nestjs/common';
const { version: Version, licente: Licence } = require('../package.json');

@Injectable()
export class AppService {
  getVersion(): any {
    return {
      version: Version,
      license: Licence,
    };
  }
}
