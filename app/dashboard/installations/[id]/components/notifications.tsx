import { useInstallationStore } from '@/app/services/stores/installation';
import { useNotificationsStore } from '@/app/services/stores/notifications';
import { Icons } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Markdown from 'react-markdown';
import gfm from 'remark-gfm';

type NotificationParams = {
  installationId: string;
};

const useNotifications = (installationId: string) => {
  const fetchNotifications = useNotificationsStore(state => state.fetchNotifiactions);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const asyncFetch = async () => {
      try {
        const token = await getAccessTokenSilently();
        await fetchNotifications(installationId, token);
      } catch (error) {
        console.log(error);
      }
    };
    asyncFetch();
  }, [fetchNotifications, getAccessTokenSilently, installationId]);
};

export function Notifications({ installationId }: NotificationParams) {
  useNotifications(installationId);

  const notifications = useNotificationsStore(
    state => state.notificationsByInstallationId[installationId],
  );

  const installation = useInstallationStore(state =>
    state.installations.find(i => i.id === installationId),
  );

  const instanceUrl = installation?.urls.instance?.success_url;

  const hasNotifications = notifications?.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <p>
          You have <strong>{notifications?.length ?? 0}</strong> active notifications.
        </p>
        {!hasNotifications && (
          <Icons.shieldCheck className="w-24 h-24 m-auto mt-12 text-gray-200" />
        )}
        {!instanceUrl && (
          <p className="mt-4">
            Notification links are currently inactive and will appear as{' '}
            <Icons.xCircle className="inline w-4 h-4 text-red-600" />.<br />
            Set up and verify your instance URL for{' '}
            {installation?.name ?? 'your installation'}.
          </p>
        )}
      </CardHeader>
      <CardContent>
        {hasNotifications &&
          notifications.map((notification, index) => (
            <NotificationItem
              key={index}
              notification={notification}
              instanceUrl={instanceUrl}
            />
          ))}
      </CardContent>
    </Card>
  );
}

const NotificationItem = ({
  notification,
  instanceUrl,
}: {
  notification: any;
  instanceUrl: string | undefined;
}) => {
  const notificationColor =
    notification.notification_id === 'invalid_config' ? 'bg-red-500' : 'bg-sky-500';
  return (
    <div className="mb-2 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
      <span className={`flex h-2 w-2 translate-y-1 rounded-full ${notificationColor}`} />
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{notification.title}</p>
        <p className="text-sm text-muted-foreground">
          <Markdown
            remarkPlugins={[gfm]}
            components={{
              a: ({ href, children }) =>
                instanceUrl ? (
                  <a target="_blank" href={`${instanceUrl}${href}`} className="font-bold">
                    {children}
                  </a>
                ) : (
                  <span className="text-muted">
                    <Icons.xCircle className="inline w-4 h-4 text-red-600" /> {children}
                  </span>
                ),
            }}
          >
            {notification.message}
          </Markdown>
        </p>
      </div>
    </div>
  );
};
