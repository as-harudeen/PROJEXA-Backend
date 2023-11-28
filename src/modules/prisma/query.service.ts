import { Injectable } from '@nestjs/common';
import { GetProjectsQueryInterface } from './interface';
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
  getPersonalProjectsQuery(owner_id: string, s: string, f: ProjectStatus[]) {
    const query: GetProjectsQueryInterface = {
      where: {
        owner_id,
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

  getPersonalOneProjectQuery(user_id: string, project_id: string) {
    return {
      where: { project_id, user_id },
      select: {
        project_name: true,
        project_desc: true,
        project_start_date: true,
        project_end_date: true,
        project_status: true,
        project_id: true,
        project_reference: true,
      },
    };
  }
}
