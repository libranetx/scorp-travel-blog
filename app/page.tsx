import Link from 'next/link'
import PostView from '../components/post/PostView'
import PostsByTravelType from '@/components/post/PostsByTravelType';

async function getRecentPosts() {
  const res = await fetch('http://localhost:3000/api/posts', { 
    cache: 'no-store' 
  })
  if (!res.ok) throw new Error('Failed to fetch posts')
  const posts = await res.json()
  return posts.slice(0, 4) // Get only 3 most recent posts
}

export default async function Home() {
  const recentPosts = await getRecentPosts()
  const travelTypes = [
    "Cultural",
    "Family",
    "Honeymoon",
  ];

  return (
    <div className="w-full">
      {/* Enhanced Full-width Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-purple-900/70">
          <img 
            src="https://images.unsplash.com/photo-1668875915531-0be186bd38c0?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Travel background"
            className="w-full h-full object-cover mix-blend-overlay"
            loading="eager"
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
                recentPosts.map((post: any) => (
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