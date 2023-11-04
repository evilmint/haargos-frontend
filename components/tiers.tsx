import Link from 'next/link';
import { Icons } from './icons';

type Tier = {
  title: string;
  price: number | null;
  icon: JSX.Element | null;
  description: string;
  features: string[];
  footer: string;
  href: string;
};

export default function PricingTiers() {
  const tiers: Tier[] = [
    {
      title: 'Explorer',
      price: 0.0,
      icon: <Icons.healthline className="h-5 w-5" />,
      description:
        'Monitor one HomeAssistant installation with basic analytics and limited email alerts.',
      features: [
        '1 installation',
        'Basic analytics',
        'Email alerts with daily rate limit',
        'Basic e-mail support',
        'Data history for 1 day',
      ],
      href: '/signup?tier=explorer',
      footer: 'Sign up for free',
    },
    {
      title: 'Navigator',
      price: 5.0,
      icon: <Icons.zap className="h-5 w-5" />,
      description:
        'Ideal for individual users with up to 3 installations requiring enhanced analytics.',
      features: [
        'Up to 3 installations',
        'Docker support',
        'Unlimited email alerts',
        'Priority email support',
        'Data history for 3 days',
      ],
      href: '/signup?tier=navigator',
      footer: 'Start with Navigator',
    },
    {
      title: 'Pro',
      price: 15.0,
      icon: <Icons.cpu className="h-5 w-5" />,
      description:
        'Unlimited installations and full analytics suite for professional installers.',
      features: [
        'Unlimited installations',
        'Full analytics suite',
        'Instant email and SMS alerts',
        'High priority support',
        'API',
        'Data history for 1 week',
      ],
      href: '/signup?tier=pro',
      footer: 'Upgrade to Professional',
    },
    {
      title: 'Enterprise',
      price: null,
      icon: <Icons.memory className="h-5 w-5" />,
      description:
        'Customizable solutions with white labeling and on-premises options for enterprises.',
      features: [
        'All Professional features plus custom options',
        'White labeling',
        'On-premises deployment',
        '24/7 support and dedicated account manager',
        'Training sessions for staff',
      ],
      href: '/signup?tier=free',
      footer: 'Contact for Enterprise solution',
    },
  ];

  return (
    <>
      <div className="mx-auto text-center mt-8 mb-4">
        <h1 className="text-4xl font-semibold mb-3 dark:text-white">Haargos</h1>
        <p className="dark:text-gray-300">
          Your Clients' Smart Homes, Flawlessly Managed
        </p>
      </div>
      <div
        id="pricing"
        className="flex overflow-auto no-scrollbar  md:space-x-10 md:mx-24 space-x-10 pt-0 mx-24 mb-16"
      >
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="flex-1 pt-8 pb-10 overflow-x min-w-[80%] md:min-w-0"
          >
            <Link href={tier.href} passHref>
              <div className="flex flex-col h-full pt-4 rounded-xl space-y-6 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:scale-101 shadow-xl cursor-pointer dark:bg-gray-700 bg-slate-100">
                <div className="px-8 flex justify-between items-center">
                  <h4 className="text-xl font-bold dark:text-white">{tier.title}</h4>
                  <div className="dark:text-white text-gray-800">{tier.icon}</div>
                </div>
                <h1 className="text-4xl text-center font-bold dark:text-white">
                  {tier.price != null ? `$${tier.price}` : 'Contact Us'}
                </h1>
                <p className="px-4 text-center text-sm dark:text-gray-300">
                  {tier.description}
                </p>
                <ul className="text-center flex-1 leading-relaxed dark:text-gray-200">
                  {tier.features.map((feature, featureIndex) => (
                    <li className="font-semibold" key={featureIndex}>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-center mt-auto dark:bg-indigo-sr-700 bg-sr-600">
                  <button className="inline-block my-6 font-semibold  text-white">
                    {tier.footer}
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
