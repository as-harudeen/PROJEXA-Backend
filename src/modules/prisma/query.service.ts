import { Injectable } from '@nestjs/common';
import { GetProjectQueryInterface } from './interface';
import { ProjectStatus } from '@prisma/client';

@Injectable()
export class QueryService {


  /**
   * GET PERSONAL PROJECT QUERY BUILDER.
   * the query for retrive personal projects -
   * base on user_id.
   * 
   * optionaly accepting s(search value) and f (
   * filter), 
   *   => s for retrieve only the project which - 
   *      project name contains s.
   * 
   *   => f for filter based on project status
   *      f would be the array of project status.
   * 
   * @param user_id - user_id
   * @param s - OPTIONAL - the search value.
   * @param f - OPTIONAL - the filter
   * @returns  database query.
   */
  getPersonalProjectQuery(user_id: string, s: string, f: ProjectStatus[]) {
    const query: GetProjectQueryInterface = {
      where: {
        user_id,
        project_type: 'personal',
      },
    };

    if (s) {
      query.where.project_name = { contains: s };
    }

    if (f?.length) {
      query.where.project_status = {
        in: f,
      };
    }

    return query;
  }
}
