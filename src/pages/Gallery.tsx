import { motion } from 'motion/react';
import { useGallery } from '../context/GalleryContext';
import { Play } from 'lucide-react';

export default function Gallery() {
  const { galleryItems } = useGallery();

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Travel Gallery</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore beautiful destinations and travel memories from our community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-100">
                {item.type === 'video' ? (
                  <iframe 
                    src={item.url} 
                    title={item.title} 
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                )}
                {item.type === 'video' && (
                  <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-sm pointer-events-none">
                    <Play className="w-3 h-3" /> Video
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {galleryItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No gallery items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
