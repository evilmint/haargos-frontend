export default function Hero() {
  return (
    <div className="bg-cover bg-center h-screen" style={{backgroundImage: `url("/electric-car-5.jpg")`}}>
      <div className="flex items-center justify-center h-full w-full bg-gray-900 bg-opacity-50">
        <div className="text-center">
          <h1 className="text-5xl text-white font-bold mb-4">
            Your Clients' Smart Homes,{' '}
            <span className="text-indigo-500">Flawlessly Managed</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10">
            Centralized monitoring and management for professional smart home
            installations.
          </p>
          <a
            href="#pricing"
            className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-600 transition duration-300 ease-in-out"
          >
            Start Your Free Trial
          </a>
        </div>
      </div>
    </div>
  );
}
