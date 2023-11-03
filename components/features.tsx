import { Icons } from './icons';

type Feature = {
  title: string;
  icon: JSX.Element | null;
  description: string;
};

export default function Features() {
  const features = [
    {
      title: 'Real-time Alerts',
      description:
        'Get instant notifications for any issues, ensuring prompt action when necessary.',
      icon: <Icons.git />,
    },
  ];
  return (
    <div id="features" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center pb-12">
          <h2 className="text-4xl font-semibold text-gray-800">Powerful Features</h2>
          <p className="text-lg leading-relaxed m-4 text-gray-600">
            Designed to deliver the ultimate monitoring experience.
          </p>
        </div>
        <div className="flex flex-wrap justify-center text-center">
          {features.map(feature => (
            <div className="w-full sm:w-1/2 md:w-1/3 xl:w-1/4 px-4 mb-8">
              <div className="px-6 py-8 rounded-lg bg-white shadow-lg">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h5 className="text-xl font-semibold mb-4">{feature.title}</h5>
                <p className="text-base text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
