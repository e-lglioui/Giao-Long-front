import FileSaver from 'file-saver';
import api from '@/services/api';
import { Event, CreateEventDto,UpdateEventDto } from '../types/event.types';
import { AxiosError } from 'axios';

const EVENTS_URL = '/events';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const eventService = {
  async getAllEvents() {
    const { data } = await api.get<Event[]>(EVENTS_URL);
    return data;
  },

  async getEventById(id: string) {
    const { data } = await api.get<Event>(`${EVENTS_URL}/${id}`);
    return data;
  },

  async searchEvents(name: string) {
    const { data } = await api.get<Event>(`${EVENTS_URL}/ev/search?name=${name}`);
    return data;
  },

  async createEvent (eventData: CreateEventDto)  {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw { name: "ApiError", message: errorData.message || "Failed to create event" };
      }
  
      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },
  async updateEvent(id: string, event: UpdateEventDto) {
    const { data } = await api.put<Event>(`${EVENTS_URL}/${id}`, event);
    return data;
  },

  async deleteEvent(id: string) {
    const { data } = await api.delete<Event>(`${EVENTS_URL}/${id}`);
    return data;
  },

  async downloadParticipants(eventId: string, format: 'pdf' | 'csv' | 'excel' = 'pdf') {
    try {
      const response = await api.get(`${EVENTS_URL}/${eventId}/participants/export`, {
        params: { format },
        responseType: 'blob'
      });

      const contentType = response.headers['content-type'];
      let fileExtension;
      
      switch (format) {
        case 'pdf':
          fileExtension = 'pdf';
          break;
        case 'csv':
          fileExtension = 'csv';
          break;
        case 'excel':
          fileExtension = 'xlsx';
          break;
        default:
          fileExtension = 'pdf';
      }

      FileSaver.saveAs(
        new Blob([response.data], { type: contentType }), 
        `event-${eventId}-participants.${fileExtension}`
      );

      return true;
    } catch (error) {
      console.error('Download error:', error);
      throw new Error('Failed to download participants list');
    }
  },
  async getEventParticipants(eventId: string) {
    try {
      const response = await api.get(`${EVENTS_URL}/${eventId}/participants`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteParticipant(eventId: string, participantId: string) {
    const response = await api.delete(`/participants/${participantId}${EVENTS_URL}/${eventId}`);
    return response.data;
  },
  async getParticipant(eventId: string, participantId: string) {
    const response = await api.get(`/participants/${participantId}`);
    return response.data;
  },
   async updateParticipant(eventId: string, participantId: string, data: any) {
    const response = await api.put(`/participants/${participantId}`, data);
    return response.data;
  },
  async registerParticipant(eventId: string, participantData: any) {
    try {
      const dataToSend = {
        ...participantData,
        eventId: eventId
      };

      console.log('Sending registration data:', dataToSend);

      const response = await api.post('/participants', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Registration error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });

        const message = error.response?.data?.message 
          || error.response?.data?.error 
          || 'Failed to register participant';
        
        throw new ApiError(
          message,
          error.response?.status,
          error.response?.data?.errors
        );
      }
      throw error;
    }
  },
  async searchParticipants(searchTerm: string) {
    const response = await api.get(`/participants/search/name?q=${searchTerm}`);
    return response.data;
  },
  async addParticipantToEvent(eventId: string, participantId: string) {
    const response = await api.post(`/participants/${participantId}/events/${eventId}`);
    return response.data;
  },
  async getEventsByUserId(userId: string) {
    const response = await api.get(`/events/user/${userId}`);
    return response.data;
  },
  async getEventStats(){
    const response = await api.get(`stats/overview`);
    return response.data;
  }
}
