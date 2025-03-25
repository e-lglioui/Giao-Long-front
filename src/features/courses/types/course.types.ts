export interface Course {
  _id: string
  schoolId: string
  instructorId: string
  title: string
  description?: string
  schedule: Array<{
    date: Date
    startTime: string
    endTime: string
  }>
  capacity?: number
  participants: string[]
  isActive: boolean
  stats: Record<string, number>
}

export interface CreateCourseDto {
  schoolId: string
  instructorId: string
  title: string
  description?: string
  schedule?: Array<{
    date: Date
    startTime: string
    endTime: string
  }>
  capacity?: number
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

