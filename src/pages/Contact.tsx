import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useInquiries } from '../context/InquiryContext';
import { useAuth } from '../context/AuthContext';

export default function Contact() {
  const { addInquiry } = useInquiries();
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to send a message.');
      return;
    }
    
    if (formData.email !== user.email || formData.name !== user.name) {
      setError('Name and email must match your registered account details.');
      return;
    }
    
    setError('');
    
    // Add inquiry to context (Admin can view this in Dashboard)
    await addInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'N/A',
      subject: formData.subject,
      message: formData.message
    });
    
    // Show success message
    setIsSubmitted(true);
    
    // Reset form
    setFormData({ name: user.name, email: user.email, phone: '', subject: '', message: '' });
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/7827916794?text=Hi TripOnBudget, I have an inquiry.`, '_blank');
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Contact Us | TripOnBudget</title>
        <meta name="description" content="Get in touch with TripOnBudget. We're here to help you plan your next adventure." />
        <meta property="og:title" content="Contact Us | TripOnBudget" />
        <meta property="og:description" content="Get in touch with TripOnBudget. We're here to help you plan your next adventure." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about a package or need help planning your trip? Our team is here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info & Map */}
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
                    <p className="text-gray-600">Mon-Sat, 9am-6pm</p>
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
                  Chat on WhatsApp
                </button>
              </div>
            </div>

            {/* Simple Map Placeholder */}
            <div className="bg-gray-200 h-64 rounded-3xl overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
                alt="Map" 
                className="w-full h-full object-cover opacity-50"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white px-4 py-2 rounded-lg shadow-md font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  We are here
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Send us a Message</h3>
              {error && (
                <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required
                      readOnly={!!user}
                      className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${user ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      readOnly={!!user}
                      className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all ${user ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                      placeholder="Inquiry about Bali Package"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitted}
                  className={`w-full text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md flex items-center justify-center gap-2 ${
                    isSubmitted ? 'bg-green-500 hover:bg-green-600' : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
