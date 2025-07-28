"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PostView from "./PostView";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  travelType?: string;
  imageUrl?: string;
}

export default function PostsByTravelType({ travelType }: { travelType: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts?travelType=${travelType}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [travelType]);

  if (loading) {
    return (
      <div className="w-full border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading {travelType} posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-b border-gray-200 last:border-b-0">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
              {travelType} Adventures
            </span>
          </h2>
          {posts.length > 3 && (
            <Link 
              href={`/posts?travelType=${travelType}`}
              className="text-blue-600 hover:underline font-medium flex items-center text-lg"
            >
              View All {travelType} Posts
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <PostView 
              key={post.id} 
              post={post} 
              compact={true} 
              overrideShowEditButton={false} 
              overrideShowDeleteButton={false} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}