import { Icons } from './icons';

type Feature = {
  title: string;
  icon: JSX.Element | null;
  description: string;
};

export default function Features() {
  const features: Feature[] = [
    {
      title: 'Real-time Alerts',
      description:
        'Get instant notifications for any issues, ensuring prompt action when necessary.',
      icon: <Icons.bell />, // Replace with your actual alert icon component
    },
    {
      title: 'Automated Reports',
      description:
        'Automatically diagnose and receive reports on the health and performance of your smart home systems.',
      icon: <Icons.mail />, // Replace with your actual diagnostics icon component
    },
    {
      title: 'Comprehensive Dashboards',
      description:
        'Visualize your smart home data with customizable dashboards that provide insightful analytics.',
      icon: <Icons.monitor />, // Replace with your actual dashboard icon component
    },
    {
      title: 'Multi-Installation Management',
      description:
        'Easily manage multiple HomeAssistant installations from a single, intuitive interface.',
      icon: <Icons.layers />, // Replace with your actual management icon component
    },
  ];

  return (
    <div id="features" className="py-16 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center pb-12">
          <h2 className="text-4xl font-semibold text-gray-800 dark:text-white">
            Powerful Features
          </h2>
          <p className="text-lg leading-relaxed m-4 text-gray-600 dark:text-gray-300">
            Designed to deliver the ultimate monitoring experience.
          </p>
        </div>
        <div className="flex flex-wrap justify-center text-center">
          {features.map((feature, index) => (
            <div key={index} className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 flex px-4 mb-8">
              <div className="px-6 py-8 rounded-lg flex flex-col bg-white dark:bg-gray-700 shadow-lg">
                <div className="mb-4 flex justify-center text-sr-600  dark:text-sr-700">
                  {feature.icon}
                </div>
                <h5 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                  {feature.title}
                </h5>
                <p className="text-base text-gray-600 dark:text-gray-400 flex-1 ">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
