import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { redirect } from "next/navigation"


import PostView from '../../../components/post/PostView'
export default async function NewPostPage() {
    const session = await getServerSession(authOptions)
  
  // Optional extra protection
  if (!session) {
    redirect("/auth/signin")
  }
  return (
    <div className="container mx-auto p-4">
      <PostView mode="create" />
      
    </div>
  )
}