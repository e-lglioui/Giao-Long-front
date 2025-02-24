export interface Event {
  _id: string;
  userId: string;
  name: string;
  bio: string;
  participantnbr: number;
  prix: number;
  ticketrestant: number;
  startDate: Date;
  endDate: Date;
}

export interface CreateEventDto {
  userId: string;
  name: string;
  bio: string;
  participantnbr: number;
  prix: number;
  startDate: Date;
  endDate: Date;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {} 