import PostView from "../../../components/post/PostView"

async function getPost(id: number) {
  const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
    cache: 'no-store'
  })
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}

export default async function PostPage({params}: {params: Promise<{ id: string }>}) {
  const { id } = await params
  const post = await getPost(Number(id))

  return (
    <div className="container mx-auto p-4">
      <PostView post={post} mode="view" overrideShowEditButton={false} overrideShowDeleteButton={false}/>
    </div>
  )
}
