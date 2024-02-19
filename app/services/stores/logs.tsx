import { Log, LogSource } from '@/app/types';
const { parse, strip } = require('ansicolor');

import moment from 'moment';
import { create } from 'zustand';
import { fetchLogs } from '../logs';

interface LogsState {
  logsByInstallationId: Record<string, Record<string, Log[]>>;
  fetchLogs: (
    installationId: string,
    type: LogSource,
    token: string,
    force: boolean,
  ) => Promise<void>;
}

const useLogsStore = create<LogsState>((set, get) => ({
  logsByInstallationId: {},
  async fetchLogs(installationId, type, token, force) {
    if (
      force == false &&
      get().logsByInstallationId[installationId] &&
      get().logsByInstallationId[installationId][type]
    ) {
      return;
    }

    set(state => ({
      logsByInstallationId: {
        ...state.logsByInstallationId,
        [installationId]: {
          ...state.logsByInstallationId[installationId],
          [type]: [],
        },
      },
    }));

    const logs = await fetchLogs(installationId, type, token);
    const parsedLogs = parseLog(logs.body.content, type);

    set(state => ({
      logsByInstallationId: {
        ...state.logsByInstallationId,
        [installationId]: {
          ...state.logsByInstallationId[installationId],
          [type]: parsedLogs,
        },
      },
    }));
  },
}));

function parseISOLocal(s: any) {
  var b = s.split(/\D/);
  return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5]);
}

const parseLog = (logString: string, source: LogSource): Log[] => {
  let logs = logString.split('\n');

  const seenTimes = new Set<number>();

  let reduced = logs.reduce((acc: Log[], log: string) => {
    const parts = log.split(/\s+/);
    if (parts.length >= 5 && source == 'core') {
      const time = parseISOLocal(parts[0] + 'T' + parts[1]);

      if (seenTimes.has(time.getTime())) {
        return acc; // skip if this time has already been seen
      }

      seenTimes.add(time.getTime());

      const logType = parts[2][0];
      const thread = parts[3].replace('(', '').replace(')', '');
      const restOfLog = parts.slice(4).join(' ');

      acc.push({
        raw: log,
        time: time,
        type: logType,
        thread: thread,
        log: wrapSquareBracketsWithEm(restOfLog),
      });
    } else if (source == 'host') {
      const parsed = moment(`${parts[0]} ${parts[1]} ${parts[2]}`, 'MMM D HH:mm:ss');

      acc.push({
        raw: log,
        time: parsed.toDate(),
        type: '',
        thread: '',
        log: parts.slice(3).join(' '),
      });
    } else if (source == 'multicast' || source == 'audio' || source == 'dns') {
      acc.push({
        raw: log,
        time: null,
        type: '',
        thread: '',
        log: log,
      });
    } else if (source == 'supervisor') {
      const dateString = `${strip(parts[0])} ${parts[1]}`;
      const parsed = moment(dateString, 'YY-MM-DD HH:mm:ss');
      const ansi = parse(log);

      const ansiColor = ansi.spans[0]?.color.name;

      let color: string;

      switch (ansiColor) {
        case 'green':
          color = 'text-green-600';
          break;
        case 'yellow':
          color = 'text-orange-600';
          break;
        default:
          color = 'text-inherit';
          break;
      }

      acc.push({
        raw: log,
        time: parsed.toDate(),
        type: '',
        thread: '',
        log: strip(log),
        color: color,
      });
    }
    return acc;
  }, []);

  return reduced.sort((a, b) => (b.time?.getTime() ?? 0) - (a.time?.getTime() ?? 0));
};

function wrapSquareBracketsWithEm(inputString: string) {
  const regex = /\[([^\]]+)\]/g;
  return inputString.replace(regex, '<p class="text-xs">[$1]</p>');
}

export { useLogsStore };
