import { Icons } from './icons';

type WIHItem = {
  title: string;
  icon: JSX.Element;
  description: string;
};

export default function WhatIsHaargos() {
  const whyUsItems: WIHItem[] = [
    {
      title: 'Easy Installation',
      icon: <Icons.cog6tooth className="w-12 h-12 mb-4" />,
      description:
        'Haargos can be installed as a Home Assistant Addon, a docker container, or as a standalone binary application.',
    },
    {
      title: 'Real-Time Monitoring',
      icon: <Icons.trendingUp className="w-12 h-12 mb-4" />,
      description:
        'Real-time insights of your Addons, Zigbee devices, entities, host information and more.',
    },
    // {
    //   title: 'Enhanced Device Analysis',
    //   icon: <Icons.healthline className="w-12 h-12 mb-4" />,
    //   description: 'Deep dive into the analytics of connected devices, including Zigbee and other IoT components, for efficient management and troubleshooting.',
    // },
    // {
    //   title: 'Automated Alerts',
    //   icon: <Icons.bell className="w-12 h-12 mb-4" />,
    //   description: 'Receive instant alerts on critical events and potential issues, enabling proactive maintenance and minimized downtime.',
    // },
    {
      title: 'Comprehensive Dashboard',
      icon: <Icons.list className="w-12 h-12 mb-4" />,
      description:
        'Access all essential metrics through a user-friendly dashboard, tailored for quick insights.',
    },
  ];

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center pb-12">
        <h2 className="text-3xl font-semibold">What is Haargos?</h2>
        <p className="text-gray-600 mt-4">
          Haargos is the tool for comprehensive administering of your Home Assistant
          instances.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center space-x-0 sm:space-x-6 space-y-6 sm:space-y-0">
        {whyUsItems.map((item, index) => (
          <div
            key={index}
            className="w-full sm:w-1/3 lg:w-1/4 px-4 text-center flex flex-col"
          >
            <div className="text-sr-600 flex justify-center items-center">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
