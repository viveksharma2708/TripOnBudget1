import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { blogPosts } from '../data/mockData';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog post not found</h2>
          <Link to="/blog" className="text-primary-600 hover:underline font-medium flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to all posts
        </Link>
        
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
        >
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-primary-600 shadow-sm">
              {post.category}
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-8 leading-tight">
              {post.title}
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-600">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
