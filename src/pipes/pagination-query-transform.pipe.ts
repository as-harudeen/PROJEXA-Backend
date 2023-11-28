import { PipeTransform } from '@nestjs/common';

export interface PaginationQueryInterface {
  p: number;
  l: number;
  s: string;
}

export class PaginationQueryTransformPipe implements PipeTransform {

  private maxLimit: number;
  constructor (maxLimit: number) {
    this.maxLimit = maxLimit;
  }


  transform({ p: pageNum, l: limit, s }: PaginationQueryInterface) {
    return {
      p: isNaN(+pageNum) ? 1 : +pageNum,
      l: isNaN(+limit)
        ? this.maxLimit
        : Math.min(this.maxLimit, +limit),
      s: s || '',
    };
  }
}
