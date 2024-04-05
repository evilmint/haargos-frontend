import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Icons } from './icons';

type Tier = {
  title: string;
  price: number | null;
  icon: JSX.Element | null;
  isAvailable?: boolean;
  description: string;
  features: string[];
  footer: string;
  href: string;
};

export default function PricingTiers() {
  const tiers: Tier[] = [
    {
      title: 'Explorer',
      price: 5.0,
      icon: <Icons.healthline className="h-5 w-5" />,
      description:
        'Monitor one HomeAssistant installation with basic analytics and limited email alarms.<br /><br /><b>Try for free, cancel anytime.</b>',
      features: [
        '1 installation',
        'Basic analytics',
        'Up to 5 alarms',
        'Host machine information',
        'Basic e-mail support',
        'Data history for 1 day',
        'ZHA & Z2M support',
        'Ping external HA installations (limited)',
      //  'Frequency of data points: once per 8 hours',
        'HA update available badge',
      ],
      footer: 'Try for free (14 days)',
      href: '/signup?tier=explorer',
    },
    {
      title: 'Navigator',
      price: 10.0,
      icon: <Icons.zap className="h-5 w-5" />,
      isAvailable: false,
      description:
        'Ideal for individual users with up to 3 installations requiring enhanced analytics.',
      features: [
        'Up to 3 installations',
        'Up to 10 alarms',
        'Priority email support',
        'Data history for 3 days',
        'Interaction with Core & Supervisor API',
        'Ping external hosts',
        'External host ping data count',
        'Battery info on Zigbee devices',
        'Instant notifications about new HomeAssistant version',
      //  'Frequency of data points: once per 4 hours',
      //  'Basic reports',
      ],
      footer: 'Start with Navigator',
      href: '/signup?tier=navigator',
    },
    {
      title: 'Pro',
      price: 20.0,
      icon: <Icons.cpu className="h-5 w-5" />,
      isAvailable: false,
      description:
        'Unlimited installations and full analytics suite for professional installers.',
      features: [
        'Unlimited installations',
        'Full analytics suite',
        'Up to 30 alarms',
        'High priority support',
        'Data history for 1 week',
        'Battery info on Zigbee devices',
        'External host ping data count',
        'Instant notifications about new HomeAssistant version',
      //  'Frequency of data points: once per hour',
        'Advanced reports with more frequent updates',
      ],
      footer: 'Upgrade to Professional',
      href: '/signup?tier=pro',
    },
    {
      title: 'Enterprise',
      price: null,
      icon: <Icons.memory className="h-5 w-5" />,
      isAvailable: false,
      description:
        'Customizable solutions with white labeling and on-premises options for enterprises.',
      features: [
        'All Pro features plus custom options',
        'API access',
        'White labeling',
        'On-premises deployment',
        '24/7 support',
       // 'Custom frequency of data points: user-defined',
        'Comprehensive reports & advanced analytics',
      ],
      footer: 'Contact for Enterprise solution',
      href: '/signup?tier=enterprise',
    },
  ];

  return (
    <>
      <div className="mx-auto text-center mt-8 mb-4">
        <h1 className="text-4xl font-semibold mb-3 dark:text-white">Haargos</h1>
        <p className="dark:text-gray-300">
          Your Clients' Smart Homes, Flawlessly Managed
        </p>
        <p className="mt-8 text-black-700 font-medium text-xl dark:text-gray-300">
          Try out Haargos out for 2 weeks without making any payment
        </p>
      </div>
      <div
        id="pricing"
        className="flex overflow-auto no-scrollbar  md:space-x-10 md:mx-24 space-x-10 pt-0 mb-16"
      >
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={cn(
              'flex-1 pt-8 pb-10 overflow-x min-w-[80%] md:min-w-0',
              tier.isAvailable === undefined && tier.isAvailable !== true
                ? ''
                : 'opacity-50 disabled',
            )}
          >
            <Link
              href={
                tier.isAvailable === undefined && tier.isAvailable !== true
                  ? tier.href
                  : ''
              }
              passHref
            >
              <div className="flex flex-col h-full pt-4 rounded-xl space-y-6 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-101 shadow-xl cursor-pointer dark:bg-gray-700 bg-slate-100">
                <div className="px-8 flex justify-between items-center">
                  <h4 className="text-xl font-bold dark:text-white">{tier.title}</h4>
                  <div className="dark:text-white text-gray-800">{tier.icon}</div>
                </div>
                <h1 className="text-4xl text-center font-bold dark:text-white">
                  {tier.price != null ? `$${tier.price}` : 'Contact Us'}
                </h1>
                <p
                  className="px-4 text-center text-sm dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: tier.description }}
                />
                <ul className="text-left mx-4 ml-8 list-disc flex-1 leading-normal dark:text-gray-200">
                  {tier.features.map((feature, featureIndex) => (
                    <li className="font-semibold my-2" key={featureIndex}>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-auto dark:bg-indigo-sr-700 bg-sr-600">
                  <button className="inline-block my-6 font-semibold text-white">
                    {tier.isAvailable === undefined && tier.isAvailable !== true
                      ? tier.footer
                      : 'Available soon!'}
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
