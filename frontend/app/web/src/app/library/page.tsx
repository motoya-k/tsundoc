'use client'

import { useState } from 'react'
import { Input, BookCard, BookSpine, Bookshelf, BookCover, BookLibrary, Button } from '@tsundoc/ui'

// Mock data for now
const mockBooks = [
  {
    id: '1',
    title: 'Understanding React Hooks',
    tags: ['react', 'javascript', 'frontend'],
    content: 'React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have since become the standard way to write React components.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'GraphQL Best Practices',
    tags: ['graphql', 'api', 'backend'],
    content: 'GraphQL is a query language for APIs and a runtime for executing those queries. It provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'TypeScript Deep Dive',
    tags: ['typescript', 'javascript', 'types'],
    content: 'TypeScript adds static types to JavaScript. This comprehensive guide covers advanced TypeScript patterns and best practices.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Node.js Performance Optimization',
    tags: ['nodejs', 'performance', 'backend'],
    content: 'Learn how to optimize Node.js applications for better performance and scalability in production environments.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'CSS Grid Layout Mastery',
    tags: ['css', 'layout', 'frontend'],
    content: 'Master CSS Grid Layout to create complex, responsive web layouts with ease and precision.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Docker for Developers',
    tags: ['docker', 'devops', 'containers'],
    content: 'A practical guide to using Docker for development and deployment of containerized applications.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Machine Learning Basics',
    tags: ['ml', 'ai', 'python'],
    content: 'Introduction to machine learning concepts and practical implementation using Python.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'API Design Principles',
    tags: ['api', 'design', 'rest'],
    content: 'Best practices for designing robust and scalable APIs that developers love to use.',
    createdAt: new Date().toISOString(),
  },
]

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'shelf' | 'cover' | 'card'>('cover')

  const filteredBooks = mockBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">My Library</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Input
            type="search"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'cover' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cover')}
            >
              📖 Cover View
            </Button>
            <Button
              variant={viewMode === 'shelf' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('shelf')}
            >
              📚 Spine View
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('card')}
            >
              📄 Card View
            </Button>
          </div>
        </div>
      </div>
      
      {viewMode === 'cover' ? (
        <BookLibrary columns={4}>
          {filteredBooks.map((book) => (
            <BookCover
              key={book.id}
              title={book.title}
              content={book.content}
              tags={book.tags}
              onClick={() => console.log('Book clicked:', book.id)}
              onTagClick={(tag) => console.log('Tag clicked:', tag)}
            />
          ))}
        </BookLibrary>
      ) : viewMode === 'shelf' ? (
        <Bookshelf rows={2}>
          {filteredBooks.map((book) => (
            <BookSpine
              key={book.id}
              title={book.title}
              tags={book.tags}
              height={book.tags.length > 3 ? 'lg' : book.tags.length > 1 ? 'md' : 'sm'}
              onClick={() => console.log('Book clicked:', book.id)}
              onTagClick={(tag) => console.log('Tag clicked:', tag)}
            />
          ))}
        </Bookshelf>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              content={book.content}
              tags={book.tags}
              createdAt={book.createdAt}
              onClick={() => console.log('Book clicked:', book.id)}
            />
          ))}
        </div>
      )}
      
      {filteredBooks.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No books found. Try a different search or save your first book!
        </p>
      )}
    </div>
  )
}