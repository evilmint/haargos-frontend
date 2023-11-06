'use client';

import HomeComponent from '@/components/home-component';
import { useInstallationStore, useUserStore } from './services/stores';

export default function DashboardPage() {
  const user = useUserStore(state => state.user);
  const hasInstallations = useInstallationStore(state => state.installations).length > 0;

  return <HomeComponent />;
}
