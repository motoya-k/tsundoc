'use client'

import { useState, useEffect } from 'react'
import { Input, BookCard, BookSpine, Bookshelf, BookCover, BookLibrary, Button } from '@tsundoc/ui'
import { getClient } from '@/lib/graphql/client'
import { GetBooksDocument, GetBooksQuery } from '@/lib/graphql/generated/graphql'

// Type definitions from generated GraphQL
type Book = NonNullable<GetBooksQuery['myBooks']>[number]


export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'shelf' | 'cover' | 'card'>('cover')
  const [columns, setColumns] = useState(4)
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // レスポンシブなカラム数を決定
  const getResponsiveColumns = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width < 640) return 2 // sm未満
      if (width < 1024) return 3 // lg未満  
      if (width < 1280) return 4 // xl未満
      return 5 // xl以上
    }
    return 4
  }

  // GraphQLからブックデータを取得
  const fetchBooks = async (keyword?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const client = await getClient()
      const result = await client.request(GetBooksDocument, { keyword })
      
      setBooks(result.myBooks || [])
    } catch (err) {
      console.error('Failed to fetch books:', err)
      setError('ブックの取得に失敗しました')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setColumns(getResponsiveColumns())
    }
    
    handleResize() // 初期設定
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 初期データ読み込み
  useEffect(() => {
    fetchBooks()
  }, [])

  // 検索のデバウンス
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchBooks(searchQuery)
      } else {
        fetchBooks()
      }
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery])

  const filteredBooks = books.filter(book =>
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
        <BookLibrary columns={columns} className="max-w-7xl mx-auto">
          {filteredBooks.map((book) => (
            <BookCover
              key={book.id}
              title={book.title}
              content={book.content}
              tags={book.tags}
              size="md"
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
      
      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading books...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {!loading && filteredBooks.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No books found. Try a different search or save your first book!
        </p>
      )}
    </div>
  )
}