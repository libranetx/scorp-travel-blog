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
  try {
    const { id } = await params
    const post = await getPost(Number(id))

    if (!post) {
      return (
        <div className="container mx-auto p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Post Not Found</h1>
            <p className="text-gray-600">The post you're looking for doesn't exist.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="container mx-auto p-4">
        <PostView post={post} mode="view" overrideShowEditButton={false} overrideShowDeleteButton={false}/>
      </div>
    )
  } catch (error) {
    console.error('Error in PostPage:', error);
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Post</h1>
          <p className="text-gray-600">Failed to load the post. Please try again later.</p>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-4 p-4 bg-gray-100 rounded text-sm">
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
