import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ProjectStatus } from '@prisma/client';

export class GetProjectQueryPipe implements PipeTransform {
  transform(value: any) {
    try {
      if (value.f) {
        const project_statusArr = JSON.parse(value.f);
        if (Array.isArray(project_statusArr)) {
          project_statusArr.forEach((element) => {
            if (!Object.values(ProjectStatus).includes(element))
              throw new Error('Invalid filter options');
          });
        }
        value.f = project_statusArr;
      }

      if (value.p) {
        if(isNaN(+value.p)) throw new Error;
        value.p = +value.p;
      }

      return value;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
