import { useInstallationStore, useNotificationsStore } from '@/app/services/stores';
import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Markdown from 'react-markdown';
import gfm from 'remark-gfm';

type NotificationParams = {
  installationId: string;
};

export function Notifications(params: NotificationParams) {
  const fetchNotifications = useNotificationsStore(state => state.fetchNotifiactions);
  const notifications = useNotificationsStore(
    state => state.notificationsByInstallationId[params.installationId],
  );
  const { getAccessTokenSilently } = useAuth0();

  const asyncFetch = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetchNotifications(params.installationId, token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    asyncFetch();
  }, [fetchNotifications, getAccessTokenSilently, params.installationId]);

  const installations = useInstallationStore(state => state.installations);
  const installation = installations.find(i => i.id == params.installationId);

  const instanceUrl = installation?.urls.instance?.success_url;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          <p>
            You have <strong>{notifications?.length ?? 0}</strong> active notifications.
            {notifications && notifications.length == 0 ? (
              <Icons.shieldCheck className="w-24 h-24 m-auto mt-12 text-gray-200" />
            ) : (
              <></>
            )}
          </p>

          {instanceUrl == null ? (
            <p>
              <br />
              Notification links are currently inactive and will appear as{' '}
              <Icons.xCircle className="inline w-4 h-4 text-red-600" />.<br />
              Set up and verify your instance URL for {installation?.name ?? ''}.<br />
            </p>
          ) : (
            <></>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {(notifications ?? []).map((notification, index) => {
            const notificationColor =
              notification.notification_id == 'invalid_config'
                ? 'bg-red-500'
                : 'bg-sky-500';

            return (
              <div
                key={index}
                className="mb-2 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span
                  className={cn(
                    'flex h-2 w-2 translate-y-1 rounded-full',
                    notificationColor,
                  )}
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">
                    <Markdown
                      remarkPlugins={[gfm]}
                      components={{
                        a: props => {
                          if (instanceUrl) {
                            return (
                              <strong>
                                <a href={`${instanceUrl}${props.href}`}>
                                  {props.children}
                                </a>
                              </strong>
                            );
                          } else {
                            return (
                              <span>
                                <Icons.xCircle className="inline w-4 h-4 text-red-600" />{' '}
                                {props.children}
                              </span>
                            );
                          }
                        },
                      }}
                      children={notification.message}
                    />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
