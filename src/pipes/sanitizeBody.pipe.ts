import { PipeTransform, ArgumentMetadata } from '@nestjs/common';

export class SanitizeBodyPipe implements PipeTransform {
  constructor(private readonly bodySchema: object) {}
  transform(body: object, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
        console.log(this.bodySchema);
      for (const key of Object.keys(body)) {
          
          if (!(key in this.bodySchema)) {
            console.log(key);
          delete body[key];
        }
      }
      console.log(body);
    }
    return body;
  }
}
