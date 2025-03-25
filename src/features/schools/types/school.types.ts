export interface School {
  _id: string
  name: string
  address: string
  contactNumber?: string
  description?: string
  maxStudents?: number
  images?: string[]
  schedule?: {
    openingTime: string
    closingTime: string
    operatingDays: string[]
  }
  location?: {
    latitude: number
    longitude: number
  }
  instructors?: any[]
  students?: any[]
  createdAt?: string
  updatedAt?: string
}

