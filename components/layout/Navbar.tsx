'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Menu, X, LogOut, PenSquare, Globe, UserPlus, LogIn } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const HIDDEN_PATHS = [
    '/auth/signin',
    '/auth/signup',
    '/dashboard',
    '/signout',
    '/dashboard/'
  ]

  const shouldHideNavbar = HIDDEN_PATHS.some(path => 
    pathname.startsWith(path)
  )

  if (shouldHideNavbar) {
    return null
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    setIsOpen(false)
  }

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40 transition-all duration-300 hover:bg-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center group">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-blue-600 transition-all duration-300">
              Scorp Travel Blog
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/posts" 
              className={`flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-all ${pathname === '/posts' ? 'text-blue-600 font-medium' : ''}`}
            >
              <Globe size={16} />
              Explore Stories
            </Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {session ? (
            <>
              {session.user?.role === 'ADMIN' && (
                <Link href="/dashboard/postsAdmin/new">
                  <Button size="lg" variant="create" className="flex items-center gap-2 group cursor-pointer">
                    <PenSquare size={16} className="group-hover:rotate-12 transition-transform" />
                    Craft Journey
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleLogout}
                className="flex items-center gap-2 border-gray-200 hover:border-gray-300 cursor-pointer"
              >
                <LogOut size={16} />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg" className="flex items-center gap-2 border-gray-200 hover:border-gray-300 cursor-pointer">
                  <UserPlus size={16} />
                  Sign Up
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="lg" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 cursor-pointer">
                  <LogIn size={16} />
                  Log In
                </Button>
              </Link>
            </>
          )}
        </div>

        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 border-t border-gray-100 animate-fadeIn">
          <div className="flex flex-col space-y-3 pt-3">
            <Link 
              href="/posts" 
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition py-2 px-2 rounded-lg hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Globe size={16} />
              Explore Stories
            </Link>

            {session ? (
              <>
                {session.user?.role === 'ADMIN' && (
                  <Link
                    href="/dashboard/postsAdmin/new"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button size="lg" variant="create" className="w-full flex items-center justify-center gap-2">
                      <PenSquare size={16} />
                      Craft Journey
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full flex items-center justify-center gap-2 border-gray-200 hover:border-gray-300"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/signup"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2 border-gray-200 hover:border-gray-300">
                    <UserPlus size={16} />
                    Sign Up
                  </Button>
                </Link>
                <Link 
                  href="/auth/signin"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Button size="lg" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500">
                    <LogIn size={16} />
                    Log In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}