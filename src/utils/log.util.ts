import * as moment from 'moment';

type logs = {
  log_text: string;
  logged_at: string;
}[];

export const mutateLogsToRelativeTime = (logs: logs) => {
  const mutatedLogs: logs = [];

  const lastIdx = logs.length - 1;

  for (let i = lastIdx; i >= 0; i--) {
    const log = logs[i];

    const mutatedLog = {
      ...log,
      logged_at: moment(log.logged_at).fromNow(),
    };
    mutatedLogs.push(mutatedLog);
  }

  return mutatedLogs;
};