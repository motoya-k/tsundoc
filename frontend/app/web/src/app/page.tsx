import Link from 'next/link'
import { Button } from '@tsundoc/ui'

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Tsundoc
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your AI-powered second brain for knowledge management
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/save">
            <Button size="lg">Save Your First Book</Button>
          </Link>
          <Link href="/library">
            <Button size="lg" variant="outline">Browse Library</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}