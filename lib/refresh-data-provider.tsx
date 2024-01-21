'use effect';

import { useInstallationStore } from '@/app/services/stores/installation';
import { useInstallationSwitcherStore } from '@/app/services/stores/installation-switcher';
import { useAuth0 } from '@auth0/auth0-react';
import { ReactNode, useEffect } from 'react';

type RefreshDataProps = {
  children: ReactNode;
};

export function RefreshDataProvider(props: RefreshDataProps) {
  const { getAccessTokenSilently } = useAuth0();
  const { selectedInstallation } = useInstallationSwitcherStore(state => state);
  const { fetchObservationsForInstallation } = useInstallationStore(state => state);

  useEffect(() => {
    const check = async () => {
      const token = await getAccessTokenSilently();
      if (selectedInstallation != null) {
        fetchObservationsForInstallation(selectedInstallation.id, token, true);
      }
    };

    const intervalToken = setInterval(check, 15 * 60 * 1000);

    return () => {
      clearInterval(intervalToken);
    };
  }, [getAccessTokenSilently, selectedInstallation]);

  return props.children;
}
