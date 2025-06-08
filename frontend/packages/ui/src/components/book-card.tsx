import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Badge } from "./badge"
import { cn } from "@/lib/utils"

export interface BookCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  content: string
  tags: string[]
  createdAt: string
  maxContentLength?: number
  onTagClick?: (tag: string) => void
}

const BookCard = React.forwardRef<HTMLDivElement, BookCardProps>(
  ({ 
    title, 
    content, 
    tags, 
    createdAt, 
    maxContentLength = 150, 
    onTagClick,
    className,
    ...props 
  }, ref) => {
    const truncatedContent = content.length > maxContentLength 
      ? content.substring(0, maxContentLength) + '...' 
      : content

    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch {
        return dateString
      }
    }

    return (
      <Card 
        ref={ref}
        className={cn("cursor-pointer hover:shadow-lg transition-shadow", className)}
        {...props}
      >
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
          <CardDescription>
            {formatDate(createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {truncatedContent}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className={onTagClick ? "cursor-pointer hover:bg-secondary/80" : ""}
                  onClick={(e) => {
                    if (onTagClick) {
                      e.stopPropagation()
                      onTagClick(tag)
                    }
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)
BookCard.displayName = "BookCard"

export { BookCard }