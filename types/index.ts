export interface Event {
  id: string;
  title: string;
  slug: string;
  date: string;
  gateTime?: string;
  raceTime?: string;
  description?: string;
  image?: string;
  classes: string[];
  ticketPrice?: number;
  pitPrice?: number;
  status: "upcoming" | "completed" | "cancelled" | "postponed";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  body: unknown[];
  image?: string;
  author?: string;
  publishedAt: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  slug: string;
  logo: string;
  url?: string;
  tier: "title" | "gold" | "silver" | "bronze" | "supporting";
  active: boolean;
}

export interface RaceClass {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder: number;
  active: boolean;
}

export interface PointsStanding {
  id: string;
  season: number;
  raceClass: string;
  driverName: string;
  carNumber: string;
  totalPoints: number;
  wins: number;
  topFives: number;
  topTens: number;
  starts: number;
  position: number;
}

export interface RaceResult {
  id: string;
  eventId: string;
  raceClass: string;
  date: string;
  finishPosition: number;
  driverName: string;
  carNumber: string;
  laps?: number;
  dnf: boolean;
  notes?: string;
}
