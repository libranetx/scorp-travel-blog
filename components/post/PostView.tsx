"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { z } from "zod";

const travelTypes = [
  "Adventure",
  "Cultural",
  "Family",
  "Honeymoon",
  "Solo",
  "Group",
  "Luxury",
  "Business",
] as const;

const formSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  content: z.string().min(32, { message: "Content is required" }),
  travelType: z.enum(travelTypes).optional(),
  imageUrl: z.string().optional(),
});

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  travelType?: string;
  imageUrl?: string;
}

interface PostViewProps {
  post?: Post;
  mode?: "view" | "edit" | "create";
  overrideShowEditButton?: boolean;
  overrideShowDeleteButton?: boolean;
  compact?: boolean;
}

export default function PostView({
  post,
  mode = "view",
  overrideShowEditButton,
  overrideShowDeleteButton,
  compact = false,
}: PostViewProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(mode !== "view");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
    url?: string;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      travelType: post?.travelType as z.infer<typeof formSchema>["travelType"] || undefined,
      imageUrl: post?.imageUrl || "",
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    setUploadingImage(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401) {
          throw new Error("Please sign in to upload images");
        } else if (response.status === 403) {
          throw new Error("Admin access required to upload images");
        } else {
          throw new Error(data.error || "Image upload failed");
        }
      }

      setUploadStatus({
        success: true,
        message: "Image uploaded successfully!",
        url: data.url,
      });

      // Update the form with the new image URL
      form.setValue("imageUrl", data.url);
      return data.url;
    } catch (error: any) {
      setUploadStatus({
        success: false,
        message: error.message || "Image upload failed",
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError("");

    try {
      const url = mode === "create" ? "/api/posts" : `/api/posts/${post?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error("Please sign in to " + (mode === "create" ? "create" : "update") + " posts");
        } else if (response.status === 403) {
          throw new Error("Admin access required to " + (mode === "create" ? "create" : "update") + " posts");
        } else {
          throw new Error(errorData.error || (mode === "create" ? "Failed to create post" : "Failed to update post"));
        }
      }
      
      const successMessage = mode === "create" 
        ? "Post created successfully!" 
        : "Post updated successfully!";
      
      toast.success(successMessage);
      router.push(mode === "create" ? "/posts" : `/posts/${post?.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!post?.id) return;

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error("Please sign in to delete posts");
        } else if (response.status === 403) {
          throw new Error("Admin access required to delete posts");
        } else {
          throw new Error(errorData.error || "Failed to delete post");
        }
      }

      toast.success("Post deleted successfully!");
      router.push("/dashboard/postsAdmin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed");
    }
  };

  if (isEditing) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">
          {mode === "create" ? "Create Post" : "Edit Post"}
        </h2>

        {error && (
          <div className="p-3 mb-4 text-red-500 bg-red-50 rounded">{error}</div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Type of Travel
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select travel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {travelTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Field */}
            <FormItem>
              <FormLabel className="text-base font-medium">
                Featured Image
              </FormLabel>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleImageUpload(file);
                    }
                  }}
                  className="cursor-pointer"
                />
                {uploadStatus && (
                  <div className={`text-sm p-2 rounded ${
                    uploadStatus.success 
                      ? "text-green-700 bg-green-50"
                      : "text-red-700 bg-red-50"
                  }`}>
                    {uploadStatus.message}
                  </div>
                )}
                {form.watch("imageUrl") && (
                  <div className="mt-2">
                    <Image
                      src={form.watch("imageUrl") || ""}
                      alt="Preview"
                      width={500}
                      height={300}
                      className="w-full h-auto rounded-md border" 
                    />
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Content
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Post content" rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button variant="edit" type="submit" disabled={isSubmitting || uploadingImage}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>

              {mode !== "create" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    );
  }

  if (compact) {
    return (
      <Card className="p-4 w-full h-full bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => window.location.href = `/posts/${post?.id}`}>
        <CardHeader className="flex justify-between items-start gap-2 p-0">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold mb-1 line-clamp-1">
              {post?.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mb-2">
              {post && new Date(post.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
        </CardHeader>

        {post?.imageUrl && (
          <div className="mb-4">
            <Image
              src={post.imageUrl}
              alt="Post featured"
              width={500}
              height={300}
              className="w-full h-50 object-cover rounded-md"
            />
          </div>
        )}

        <CardContent className="prose whitespace-pre-line my-2 line-clamp-3 p-0">
          {post?.travelType && (
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                {post.travelType}
              </span>
            </div>
          )}
          {post?.content}
        </CardContent>

        <CardFooter className="flex justify-between items-center mt-4 p-0">
          <Link href={`/posts/${post?.id}`}>
            <Button variant="link">View Details</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-full w-full bg-white rounded-lg shadow "
   >
      <CardHeader className="flex justify-between items-start gap-2 p-0">
        <div className="flex-1">
          <CardTitle className="text-2xl font-bold mb-1">
            {post?.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mb-2">
            {post && new Date(post.createdAt).toLocaleDateString()}
          </CardDescription>
        </div>

        {overrideShowEditButton && (
          <Button onClick={() => setIsEditing(true)} variant="edit">
            Edit
          </Button>
        )}
      </CardHeader>

      {post?.imageUrl && (
        <div className="my-4">
          <Image
            src={post.imageUrl}
            alt="Post featured"
            width={500}
            height={300}
            className="w-full h-auto rounded-md border" 
          />
        </div>
      )}

      <CardContent className="prose whitespace-pre-line my-4 p-0">
        {post?.travelType && (
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {post.travelType}
            </span>
          </div>
        )}
        {post?.content}
      </CardContent>

      <CardFooter className="flex justify-between items-center mt-4 p-0">
        <Link href={`/posts/${post?.id}`}>
          <Button variant="link">View Details</Button>
        </Link>
        {overrideShowDeleteButton && (
          <AlertDialog>
            <AlertDialogTrigger asChild> 
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your post from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}