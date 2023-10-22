import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileUploadTransformPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    return file?.filename;
  }
}
