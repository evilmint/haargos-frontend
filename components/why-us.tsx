import { Icons } from './icons';

export default function WhyUs() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center pb-12">
        <h2 className="text-3xl font-semibold">Why Choose Us?</h2>
        <p className="text-gray-600 mt-4">
          We provide a comprehensive monitoring solution tailored for professional smart
          home administrators.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center space-x-0 sm:space-x-6 space-y-6 sm:space-y-0">
        <div className="w-full sm:w-1/3 lg:w-1/4 px-4 text-center flex flex-col">
          <div className="text-sr-600 flex justify-center items-center">
            <Icons.trendingUp className="w-12 h-12 mb-4" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
          <p className="text-gray-600">
            Instant access to performance data and analytics in real time.
          </p>
        </div>
        <div className="w-full sm:w-1/3 lg:w-1/4 px-4 text-center flex flex-col">
          <div className="text-sr-600 flex justify-center items-center">
            <Icons.healthline className="w-12 h-12 mb-4" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Maximized Uptime</h3>
          <p className="text-gray-600">
            Ensure your installations are always up and running optimally.
          </p>
        </div>
        <div className="w-full sm:w-1/3 lg:w-1/4 px-4 text-center flex flex-col">
          <div className="text-sr-600 flex justify-center items-center">
            <Icons.shieldCheck className="w-12 h-12 mb-4" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Uncompromised Security</h3>
          <p className="text-gray-600">
            State-of-the-art security measures to protect your data.
          </p>
        </div>
      </div>
    </div>
  );
}
