export default function Footer() {
  const links = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
    { name: 'Terms & Conditions', href: '/about/terms' },
    { name: 'Privacy Policy', href: '/about/privacy' },
    { name: 'FAQ', href: '/about/faq' },
  ];
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-6 flex flex-wrap justify-between items-center">
        <div className="w-full md:w-1/3 text-center md:text-left mb-6 md:mb-0">
          <a href="#" className="text-2xl font-bold">
            Haargos
          </a>
        </div>
        <div className="w-full md:w-2/3  align-right md:text-right">
          <div className="flex-inline md:flex flex-wrap items-center">
            {links.map(link => (
              <div className="my-4">
                <a href={link.href} className="px-4">
                  {link.name}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full text-center pt-6">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} SmartVision. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
