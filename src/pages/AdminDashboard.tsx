import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackages } from '../context/PackageContext';
import { useAuth } from '../context/AuthContext';
import { useInquiries } from '../context/InquiryContext';
import { Trash2, Plus, Image as ImageIcon, Edit2, Users as UsersIcon, Package as PackageIcon, MessageSquare, Mail, CalendarCheck, Star } from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import { useTestimonials } from '../context/TestimonialContext';
import { useGallery } from '../context/GalleryContext';
import { motion } from 'motion/react';

export default function AdminDashboard() {
  const { packages, addPackage, updatePackage, removePackage, loading: packagesLoading } = usePackages();
  const { user, allUsers, deleteUserProfile, loading: authLoading } = useAuth();
  const { inquiries, deleteInquiry, loading: inquiriesLoading } = useInquiries();
  const { bookings, updateBookingStatus, updateBooking, deleteBooking, loading: bookingsLoading } = useBookings();
  const { testimonials, addTestimonial, updateTestimonial, removeTestimonial, loading: testimonialsLoading } = useTestimonials();
  const { galleryItems, addGalleryItem, updateGalleryItem, removeGalleryItem, loading: galleryLoading } = useGallery();

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'packages' | 'users' | 'inquiries' | 'bookings' | 'testimonials' | 'gallery'>('packages');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    date: '',
    travelers: 1,
    totalAmount: 0,
    userPhone: '',
    status: 'Waiting' as 'Waiting' | 'Confirmed' | 'Completed',
    paymentStatus: 'Pending' as 'Pending' | 'Completed'
  });
  
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialFormData, setTestimonialFormData] = useState({
    name: '',
    role: '',
    content: '',
    avatar: ''
  });

  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryFormData, setGalleryFormData] = useState({
    type: 'image' as 'image' | 'video',
    url: '',
    title: ''
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate, authLoading]);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    duration: '',
    price: '',
    originalPrice: '',
    singlePrice: '',
    groupPrice: '',
    image: '',
    category: 'Domestic',
    description: '',
    inclusions: '',
    exclusions: '',
    itinerary: '',
    gallery: '',
    video: '',
    packageDate: '',
    rating: '4.5',
    reviews: '0'
  });

  if (authLoading) {
    return (
      <div className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const serializeItinerary = (itinerary: any[]) => {
    if (!itinerary) return '[]';
    try {
      return JSON.stringify(itinerary, null, 2);
    } catch {
      return '[]';
    }
  };

  const parseItinerary = (text: string) => {
    if (!text.trim()) return [];
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse itinerary JSON", e);
      return [];
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setFormData({
      title: pkg.title,
      location: pkg.location,
      duration: pkg.duration,
      price: pkg.price.toString(),
      originalPrice: pkg.originalPrice.toString(),
      singlePrice: pkg.singlePrice ? pkg.singlePrice.toString() : '',
      groupPrice: pkg.groupPrice ? pkg.groupPrice.toString() : '',
      image: pkg.image,
      category: pkg.category,
      description: pkg.description,
      inclusions: pkg.inclusions ? pkg.inclusions.join('\n') : '',
      exclusions: pkg.exclusions ? pkg.exclusions.join('\n') : '',
      itinerary: serializeItinerary(pkg.itinerary),
      gallery: pkg.gallery ? pkg.gallery.join('\n') : '',
      video: pkg.video || '',
      packageDate: pkg.packageDate || '',
      rating: (pkg.rating || 4.5).toString(),
      reviews: (pkg.reviews || 0).toString()
    });
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a basic package object
    const newPkg = {
      title: formData.title,
      location: formData.location,
      duration: formData.duration,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      singlePrice: formData.singlePrice ? Number(formData.singlePrice) : Number(formData.price),
      groupPrice: formData.groupPrice ? Number(formData.groupPrice) : Number(formData.price),
      image: formData.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1000",
      category: formData.category,
      description: formData.description,
      itinerary: parseItinerary(formData.itinerary),
      inclusions: formData.inclusions.split('\n').filter(i => i.trim()),
      exclusions: formData.exclusions.split('\n').filter(e => e.trim()),
      gallery: formData.gallery.split('\n').filter(url => url.trim()),
      video: formData.video.trim(),
      packageDate: formData.packageDate,
      rating: Number(formData.rating),
      reviews: Number(formData.reviews)
    };

    if (editingId) {
      await updatePackage(editingId, newPkg);
    } else {
      await addPackage(newPkg);
    }
    
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '', location: '', duration: '', price: '', originalPrice: '', singlePrice: '', groupPrice: '', image: '', category: 'Domestic', description: '', inclusions: '', exclusions: '', itinerary: '', gallery: '', video: '', packageDate: '', rating: '4.5', reviews: '0'
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '', location: '', duration: '', price: '', originalPrice: '', singlePrice: '', groupPrice: '', image: '', category: 'Domestic', description: '', inclusions: '', exclusions: '', itinerary: '', gallery: '', video: '', packageDate: '', rating: '4.5', reviews: '0'
    });
  };

  const handleEditTestimonial = (test: any) => {
    setEditingTestimonialId(test.id);
    setTestimonialFormData({
      name: test.name,
      role: test.role,
      content: test.content,
      avatar: test.avatar
    });
    setIsAddingTestimonial(true);
  };

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTestimonialId) {
      await updateTestimonial(editingTestimonialId, testimonialFormData);
    } else {
      await addTestimonial(testimonialFormData);
    }
    setIsAddingTestimonial(false);
    setEditingTestimonialId(null);
    setTestimonialFormData({ name: '', role: '', content: '', avatar: '' });
  };

  const handleCancelTestimonial = () => {
    setIsAddingTestimonial(false);
    setEditingTestimonialId(null);
    setTestimonialFormData({ name: '', role: '', content: '', avatar: '' });
  };

  const handleEditGallery = (item: any) => {
    setEditingGalleryId(item.id);
    setGalleryFormData({
      type: item.type,
      url: item.url,
      title: item.title
    });
    setIsAddingGallery(true);
  };

  const handleSubmitGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGalleryId) {
      await updateGalleryItem(editingGalleryId, galleryFormData);
    } else {
      await addGalleryItem(galleryFormData);
    }
    setIsAddingGallery(false);
    setEditingGalleryId(null);
    setGalleryFormData({ type: 'image', url: '', title: '' });
  };

  const handleCancelGallery = () => {
    setIsAddingGallery(false);
    setEditingGalleryId(null);
    setGalleryFormData({ type: 'image', url: '', title: '' });
  };

  const handleEditBooking = (booking: any) => {
    setEditingBookingId(booking.id);
    setBookingFormData({
      date: booking.date,
      travelers: booking.travelers,
      totalAmount: booking.totalAmount,
      userPhone: booking.userPhone || '',
      status: booking.status,
      paymentStatus: booking.paymentStatus || 'Pending'
    });
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBookingId) {
      await updateBooking(editingBookingId, bookingFormData);
      setEditingBookingId(null);
    }
  };

  const handleCancelBooking = () => {
    setEditingBookingId(null);
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your platform</p>
          </div>
          {activeTab === 'packages' && (
            <button 
              onClick={isAdding ? handleCancel : () => setIsAdding(true)}
              className="bg-primary-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              {isAdding ? 'Cancel' : <><Plus className="w-5 h-5" /> Add Package</>}
            </button>
          )}
        </div>

        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('packages')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'packages' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <PackageIcon className="w-4 h-4" />
              Manage Packages
            </div>
            {activeTab === 'packages' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'users' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <UsersIcon className="w-4 h-4" />
              Registered Users
            </div>
            {activeTab === 'users' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'inquiries' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Inquiries
              {inquiries.length > 0 && (
                <span className="bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full text-xs font-bold">
                  {inquiries.length}
                </span>
              )}
            </div>
            {activeTab === 'inquiries' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'bookings' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4" />
              Bookings
              {bookings.length > 0 && (
                <span className="bg-primary-100 text-primary-700 py-0.5 px-2 rounded-full text-xs font-bold">
                  {bookings.length}
                </span>
              )}
            </div>
            {activeTab === 'bookings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'testimonials' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Testimonials
            </div>
            {activeTab === 'testimonials' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'gallery' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Gallery
            </div>
            {activeTab === 'gallery' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full" />
            )}
          </button>
        </div>

        {activeTab === 'packages' && isAdding && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Package' : 'Add New Package'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Title</label>
                  <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Magical Ladakh" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Ladakh, India" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 7 Days / 6 Nights" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Date (Set by Admin)</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.packageDate} onChange={e => setFormData({...formData, packageDate: e.target.value})} placeholder="e.g. 24 May 2026" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Domestic">Domestic</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Spiritual">Spiritual</option>
                    <option value="Weekend trips">Weekend trips</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹)</label>
                  <input required type="number" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 25000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                  <input required type="number" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} placeholder="e.g. 30000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Single Person Price (₹)</label>
                  <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.singlePrice} onChange={e => setFormData({...formData, singlePrice: e.target.value})} placeholder="Leave blank to use default" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Group Price (Min 5) (₹)</label>
                  <input type="number" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.groupPrice} onChange={e => setFormData({...formData, groupPrice: e.target.value})} placeholder="Leave blank to use default" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating (Star)</label>
                  <input required type="number" step="0.1" min="0" max="5" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Review Count</label>
                  <input required type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.reviews} onChange={e => setFormData({...formData, reviews: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL (Front Photo)</label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input required type="url" className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/photo-..." />
                      </div>
                    </div>
                    {formData.image && (
                      <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gallery URLs (One per line)</label>
                  <textarea rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" value={formData.gallery} onChange={e => setFormData({...formData, gallery: e.target.value})} placeholder="https://image1...&#10;https://image2..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea required rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief description of the package..."></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Itinerary (JSON format)</label>
                  <textarea rows={6} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm" value={formData.itinerary} onChange={e => setFormData({...formData, itinerary: e.target.value})} placeholder="[&#10;  {&#10;    &quot;day&quot;: 1,&#10;    &quot;title&quot;: &quot;Arrival&quot;,&#10;    &quot;description&quot;: &quot;Welcome to your destination...&quot;&#10;  }&#10;]"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions (One per line)</label>
                  <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" value={formData.inclusions} onChange={e => setFormData({...formData, inclusions: e.target.value})} placeholder="Accommodation&#10;Breakfast&#10;Transfers"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions (One per line)</label>
                  <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" value={formData.exclusions} onChange={e => setFormData({...formData, exclusions: e.target.value})} placeholder="Flights&#10;Personal Expenses"></textarea>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">
                  {editingId ? 'Update Package' : 'Save Package'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-600">Package</th>
                    <th className="p-4 font-semibold text-gray-600">Location</th>
                    <th className="p-4 font-semibold text-gray-600">Price</th>
                    <th className="p-4 font-semibold text-gray-600">Category</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={pkg.image} alt={pkg.title} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <span className="font-medium text-gray-900">{pkg.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{pkg.location}</td>
                      <td className="p-4 font-medium text-gray-900">₹{(pkg.price || 0).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                          {pkg.category}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(pkg)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Package"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => {
                              showConfirm(
                                'Delete Package',
                                'Are you sure you want to delete this package? This action cannot be undone.',
                                () => removePackage(pkg.id)
                              );
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Package"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {packages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">
                        No packages found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-600">Name</th>
                    <th className="p-4 font-semibold text-gray-600">Email</th>
                    <th className="p-4 font-semibold text-gray-600">Role</th>
                    <th className="p-4 font-semibold text-gray-600">Joined Date</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((u) => {
                    const isFake = !u.email.includes('@') || u.email.endsWith('fake.com');
                    return (
                    <tr key={u.id} className={`border-b border-gray-50 transition-colors ${isFake ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50/50'}`}>
                      <td className={`p-4 font-medium ${isFake ? 'text-red-900' : 'text-gray-900'}`}>
                        {u.name} {isFake && <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">Fake</span>}
                      </td>
                      <td className={`p-4 ${isFake ? 'text-red-700' : 'text-gray-600'}`}>{u.email}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className={`p-4 ${isFake ? 'text-red-700' : 'text-gray-600'}`}>{u.joinDate}</td>
                      <td className="p-4 text-right">
                        {u.id !== user?.id && (
                          <button 
                            onClick={() => {
                              showConfirm(
                                'Delete User',
                                `Are you sure you want to delete user ${u.name}? This will remove their profile from the database.`,
                                () => deleteUserProfile(u.id)
                              );
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User Record"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {inquiries.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Inquiries Yet</h3>
                <p className="text-gray-500">When users send messages through the contact form, they will appear here.</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                  <button 
                    onClick={() => {
                      showConfirm(
                        'Delete Inquiry',
                        'Are you sure you want to delete this inquiry?',
                        () => deleteInquiry(inquiry.id)
                      );
                    }}
                    className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete Inquiry"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{inquiry.subject}</h3>
                      <p className="text-sm text-gray-500">
                        From: <span className="font-medium text-gray-900">{inquiry.name}</span> ({inquiry.email})
                      </p>
                      <p className="text-sm text-gray-500">
                        Phone: <span className="font-medium text-gray-900">{inquiry.phone}</span>
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(inquiry.date).toLocaleDateString()} at {new Date(inquiry.date).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap">
                    {inquiry.message}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <a 
                      href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}&body=${encodeURIComponent(`Hi ${inquiry.name},\n\nRegarding your inquiry:\n"${inquiry.message}"\n\n`)}`}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      Reply via Email
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {editingBookingId && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Booking #{editingBookingId.slice(-6)}</h2>
                <form onSubmit={handleSubmitBooking} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Travelers</label>
                      <input required type="number" min="1" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={bookingFormData.travelers} onChange={e => setBookingFormData({...bookingFormData, travelers: parseInt(e.target.value) || 1})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₹)</label>
                      <input required type="number" min="0" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={bookingFormData.totalAmount} onChange={e => setBookingFormData({...bookingFormData, totalAmount: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                      <input required type="text" maxLength={10} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={bookingFormData.userPhone} onChange={e => setBookingFormData({...bookingFormData, userPhone: e.target.value.replace(/\D/g, '')})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={bookingFormData.status}
                        onChange={e => setBookingFormData({...bookingFormData, status: e.target.value as any})}
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={bookingFormData.paymentStatus}
                        onChange={e => setBookingFormData({...bookingFormData, paymentStatus: e.target.value as any})}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button type="button" onClick={handleCancelBooking} className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">
                      Update Booking
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-4 font-semibold text-gray-600">Booking ID</th>
                    <th className="p-4 font-semibold text-gray-600">User Details</th>
                    <th className="p-4 font-semibold text-gray-600">Package</th>
                    <th className="p-4 font-semibold text-gray-600">Travel Date</th>
                    <th className="p-4 font-semibold text-gray-600">Travelers</th>
                    <th className="p-4 font-semibold text-gray-600">Amount</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600">Payment</th>
                    <th className="p-4 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const isFake = b.isFakeName || !b.userEmail.includes('@') || b.userEmail.endsWith('fake.com');
                    return (
                    <tr key={b.id} className={`border-b border-gray-50 transition-colors ${isFake ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50/50'}`}>
                      <td className="p-4 text-gray-500 text-sm">#{b.id.slice(-6)}</td>
                      <td className="p-4">
                        <div className={`font-medium ${isFake ? 'text-red-900' : 'text-gray-900'}`}>
                          {b.userName} {isFake && <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">Fake</span>}
                        </div>
                        <div className={`text-sm ${isFake ? 'text-red-700' : 'text-gray-500'}`}>{b.userEmail}</div>
                        <div className={`text-sm font-bold ${isFake ? 'text-red-700' : 'text-primary-600'}`}>+91 {b.userPhone}</div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">{b.packageTitle}</td>
                      <td className="p-4 text-gray-600">{b.date}</td>
                      <td className="p-4 text-gray-600">{b.travelers}</td>
                      <td className="p-4 font-medium text-gray-900">₹{(b.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          b.status === 'Confirmed' ? 'bg-green-50 text-green-700' : 
                          b.status === 'Waiting' ? 'bg-yellow-50 text-yellow-700' : 
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          b.paymentStatus === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {b.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <button 
                          onClick={() => handleEditBooking(b)}
                          className="p-1.5 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Booking details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <a 
                          href={`mailto:${b.userEmail}?subject=Booking Confirmation: ${encodeURIComponent(b.packageTitle)}&body=${encodeURIComponent(`Hi ${b.userName},\n\nYour booking for ${b.packageTitle} on ${b.date} for ${b.travelers} traveler(s) has been confirmed!\n\nTotal Amount: ₹${b.totalAmount.toLocaleString('en-IN')}\n\nWe will send you the detailed itinerary shortly.\n\nBest regards,\nTripOnBudget Team`)}`}
                          className="bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" /> Send Confirmation
                        </a>
                        <button 
                          onClick={() => {
                            showConfirm(
                              'Delete Booking',
                              'Are you sure you want to delete this booking? This action is irreversible.',
                              () => deleteBooking(b.id)
                            );
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ml-auto"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    );
                  })}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Manage Testimonials</h2>
              <button 
                onClick={() => {
                  setIsAddingTestimonial(true);
                  setEditingTestimonialId(null);
                  setTestimonialFormData({ name: '', role: '', content: '', avatar: '' });
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Testimonial
              </button>
            </div>

            {isAddingTestimonial && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{editingTestimonialId ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
                <form onSubmit={handleSubmitTestimonial} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reviewer Name</label>
                      <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={testimonialFormData.name} onChange={e => setTestimonialFormData({...testimonialFormData, name: e.target.value})} placeholder="e.g. John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role / Location</label>
                      <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={testimonialFormData.role} onChange={e => setTestimonialFormData({...testimonialFormData, role: e.target.value})} placeholder="e.g. Solo Traveler" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
                      <input required type="url" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={testimonialFormData.avatar} onChange={e => setTestimonialFormData({...testimonialFormData, avatar: e.target.value})} placeholder="https://images.unsplash.com/photo-..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Review Content</label>
                      <textarea required rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none resize-none" value={testimonialFormData.content} onChange={e => setTestimonialFormData({...testimonialFormData, content: e.target.value})} placeholder="What did they say?"></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button type="button" onClick={handleCancelTestimonial} className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">
                      {editingTestimonialId ? 'Update Testimonial' : 'Save Testimonial'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((test) => (
                <div key={test.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditTestimonial(test)} className="p-2 text-gray-400 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        showConfirm(
                          'Delete Testimonial',
                          'Are you sure you want to delete this testimonial?',
                          () => removeTestimonial(test.id)
                        );
                      }} 
                      className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={test.avatar} alt={test.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-gray-900">{test.name}</h4>
                      <p className="text-sm text-gray-500">{test.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm line-clamp-4">"{test.content}"</p>
                </div>
              ))}
              {testimonials.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                  No testimonials found. Add some to show on the home page!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Manage Gallery</h2>
              <button 
                onClick={() => {
                  setIsAddingGallery(true);
                  setEditingGalleryId(null);
                  setGalleryFormData({ type: 'image', url: '', title: '' });
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Media
              </button>
            </div>

            {isAddingGallery && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{editingGalleryId ? 'Edit Media' : 'Add New Media'}</h2>
                <form onSubmit={handleSubmitGallery} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                      <select 
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none"
                        value={galleryFormData.type}
                        onChange={e => setGalleryFormData({...galleryFormData, type: e.target.value as 'image' | 'video'})}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title / Caption</label>
                      <input required type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={galleryFormData.title} onChange={e => setGalleryFormData({...galleryFormData, title: e.target.value})} placeholder="e.g. Beautiful Sunset" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Media URL {galleryFormData.type === 'video' ? '(e.g., YouTube Embed URL)' : '(Image URL)'}</label>
                      <input required type="url" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none" value={galleryFormData.url} onChange={e => setGalleryFormData({...galleryFormData, url: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4">
                    <button type="button" onClick={handleCancelGallery} className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                    <button type="submit" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">
                      {editingGalleryId ? 'Update Media' : 'Save Media'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group">
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button onClick={() => handleEditGallery(item)} className="p-2 text-gray-700 hover:text-primary-600 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm" title="Edit Media">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        showConfirm(
                          'Delete Media Item',
                          'Are you sure you want to delete this media item?',
                          () => removeGalleryItem(item.id)
                        );
                      }} 
                      className="p-2 text-gray-700 hover:text-red-600 bg-white/90 hover:bg-white rounded-lg transition-colors shadow-sm" title="Delete Media">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="aspect-video relative bg-gray-100">
                    {item.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 font-medium">Video Embed</span>
                      </div>
                    ) : (
                      <img src={item.url} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                      {item.type}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 truncate">{item.title}</h4>
                  </div>
                </div>
              ))}
              {galleryItems.length === 0 && (
                <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                  No media found in the gallery.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">{confirmModal.message}</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
