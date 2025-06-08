'use client'

import { useRouter } from 'next/navigation'
import { SaveBookForm } from '@/components/book/save-book-form'

export default function SavePage() {
  const router = useRouter()

  const handleSave = async (content: string) => {
    // TODO: Implement actual save logic with GraphQL
    console.log('Saving book:', content)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Redirect to library after save
    router.push('/library')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SaveBookForm onSave={handleSave} />
    </div>
  )
}