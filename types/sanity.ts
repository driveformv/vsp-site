import type { PortableTextBlock } from '@portabletext/react';

export type EventStatus = 'scheduled' | 'postponed' | 'cancelled' | 'completed' | 'soldOut';
export type EventType = 'weekly' | 'special' | 'practice' | 'external';

export interface SanityEvent {
  _id: string;
  title: string;
  slug: { current: string };
  date: string;
  gateTime?: string;
  raceTime?: string;
  raceClasses?: { sponsorName?: string; className: string }[];
  image?: { asset: { _ref: string } };
  ticketLink?: string;
  streamLink?: string;
  admissionInfo?: string;
  eventType?: EventType;
  isExternal?: boolean;
  externalUrl?: string;
  weatherStatus?: string;
  isFeatured?: boolean;
  status?: EventStatus;
  recapNote?: string;
  description?: PortableTextBlock[];
}
