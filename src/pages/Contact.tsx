import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import ChatBot from '../components/ChatBot';

export default function Contact() {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/7827916794?text=Hi TripOnBudget, I have an inquiry.`, '_blank');
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Contact Us | TripOnBudget</title>
        <meta name="description" content="Chat with our AI assistant or get in touch with TripOnBudget. We're here to help you plan your next adventure." />
        <meta property="og:title" content="Contact Us | TripOnBudget" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">How Can We Help?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chat with our AI assistant for instant answers, or reach out to our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Our Office</h4>
                    <p className="text-gray-600 mt-1">Ballabgarh, Faridabad, Haryana</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <a href="tel:+917827916794" className="text-primary-600 hover:text-primary-700 mt-1 block">+91 78279 16794</a>
                    <p className="text-gray-600 text-sm">Mon-Sat, 9am-6pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <a href="mailto:padatvivek2@gmail.com" className="text-primary-600 hover:text-primary-700 mt-1 block">padatvivek2@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#20bd5a] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-6 h-6" />
                  Direct WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* AI Chat Agent */}
          <div className="lg:col-span-2">
            <ChatBot inline={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
