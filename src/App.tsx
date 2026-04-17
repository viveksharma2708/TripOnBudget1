/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PackageProvider } from './context/PackageContext';
import { AuthProvider } from './context/AuthContext';
import { InquiryProvider } from './context/InquiryContext';
import { BookingProvider } from './context/BookingContext';
import { TestimonialProvider } from './context/TestimonialContext';
import { GalleryProvider } from './context/GalleryContext';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Gallery from './pages/Gallery';

export default function App() {
  return (
    <AuthProvider>
      <TestimonialProvider>
        <GalleryProvider>
          <PackageProvider>
            <InquiryProvider>
              <BookingProvider>
                <Router>
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="packages" element={<Packages />} />
                      <Route path="packages/:id" element={<PackageDetail />} />
                      <Route path="booking-confirmation" element={<BookingConfirmation />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="blog" element={<Blog />} />
                      <Route path="blog/:id" element={<BlogDetail />} />
                      <Route path="gallery" element={<Gallery />} />
                      <Route path="auth" element={<Auth />} />
                      <Route path="admin" element={<AdminDashboard />} />
                      <Route path="dashboard" element={<UserDashboard />} />
                    </Route>
                  </Routes>
                </Router>
              </BookingProvider>
            </InquiryProvider>
          </PackageProvider>
        </GalleryProvider>
      </TestimonialProvider>
    </AuthProvider>
  );
}
