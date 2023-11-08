import { Tier } from '@/app/types';
import { Color } from '@tremor/react';

class TierResolver {
  static badgeColor(tier: Tier): Color {
    let tierBadgeColor: Color;

    switch (tier) {
      case 'Explorer':
        tierBadgeColor = 'blue';
        break;

      case 'Pro':
        tierBadgeColor = 'red';
        break;

      case 'Enterprise':
        tierBadgeColor = 'fuchsia';

      default:
        tierBadgeColor = 'gray';
    }

    return tierBadgeColor;
  }

  static isAdvancedAnalyticsEnabled(tier: Tier): boolean {
    return tier !== 'Expired' && tier !== 'Explorer';
  }
}

export { TierResolver };
