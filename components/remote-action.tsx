import { useJobsStore } from '@/app/services/stores/jobs';
import { useTabStore } from '@/app/services/stores/tab';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@tremor/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Icons } from './icons';
import { FailureAlert } from './ui/failure-alert';

export type RemoteActionType =
  | 'update_addon'
  | 'update_core'
  | 'update_os'
  | 'addon_stop'
  | 'addon_restart'
  | 'addon_start'
  | 'addon_uninstall'
  | 'addon_update'
  | 'supervisor_update'
  | 'supervisor_restart'
  | 'supervisor_repair'
  | 'supervisor_reload'
  | 'core_stop'
  | 'core_restart'
  | 'core_start'
  | 'core_update'
  | 'host_reboot'
  | 'host_shutdown';

type RemoteActionProps = {
  type: RemoteActionType;
  context?: any;
  text?: string;
  installationId: string;
  visual?: 'link' | 'button';
};

export function RemoteAction(props: RemoteActionProps) {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [updateScheduled, setUpdateScheduled] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const scheduleJob = useJobsStore(state => state.scheduleJob);
  const setCurrentTab = useTabStore(state => state.setCurrentTab);
  const reloadJobs = useJobsStore(state => state.reloadJobs);

  const { getAccessTokenSilently } = useAuth0();

  const onRemoteActionTapped = async function () {
    setDisabled(true);

    const token = await getAccessTokenSilently();

    try {
      let response = await scheduleJob(
        token,
        props.installationId,
        props.type,
        props.context ?? null,
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error('Bad call');
      } else {
        reloadJobs(props.installationId, token);
      }

      setUpdateScheduled(true);

      const remoteActionTypeString = props.type
        .replaceAll('_', ' ')
        .split(/ /g)
        .map(word => `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`)
        .join(' ');

      toast.success(
        <p>
          <strong>{remoteActionTypeString} scheduled</strong>
          <br />
          Remote actions are processed in the background and may be subject to delays.
          <br />
          <span
            className="font-semibold cursor-pointer"
            onClick={() => {
              setCurrentTab('jobs');
            }}
          >
            View status
          </span>
        </p>,
      );
    } catch {
      setDisabled(false);
      setAlertOpen(true);
    }
  };

  let text: string;

  if (updateScheduled) {
    text = 'Scheduled';
  } else if (disabled) {
    text = 'Scheduling...';
  } else {
    text = props.text ?? 'Update';
  }

  return (
    <FailureAlert
      title={'Failed to schedule job'}
      openChange={setAlertOpen}
      open={alertOpen}
    >
      {props.visual != 'link' ? (
        <Button
          variant={'primary'}
          className="bg-sr-600 hover:bg-sr-700"
          disabled={disabled || updateScheduled}
          onClick={onRemoteActionTapped}
        >
          <Icons.signal className="inline w-5 h-5 mr-2 -ml-1 -mt-0.5" />
          {text}
        </Button>
      ) : (
        <div
          className="w-full cursor-pointer"
          onClick={disabled || updateScheduled ? () => {} : onRemoteActionTapped}
        >
          {/* <Icons.signal className="inline w-5 h-5 mr-2 -ml-1 -mt-0.5" /> */}
          {text}
        </div>
      )}
    </FailureAlert>
  );
}
