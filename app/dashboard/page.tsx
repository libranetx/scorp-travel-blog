"use client";

import SideBar from "@/components/layout/SideBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  travelType: string;
}

type ChartDataItem = {
  name: string;
  count: number;
  percent?: number;
};

const COLORS = [
  "#1e3a8a",  // Dark blue
  "#1e40af",  // Deep blue
  "#1d4ed8",  // Royal blue
  "#2563eb",  // Primary blue
  "#3b82f6",  // Bright blue
  "#60a5fa",  // Light blue
  "#93c5fd",  // Pale blue
  "#bfdbfe",  // Very light blue
];

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const travelTypes = [
    "Adventure",
    "Cultural",
    "Family",
    "Honeymoon",
    "Solo",
    "Group",
    "Luxury",
    "Business",
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
      setFilteredPosts(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        return postDate >= start && postDate <= end;
      } else if (start) {
        return postDate >= start;
      } else if (end) {
        return postDate <= end;
      }
      return true;
    });
    setFilteredPosts(filtered);
  }, [startDate, endDate, posts]);

  const typeCounts = travelTypes.map((type) => ({
    name: type,
    count: filteredPosts.filter((post) => post.travelType === type).length,
  }));

  const chartData = typeCounts.filter((item) => item.count > 0);
  const totalPosts = filteredPosts.length;

  const recentPosts = [...filteredPosts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="flex min-h-screen">
      <SideBar />

      <div className="flex-1 container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Admin Dashboard</h1>
          <Button 
            onClick={fetchPosts} 
            variant="outline" 
            disabled={loading}
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-sm font-medium text-black">
              From:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-blue-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="text-sm font-medium text-black">
              To:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-blue-200 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={startDate}
            />
          </div>
          {(startDate || endDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              Clear Filters
            </Button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-black">
                    Total Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-black">
                    {totalPosts}
                  </p>
                </CardContent>
                <CardFooter className="text-xs text-black">
                  Last updated: {lastUpdated}
                </CardFooter>
              </Card>

              {typeCounts
                .sort((a, b) => b.count - a.count)
                .slice(0, 5)
                .map((type) => (
                  <Card
                    key={type.name}
                    className="bg-gradient-to-br from-blue-50 to-blue-100"
                  >
                    <CardHeader>
                      <CardTitle className="text-sm font-medium text-black">
                        {type.name} Posts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-black">
                        {type.count}
                      </p>
                    </CardContent>
                    <CardFooter className="text-xs text-black">
                      {Math.round((type.count / totalPosts) * 100)}% of total
                    </CardFooter>
                  </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Posts by Travel Type</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#2563eb"
                        name="Number of Posts"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Posts Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="name"
                        label={({
                          name,
                          percent,
                        }: {
                          name: string;
                          percent?: number;
                        }) =>
                          `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                        }
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2 bg-blue-50">
                <CardTitle className="text-xl font-bold flex items-center text-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-blue-100">
                  {recentPosts.map((post) => {
                    const colorIndex = travelTypes.indexOf(post.travelType) % COLORS.length;
                    const color = COLORS[colorIndex];
                    
                    return (
                      <div
                        key={post.id}
                        className="group p-4 hover:bg-gradient-to-r from-blue-50 to-white transition-all duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-black group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {post.content}
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2">
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                              style={{
                                backgroundColor: `${color}20`,
                                color: color,
                              }}
                            >
                              {post.travelType}
                            </span>
                            <span className="text-xs text-black">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}