// context/PostButtonsContext.tsx
'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

interface PostButtonsContextType {
  showEditButton: boolean
  showDeleteButton: boolean
  setButtonsVisibility: (showEdit: boolean, showDelete: boolean) => void
}

const PostButtonsContext = createContext<PostButtonsContextType | undefined>(undefined)

export function PostButtonsProvider({ children }: { children: ReactNode }) {
  const [showEditButton, setShowEditButton] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)

  const setButtonsVisibility = (showEdit: boolean, showDelete: boolean) => {
    setShowEditButton(showEdit)
    setShowDeleteButton(showDelete)
  }

  return (
    <PostButtonsContext.Provider value={{ showEditButton, showDeleteButton, setButtonsVisibility }}>
      {children}
    </PostButtonsContext.Provider>
  )
}

export function usePostButtons() {
  const context = useContext(PostButtonsContext)
  if (context === undefined) {
    throw new Error('usePostButtons must be used within a PostButtonsProvider')
  }
  return context
}