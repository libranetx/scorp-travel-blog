// app/posts/edit/[id]/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import PostView from "@/components/post/PostView"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch the post data here if needed
  // const { id } = await params
  // const post = await getPost(id)

  return (
    <PostView 
      mode="edit"
      overrideShowEditButton={false}
      overrideShowDeleteButton={true}
    />
  )
}
//  