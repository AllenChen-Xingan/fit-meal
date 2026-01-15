"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Zap, ShoppingCart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "首页",
    icon: <Home className="h-5 w-5" />,
  },
  {
    href: "/inventory",
    label: "库存",
    icon: <Package className="h-5 w-5" />,
  },
  {
    href: "/shopping",
    label: "购物",
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    href: "/workout",
    label: "运动",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    href: "/settings",
    label: "设置",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-2 py-2 text-xs transition-colors",
                isActive
                  ? "text-emerald-600"
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
