export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 flex flex-wrap justify-between items-center">
        <div className="w-full md:w-1/3 text-center md:text-left mb-6 md:mb-0">
          <a href="#" className="text-2xl font-bold">
            Haargos
          </a>
        </div>
        <div className="w-full md:w-2/3 text-center md:text-right">
          <ul className="inline-flex items-center">
            <li>
              <a href="#" className="px-4">
                Home
              </a>
            </li>
            <li>
              <a href="#features" className="px-4">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="px-4">
                Pricing
              </a>
            </li>
            <li>
              <a href="#contact" className="px-4">
                Contact
              </a>
            </li>

            <li>
              <a href="/about/terms" className="px-4">
                Terms & Conditions
              </a>
            </li>

            <li>
              <a href="/about/privacy" className="px-4">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full text-center pt-6">
          <p className="text-sm text-gray-400">
            &copy; 2023 SmartVision. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
