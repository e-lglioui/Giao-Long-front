export interface Schedule {
  openingTime: string
  closingTime: string
  operatingDays: string[]
}

export interface School {
  _id: string
  name: string
  address: string
  contactNumber?: string
  images: string[]
  maxStudents: number
  schedule: Schedule
  description?: string
  instructors: {
    _id: string
    username: string
    email: string
  }[]
  students: {
    _id: string
    username: string
    email: string
  }[]
  dashboard: {
    studentCount: number
    revenue: number
    performanceStats: Record<string, number>
  }
}

export interface ScheduleDto {
  openingTime: string
  closingTime: string
  operatingDays?: string[]
}

export interface CreateSchoolDto {
  name: string
  address: string
  contactNumber?: string
  description?: string
  maxStudents?: number
  schedule?: ScheduleDto
}

export interface UpdateSchoolDto extends Partial<CreateSchoolDto> {}

