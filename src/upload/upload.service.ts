import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  async uploadFile(file, fileUrl) {
    const tempFile = `${__dirname}/../../public/temp/${file}`;

    if (!fs.existsSync(tempFile)) {
      throw new NotFoundException('The stored image was not found.');
    }

    return await fs.renameSync(
      tempFile,
      tempFile.split('/temp/').join(fileUrl),
    );
  }

  async updateFile(file, updateFile, fileUrl) {
    if (!file) {
      return this.uploadFile(updateFile, fileUrl);
    }

    const oldFile = `${__dirname}/../../public${fileUrl}${file}`;
    const newFile = `${__dirname}/../../public/temp/${updateFile}`;

    if (!fs.existsSync(newFile)) {
      throw new NotFoundException('No image found.');
    }

    await fs.unlinkSync(oldFile);
    return await fs.renameSync(newFile, newFile.split('/temp/').join(fileUrl));
  }

  async deleteFile(file, fileUrl) {
    return await fs.unlinkSync(`${__dirname}/../../public${fileUrl}${file}`);
  }
}
