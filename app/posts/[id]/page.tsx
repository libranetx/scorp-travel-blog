import PostView from "../../../components/post/PostView"

async function getPost(id: number) {
  try {
    // Use relative URL for server-side fetching
    const res = await fetch(`/api/posts/${id}`, {
      cache: 'no-store'
    })
    if (!res.ok) {
      console.error('Failed to fetch post:', res.status, res.statusText);
      throw new Error(`Failed to fetch post: ${res.status}`);
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Failed to load post');
  }
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
