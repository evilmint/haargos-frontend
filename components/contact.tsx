export default function Contact() {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
            {/* Content for the first column if needed */}
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 mb-6 md:mb-0">
            <h2 className="text-4xl font-semibold text-gray-800 dark:text-white mb-6">Get in Touch</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Have questions? Our team is ready to help you!
            </p>
            <form id="contact" action="#" method="POST">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <textarea
                name="message"
                rows={4}
                placeholder="Your Message"
                className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-sr-600 dark:bg-sr-700 text-white px-4 py-2 rounded-md hover:bg-sr-700 dark:hover:bg-sr-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
