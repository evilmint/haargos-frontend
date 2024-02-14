import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface HaargosRouter {
  navigateToAccount: () => void;
  navigateToHomePageSection: (section: 'pricing') => void;
  navigateToRoot: () => void;
  navigateToInstallationAlarmEdit: (installationId: string, alarmId: string) => void;
  navigateToInstallationCreateAlarm: (installationId: string) => void;
  navigateToInstallation: (installationId: string) => void;
  navigateToInstallationWithHash: (installationId: string, hash: 'install') => void;
  navigateToDashboard: () => void;
}

function useHaargosRouter(router: AppRouterInstance): HaargosRouter {
  return {
    navigateToRoot() {
      router.push('/');
    },
    navigateToAccount() {
      router.push('/account/account');
    },
    navigateToHomePageSection(section) {
      router.push(`/#${section}`);
    },
    navigateToInstallation(installationId) {
      router.push(`/dashboard/installations/${installationId}`);
    },
    navigateToInstallationAlarmEdit(installationId, alarmId) {
      router.push(`/dashboard/installations/${installationId}/alarms/${alarmId}/edit`);
    },
    navigateToInstallationWithHash(installationId, hash) {
      router.push(`/dashboard/installations/${installationId}#${hash}`);
    },
    navigateToInstallationCreateAlarm(installationId) {
      router.push(`/dashboard/installations/${installationId}/alarms/create`);
    },
    navigateToDashboard() {
      router.push(`/dashboard`);
    },
  };
}

export { useHaargosRouter };
