'use client'

import { useState } from 'react'
import { Button, Textarea, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tsundoc/ui'

interface SaveBookFormProps {
  onSave: (content: string) => Promise<void>
}

export function SaveBookForm({ onSave }: SaveBookFormProps) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsLoading(true)
    try {
      await onSave(content)
      setContent('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Save New Book</CardTitle>
        <CardDescription>
          Paste your AI-generated content or any text you want to save
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste your content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
            disabled={isLoading}
          />
          <Button type="submit" disabled={!content.trim() || isLoading}>
            {isLoading ? 'Saving...' : 'Save Book'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}