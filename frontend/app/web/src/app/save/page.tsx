'use client'

import { useRouter } from 'next/navigation'
import { SaveBookForm } from '@/components/book/save-book-form'
import { getClient } from '@/lib/graphql/client'
import { SaveBookDocument } from '@/lib/graphql/generated/graphql'

export default function SavePage() {
  const router = useRouter()

  const handleSave = async (content: string) => {
    try {
      console.log('Saving book:', content)
      
      const client = await getClient()
      const result = await client.request(SaveBookDocument, { content })
      
      console.log('Book saved successfully:', result.saveBook)
      
      // Redirect to library after save
      router.push('/library')
    } catch (error) {
      console.error('Failed to save book:', error)
      // Show error to user - could implement toast notification here
      alert('Failed to save book. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SaveBookForm onSave={handleSave} />
    </div>
  )
}