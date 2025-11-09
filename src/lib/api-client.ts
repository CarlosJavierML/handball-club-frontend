import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('No token found in localStorage');
    }
  }
  return config;
});

// APIs para Players
export const playersApi = {
  getAll: () => apiClient.get('/players'),
  getOne: (id: string) => apiClient.get(`/players/${id}`),
  create: (data: any) => {
    // Si incluye userId, usa el endpoint original, si no, usa with-user
    const endpoint = data.userId ? '/players' : '/players/with-user';
    return apiClient.post(endpoint, data);
  },
  update: (id: string, data: any) => apiClient.patch(`/players/${id}`, data),
  delete: (id: string) => apiClient.delete(`/players/${id}`),
  getStatistics: (id: string) => apiClient.get(`/players/${id}/statistics`),
};

// APIs para Coaches
export const coachesApi = {
  getAll: () => apiClient.get('/coaches'),
  getOne: (id: string) => apiClient.get(`/coaches/${id}`),
  create: (data: any) => {
    // Si incluye userId, usa el endpoint original, si no, usa with-user
    const endpoint = data.userId ? '/coaches' : '/coaches/with-user';
    return apiClient.post(endpoint, data);
  },
  update: (id: string, data: any) => apiClient.patch(`/coaches/${id}`, data),
  delete: (id: string) => apiClient.delete(`/coaches/${id}`),
  getStatistics: (id: string) => apiClient.get(`/coaches/${id}/statistics`),
};

// APIs para Teams
export const teamsApi = {
  getAll: () => apiClient.get('/teams'),
  getOne: (id: string) => apiClient.get(`/teams/${id}`),
  create: (data: any) => apiClient.post('/teams', data),
  update: (id: string, data: any) => apiClient.patch(`/teams/${id}`, data),
  delete: (id: string) => apiClient.delete(`/teams/${id}`),
  addPlayers: (id: string, playerIds: string[]) => 
    apiClient.post(`/teams/${id}/players`, { playerIds }),
  getStatistics: (id: string) => apiClient.get(`/teams/${id}/statistics`),
};

// APIs para Matches
export const matchesApi = {
  getAll: () => apiClient.get('/matches'),
  getUpcoming: () => apiClient.get('/matches/upcoming'),
  getOne: (id: string) => apiClient.get(`/matches/${id}`),
  create: (data: any) => apiClient.post('/matches', data),
  update: (id: string, data: any) => apiClient.patch(`/matches/${id}`, data),
  updateScore: (id: string, homeScore: number, awayScore: number) =>
    apiClient.patch(`/matches/${id}/score`, { homeScore, awayScore }),
  delete: (id: string) => apiClient.delete(`/matches/${id}`),
};

// APIs para Trainings
export const trainingsApi = {
  getAll: () => apiClient.get('/trainings'),
  getOne: (id: string) => apiClient.get(`/trainings/${id}`),
  create: (data: any) => apiClient.post('/trainings', data),
  update: (id: string, data: any) => apiClient.patch(`/trainings/${id}`, data),
  markAttendance: (id: string, playerIds: string[]) =>
    apiClient.post(`/trainings/${id}/attendance`, { playerIds }),
  delete: (id: string) => apiClient.delete(`/trainings/${id}`),
};

// APIs para Payments
export const paymentsApi = {
  getAll: () => apiClient.get('/payments'),
  getByPlayer: (playerId: string) => apiClient.get(`/payments/player/${playerId}`),
  getOverdue: () => apiClient.get('/payments/overdue'),
  getStatistics: () => apiClient.get('/payments/statistics'),
  getOne: (id: string) => apiClient.get(`/payments/${id}`),
  create: (data: any) => apiClient.post('/payments', data),
  update: (id: string, data: any) => apiClient.patch(`/payments/${id}`, data),
  markAsPaid: (id: string, transactionReference?: string) =>
    apiClient.patch(`/payments/${id}/mark-paid`, { transactionReference }),
  delete: (id: string) => apiClient.delete(`/payments/${id}`),
};

// APIs para Events
export const eventsApi = {
  getAll: () => apiClient.get('/events'),
  getUpcoming: () => apiClient.get('/events/upcoming'),
  getOne: (id: string) => apiClient.get(`/events/${id}`),
  create: (data: any) => apiClient.post('/events', data),
  update: (id: string, data: any) => apiClient.patch(`/events/${id}`, data),
  addParticipants: (id: string, playerIds: string[]) =>
    apiClient.post(`/events/${id}/participants`, { playerIds }),
  removeParticipant: (eventId: string, playerId: string) =>
    apiClient.delete(`/events/${eventId}/participants/${playerId}`),
  delete: (id: string) => apiClient.delete(`/events/${id}`),
};