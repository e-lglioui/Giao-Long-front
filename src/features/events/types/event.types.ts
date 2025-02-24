export interface Location {
  address: string
  city: string
  country: string
}

export interface RegistrationDetails {
  deadline: Date
  requirements: string
  currentParticipants: number
  maxParticipants: number
}

export interface Event {
  _id: string
  userId: string
  title: string
  description: string
  type: string
  organizingSchool: string // ObjectId
  organizer: string // ObjectId
  location: Location
  participantnbr: number
  prix: number
  startDate: Date
  endDate: Date
  registrationDetails: RegistrationDetails
  status: string
  participants: string[] // Array of ObjectIds
}

export interface CreateEventDto extends Omit<Event, "_id"> {}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

