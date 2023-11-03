import { Icons } from './icons';

type Tier = {
  title: string;
  price: number | null;
  icon: JSX.Element | null;
  description: string;
  features: string[];
  footer: string;
};

export default function PricingTiers() {
  const tiers: Tier[] = [
    {
      title: 'Free',
      price: 0.0,
      icon: <Icons.healthline />,
      description:
        'Monitor one HomeAssistant installation with basic analytics and limited email alerts.',
      features: [
        '1 installation',
        'Basic analytics',
        'Email alerts with daily rate limit',
        'Basic e-mail support',
        'Data history for 1 week',
      ],
      footer: 'Sign up for free',
    },
    {
      title: 'Basic',
      price: 5.0,
      icon: <Icons.zap />,
      description:
        'Ideal for individual users with up to 3 installations requiring enhanced analytics.',
      features: [
        'Up to 3 installations',
        'Docker support',
        'Unlimited email alerts',
        'Priority email support',
        'Data history for 1 month',
      ],
      footer: 'Start with Basic',
    },
    {
      title: 'Professional',
      price: 15.0,
      icon: <Icons.cpu />,
      description:
        'Unlimited installations and full analytics suite for professional installers.',
      features: [
        'Unlimited installations',
        'Full analytics suite',
        'Instant email and SMS alerts',
        'High priority support with account manager',
        'API access',
        'Unlimited data history',
      ],
      footer: 'Upgrade to Professional',
    },
    {
      title: 'Enterprise',
      price: null,
      icon: <Icons.memory />,
      description:
        'Customizable solutions with white labeling and on-premises options for enterprises.',
      features: [
        'All Professional features plus custom options',
        'White labeling',
        'On-premises deployment',
        '24/7 support and dedicated account manager',
        'Training sessions for staff',
      ],
      footer: 'Contact for Enterprise solution',
    },
  ];

  return (
    <>
      <div className="mx-auto text-center my-12">
        <h1 className="text-4xl font-semibold mb-3">Haargos</h1>
        <p>Your Clients' Smart Homes, Flawlessly Managed</p>
      </div>
      <div id="pricing" className="flex space-x-10 pt-0 mx-24">
        {tiers.map(tier => (
          <div className="flex-1 ">
            <div className="bg-slate-100 flex flex-col h-full pt-4 rounded-xl space-y-6 overflow-hidden  transition-all duration-500 transform hover:-translate-y-2 hover:scale-101 shadow-xl cursor-pointer flex-col flex">
              <div className="px-8 flex flex-1 justify-between items-center">
                <h4 className="text-xl font-bold text-gray-800">{tier.title}</h4>
                {tier.icon}
              </div>
              <h1 className="text-4xl text-center font-bold">
                {tier.price != null ? `$${tier.price}` : 'Flexible'}
              </h1>
              <p className="px-4 text-center text-sm ">{tier.description}</p>
              <ul className="text-center leading-relaxed">
                {tier.features.map(feature => (
                  <li>
                    <a href="#" className="font-semibold">
                      {feature}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="text-center bg-slate-200">
                <button className="inline-block my-6 font-bold text-gray-800">
                  {tier.footer}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
