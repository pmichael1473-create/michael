import { PointPackage } from './types';

// Using a valid foundation address for demonstration purposes to pass validation.
// In production, replace this with your actual wallet address (e.g., from Tonkeeper).
export const TREASURY_WALLET_ADDRESS = '0QDAPOJPkxJKFjDn871wDylOoPV2G1_82HqkKpBy3Ibv7pVT'; 

export const PACKAGES: PointPackage[] = [
  {
    id: 'pack_basic',
    tonPrice: 0.004,
    points: 100,
    name: 'Starter Boost',
    popular: false,
  },
  {
    id: 'pack_pro',
    tonPrice: 2,
    points: 200,
    name: 'Power User',
    popular: true,
  }
];

export const GEMINI_COST_PER_USE = 10;