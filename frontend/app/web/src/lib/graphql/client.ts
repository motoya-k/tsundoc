import { GraphQLClient } from 'graphql-request'
import { getIdToken } from '@/lib/firebase/auth'

const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/graphql`

export const graphqlClient = new GraphQLClient(endpoint)

export const getAuthenticatedClient = async (): Promise<GraphQLClient> => {
  const token = await getIdToken()
  
  if (!token) {
    throw new Error('No authentication token available')
  }
  
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
}

export const getClient = async (): Promise<GraphQLClient> => {
  try {
    return await getAuthenticatedClient()
  } catch {
    // Return unauthenticated client for public queries
    return graphqlClient
  }
}