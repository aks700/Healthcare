import React from 'react';

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 px-6 py-16 text-gray-800">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-lg text-gray-600">
          Have questions, feedback, or need support? We're here to help. Reach out to us anytime.
        </p>
      </div>

      {/* Contact Info & Form */}
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
            <p className="text-gray-600">
              Feel free to reach out via phone or email. You can also use the form to send us a message directly.
            </p>
          </div>

          <div>
            <p className="text-gray-700"><strong>📍 Address:</strong> 123 Health Street, Wellness City, 56789</p>
            <p className="text-gray-700"><strong>📞 Phone:</strong> +1 (234) 567-8901</p>
            <p className="text-gray-700"><strong>✉️ Email:</strong> support@healthcarebook.com</p>
            <p className="text-gray-700"><strong>🕒 Hours:</strong> Mon - Fri: 9:00 AM – 6:00 PM</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Follow Us</h3>
            <div className="flex gap-4 text-blue-600 text-2xl">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">📘</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📸</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">🔗</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-white rounded-xl p-8 shadow-md space-y-6">
          <div>
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Message</label>
            <textarea
              rows="4"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Your message here..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 rounded-md hover:bg-slate-800 transition"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Embedded Map */}
      <div className="mt-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-center">Visit Us</h2>
        <iframe
          title="Clinic Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.3945229639207!2d81.30519477503691!3d21.216198580480448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a293d0fd98b5f0f%3A0xf5808c843a7ce7e2!2sSSTC!5e0!3m2!1sen!2sin!4v1748630790477!5m2!1sen!2sin"
          width="100%"
          height="300"
          className="border-0 rounded-xl shadow-md"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;
