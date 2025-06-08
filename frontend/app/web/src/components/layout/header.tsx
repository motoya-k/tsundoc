'use client'

import Link from 'next/link'
import { Button } from '@tsundoc/ui'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Tsundoc
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/library">
            <Button variant="ghost">Library</Button>
          </Link>
          <Link href="/save">
            <Button variant="ghost">Save Book</Button>
          </Link>
          <Button variant="outline">Sign In</Button>
        </nav>
      </div>
    </header>
  )
}