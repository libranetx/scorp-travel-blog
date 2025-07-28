"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu, LayoutDashboard, PlusCircle, LogOut, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const menuItems = [
  {
    href: "/dashboard/postsAdmin",
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Post Dashboard",
    color: "text-blue-400"
  },
  {
    href: "/dashboard/postsAdmin/new",
    icon: <PlusCircle className="h-5 w-5" />,
    label: "Create New Post",
    color: "text-blue-300"
  },
  {
    href: "/api/auth/signout",
    icon: <LogOut className="h-5 w-5" />,
    label: "Sign Out",
    color: "text-blue-200"
  }
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "group relative overflow-hidden p-4 rounded-full", // Larger padding (p-4)
              "hover:bg-blue-500/10 transition-all"
            )}
          >
            {/* Larger menu icon (h-8 w-8) */}
            <Menu className="h-8 w-8 text-blue-400 transition-all group-hover:scale-110" />
            <motion.span 
              className={cn(
                "absolute inset-0 rounded-full",
                "bg-gradient-to-r from-blue-500 to-blue-600 opacity-0",
                "group-hover:opacity-100 transition-opacity"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>

        <SheetContent 
          side="left" 
          className={cn(
            "flex flex-col p-0 w-full max-w-xs",
            "bg-gradient-to-b from-blue-900/95 to-blue-950/95",
            "backdrop-blur-xl border-r border-blue-800"
          )}
        >
          {/* Properly implemented SheetTitle for accessibility */}
          <SheetTitle asChild>
            <VisuallyHidden>Admin Navigation</VisuallyHidden>
          </SheetTitle>

          <div className="relative h-full overflow-hidden">
            {/* Animated background elements */}
            <motion.div 
              className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
              animate={{
                x: [0, 20, 0],
                y: [0, 15, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Close button */}
            <button 
              onClick={() => setOpen(false)}
              className={cn(
                "absolute right-4 top-4 z-50 rounded-full p-2",
                "hover:bg-blue-700/30 transition-colors"
              )}
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-blue-200" />
            </button>
            
            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Header */}
              <div className="px-6 py-8 border-b border-blue-800">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-gradient-to-r from-blue-600 to-blue-700"
                  )}>
                    <LayoutDashboard className="h-6 w-6 text-white" />
                  </div>
                  <motion.h3 
                    className={cn(
                      "text-2xl font-bold",
                      "bg-gradient-to-r from-blue-300 to-blue-400",
                      "bg-clip-text text-transparent"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link href="/dashboard">Admin Portal</Link>
                  </motion.h3>
                </motion.div>
              </div>
              
              {/* Navigation */}
              <nav aria-label="Main navigation">
                <ul className="flex-1 px-4 py-6 space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index + 0.4 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg",
                          "hover:bg-blue-800/30 hover:shadow-lg hover:shadow-blue-500/10",
                          "group relative overflow-hidden transition-all"
                        )}
                      >
                        <motion.span 
                          className={cn("transition-colors", item.color)}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.icon}
                        </motion.span>
                        <span className="text-blue-100 group-hover:text-white font-medium">
                          {item.label}
                        </span>
                        <motion.div 
                          className={cn(
                            "absolute left-0 bottom-0 h-0.5",
                            "bg-gradient-to-r from-blue-300 to-blue-400 w-0",
                            "group-hover:w-full transition-all"
                          )}
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              
              {/* Footer */}
              <motion.div 
                className={cn(
                  "px-6 py-4 border-t border-blue-800",
                  "text-sm text-blue-300/70"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p>© {new Date().getFullYear()} Admin Console</p>
              </motion.div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Custom overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}