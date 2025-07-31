export interface Creator {
  id: number;
  username: string;
  displayName: string;
  avatar: string;
  country: string;
  specialty: string;
  isLive: boolean;
  followers: number;
  trendingScore: number;
  createdAt: string;
  lastOnline: string;
  rate?: number;
}
