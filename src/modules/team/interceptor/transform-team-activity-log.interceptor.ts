import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { mutateLogsToRelativeTime } from 'src/utils/log.util';

type Response = {
  log_text: string;
  logged_at: string;
}[];

export class TransformTeamActivityLogInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<Response>) {
    return next.handle().pipe(
      map((logs) => {
        return mutateLogsToRelativeTime(logs);
      }),
    );
  }
}
