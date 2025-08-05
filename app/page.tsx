import Link from 'next/link'
import Image from 'next/image'
import PostView from '../components/post/PostView'
import PostsByTravelType from '@/components/post/PostsByTravelType';
import { prisma } from '@/lib/prisma';

async function getRecentPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 4
    });
    
    // Convert Date objects to strings and handle null values to match the Post interface
    return posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      travelType: post.travelType || undefined,
      imageUrl: post.imageUrl || undefined,
      imagePublicId: post.imagePublicId || undefined
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function Home() {
  const recentPosts = await getRecentPosts()
  const travelTypes = [
    "Cultural",
    "Family",
    "Honeymoon",
  ];
//it is working
  return (
    <div className="w-full">
      {/* Enhanced Full-width Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70">
          <Image 
            src="/hero.avif" 
            alt="Travel background"
            fill
            className="object-cover mix-blend-overlay"
            priority
          />
        </div>
        
        {/* Content Container */}
        <div className="container mx-auto px-4 relative h-full flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-6 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome to My Travel Blog
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md px-4">
              Discover Delightful Travel Stories, Tips, And Guides From Around The World.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/posts"
                className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Our Stories
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scrolling indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>
      

      {/* Main Content */}
      <main className="w-full">
        {/* Recent Posts Section - Full width background */}
        <section className="w-full py-8 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
                  Recent Adventures
                </span>
              </h2>
              <Link 
                href="/posts"
                className="text-blue-600 hover:underline font-medium text-lg flex items-center"
              >
                View All Stories
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recentPosts.length > 0 ? (
                recentPosts.map((post: { id: number; title: string; content: string; travelType?: string; imageUrl?: string; createdAt: string; updatedAt: string }) => (
                  <div key={post.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                    <PostView post={post} mode="view" overrideShowEditButton={false} overrideShowDeleteButton={false} compact={true} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-xl">No adventures yet. Be the first to share your story!</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Travel Types Section - Full width background */}
        <div className="w-full bg-white py-12 ">
          <div className="container mx-auto px-4">
            <div className="space-y-0 ">
              {travelTypes.map((type) => (
                <PostsByTravelType key={type} travelType={type} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}