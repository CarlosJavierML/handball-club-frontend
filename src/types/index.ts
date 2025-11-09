export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  birthDate: string;
  photo?: string;
  position: string;
  jerseyNumber?: number;
  height?: number;
  weight?: number;
  dominantHand?: 'left' | 'right';
  medicalInfo?: string;
  emergencyContact?: string;
  team?: Team;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentNumber: string;
  birthDate: string;
  photo?: string;
  specialization: string;
  certificationLevel: string;
  hireDate: string;
  salary: number;
  certifications?: string[];
  biography?: string;
  isActive: boolean;
  teamsAsHead?: Team[];
  teamsAsAssistant?: Team[];
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  category: string;
  division: string;
  foundedYear: number;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  headCoach?: Coach;
  assistantCoaches?: Coach[];
  players?: Player[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  matchDate: string;
  venue: string;
  competition: string;
  round?: string;
  homeScore?: number;
  awayScore?: number;
  status: 'scheduled' | 'in_progress' | 'finished' | 'cancelled' | 'postponed';
  statistics?: {
    homeShots?: number;
    awayShots?: number;
    homePossession?: number;
    awayPossession?: number;
    homeFouls?: number;
    awayFouls?: number;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Training {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  team: Team;
  coach: Coach;
  trainingType: string;
  objectives?: string;
  exercises?: string;
  attendees?: Player[];
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  player: Player;
  amount: number;
  concept: string;
  paymentDate: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod: string;
  transactionReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity?: number;
  participants?: Player[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  cost?: number;
  requirements?: string;
  createdAt: string;
  updatedAt: string;
}