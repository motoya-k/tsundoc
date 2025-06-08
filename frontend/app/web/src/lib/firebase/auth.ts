import {
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { auth } from './config'

export const sendEmailLink = async (email: string) => {
  if (!auth) {
    console.warn('Firebase auth not initialized')
    return
  }
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/verify`,
    handleCodeInApp: true,
  }
  
  await sendSignInLinkToEmail(auth, email, actionCodeSettings)
  window.localStorage.setItem('emailForSignIn', email)
}

export const signInWithEmail = async (email: string, link: string) => {
  if (!auth) {
    throw new Error('Firebase auth not initialized')
  }
  if (isSignInWithEmailLink(auth, link)) {
    const result = await signInWithEmailLink(auth, email, link)
    window.localStorage.removeItem('emailForSignIn')
    return result
  }
  throw new Error('Invalid sign-in link')
}

export const signOut = () => {
  if (!auth) {
    console.warn('Firebase auth not initialized')
    return
  }
  return firebaseSignOut(auth)
}

export const getIdToken = async (): Promise<string | null> => {
  if (!auth || !auth.currentUser) return null
  return auth.currentUser.getIdToken()
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.warn('Firebase auth not initialized')
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}