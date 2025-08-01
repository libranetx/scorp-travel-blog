// app/posts/edit/[id]/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { redirect } from "next/navigation"
import PostView from "@/components/post/PostView"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  const { id } = await params

  // Fetch the post data here if needed
  // const post = await getPost(id)

  return (
    <PostView 
      mode="edit"
      overrideShowEditButton={true}
      overrideShowDeleteButton={true}
    />
  )
}
//  mode==="create" ? toast.success('Post created successfully!'):toast.success('Post updated successfully!')