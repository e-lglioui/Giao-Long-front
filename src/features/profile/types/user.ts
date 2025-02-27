export interface User {
    id: number
    name: string
    email: string
  }
  
  export interface ProfileData {
    username: string
    firstName: string
    lastName: string
    email: string
    dateOfBirth: string
    belt: string
    style: string
    bio: string
    achievements?: Array<{
      id: number
      title: string
      year: number
    }>
    stats?: {
      tournaments: number
      wins: number
      students: number
      yearsOfPractice: number
    }
    avatarUrl?: string
  }
  
  