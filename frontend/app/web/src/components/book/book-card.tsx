'use client'

import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BookCardProps {
  book: {
    id: string
    title: string
    tags: string[]
    content: string
    createdAt: string
  }
  onClick?: () => void
}

export function BookCard({ book, onClick }: BookCardProps) {
  const truncatedContent = book.content.length > 150 
    ? book.content.substring(0, 150) + '...' 
    : book.content

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
        <CardDescription>
          {format(new Date(book.createdAt), 'PPP')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {truncatedContent}
        </p>
        <div className="flex flex-wrap gap-2">
          {book.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}