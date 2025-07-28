

import Sidebar from "@/components/layout/SideBar";
import PostView from '../../../../components/post/PostView'
export default  function NewPostPage() {

  return (
    <div className="container mx-auto p-4">
      <Sidebar/>
      <PostView mode="create" />
      
    </div>
  )
}