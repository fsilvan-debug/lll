
export type CelestialBodyType = 'ארצי' | 'גזי' | 'ננסי' | 'כוכב';

export interface PlanetData {
  id: string;
  name: string;
  englishName: string;
  distanceFromSun: string;
  water: string;
  atmosphere: string;
  dayLength: string;
  yearLength: string;
  type: CelestialBodyType;
  color: string;
  size: number;
  orbitalSpeed: number;
  description: string;
  realSize: string;
  moonsCount: number;
  moonsDetails?: string;
  humanReached: boolean;
  explorationTools: string;
  temperature: string;
  imageUrl: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
