// app/posts/edit/[id]/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import PostView from "@/components/post/PostView"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch the post data here if needed
  // const post = await getPost(params.id)

  return (
    <PostView 
      mode="edit"
      overrideShowEditButton={true}
      overrideShowDeleteButton={true}
    />
  )
}
//  mode==="create" ? toast.success('Post created successfully!'):toast.success('Post updated successfully!')