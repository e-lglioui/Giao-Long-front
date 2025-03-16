export enum EnrollmentStatus {
  PENDING = "pending",
  ACTIVE = "active",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Enrollment {
  _id: string
  studentId: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  schoolId: {
    _id: string
    name: string
    address: string
  }
  classes: {
    _id: string
    title: string
    date: string
    startTime: string
    endTime: string
  }[]
  enrollmentDate: string
  status: EnrollmentStatus
  completionDate?: string
  paymentDetails: Record<string, any>
  notes: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateEnrollmentDto {
  studentId: string
  schoolId: string
  classes?: string[]
  enrollmentDate?: Date
  status?: EnrollmentStatus
  paymentDetails?: Record<string, any>
  notes?: string[]
}

