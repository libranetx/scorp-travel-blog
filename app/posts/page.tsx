"use client";

import { useState, useEffect, useMemo } from "react";
import PostView from "../../components/post/PostView";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  travelType?: string;
}

const travelTypes = [
  "All",
  "Adventure",
  
  "Cultural",
  "Family",
  "Honeymoon",
  
  "Solo",
  "Group",
  "Luxury",
  "Business",
] as const;

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTravelType, setSelectedTravelType] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Filter posts based on search term and travel type
  const filteredPosts = useMemo(() => {
    let result = posts;
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by travel type
    if (selectedTravelType !== "All") {
      result = result.filter(post => post.travelType === selectedTravelType);
    }
    
    return result;
  }, [searchTerm, posts, selectedTravelType]);

  // Get current posts
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [currentPage, filteredPosts, postsPerPage]);

  // Reset to first page when search term or travel type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTravelType]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Generate visible page numbers (with ellipsis logic)
  const visiblePages = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, currentPage + half);

      if (currentPage <= half) {
        end = maxVisiblePages;
      } else if (currentPage >= totalPages - half) {
        start = totalPages - maxVisiblePages + 1;
      }

      // Always show first page
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push("ellipsis-left");
        }
      }

      // Middle pages
      for (let i = start; i <= end; i++) {
        if (i > 0 && i <= totalPages) {
          pages.push(i);
        }
      }

      // Always show last page
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push("ellipsis-right");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error)
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="w-full md:w-180 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={selectedTravelType}
              onValueChange={setSelectedTravelType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {travelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {currentPosts.length === 0 ? (
        <div className="text-center py-8">
          {searchTerm || selectedTravelType !== "All" 
            ? "No matching posts found" 
            : "No posts available"}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentPosts.map((post) => (
              <div
                key={post.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <PostView
                  post={post}
                  mode="view"
                  overrideShowEditButton={false}
                  overrideShowDeleteButton={false}
                  compact={true}
                />
              </div>
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {visiblePages.map((page, index) => {
                  if (page === "ellipsis-left" || page === "ellipsis-right") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page as number);
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}