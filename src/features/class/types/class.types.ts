export enum ClassStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Class {
  _id: string
  schoolId: {
    _id: string
    name: string
    address: string
  }
  courseId: {
    _id: string
    title: string
    description: string
  }
  instructorId: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  status: ClassStatus
  enrolledStudents: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }[]
  maxCapacity: number
  currentEnrollment: number
  level: string
  requirements: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateClassDto {
  schoolId: string
  courseId: string
  instructorId: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  status?: ClassStatus
  maxCapacity?: number
  level?: string
  requirements?: string[]
}

export interface UpdateClassDto extends Partial<CreateClassDto> {}

export interface EnrollStudentDto {
  studentId: string
}

export interface EnrollMultipleStudentsDto {
  studentIds: string[]
}

