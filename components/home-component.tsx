'use client';

import { MainNav } from '@/components/ui/main-nav';
import { UserNav } from '@/components/ui/user-nav';
import { Contact } from './contact';
import Features from './features';
import Hero from './hero';
import PricingTiers from './tiers';
import WhatIsHaargos from './what-is-haargos';

export default function HomeComponent() {
  return (
    <div className="flex-col sm:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>

      <Hero />
      <WhatIsHaargos />
      <Features />
      <PricingTiers />
      <Contact />
    </div>
  );
}
