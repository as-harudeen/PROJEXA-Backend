import {
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType<unknown>) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value);
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Vadlidation failed.');
    }
    return value;
  }
}
