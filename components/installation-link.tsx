import { useInstallationStore } from '@/app/services/stores/installation';
import { LucideExternalLink } from 'lucide-react';
import Link from 'next/link';

export function InstallationLink({
  installationId,
  path,
  children,
}: {
  installationId: string;
  path: string;
  children: React.ReactNode;
}) {
  const installation = useInstallationStore(state =>
    state.installations.find(i => i.id === installationId),
  );

  const instanceUrl = installation?.urls.instance?.success_url;

  return (
    <Link target="_blank" className="text-blue-600" href={`${instanceUrl}${path}`}>
      {children} <LucideExternalLink className="inline mr-2 -mt-1 h-4 w-4" />
    </Link>
  );
}
