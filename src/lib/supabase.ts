import { createClient } from '@supabase/supabase-js';

// Types
export interface Property {
  id: string;
  address: string;
  city: string;
  type: 'apartment' | 'house' | 'commercial' | 'land';
  created_at: string;
  user_id: string;
  data: {
    overview: {
      price: { value: number; currency: string };
      surface: { area: number; unit: string };
      owner: { name: string; since: string };
      mandate: { number: string; date: string };
    };
    stats?: {
      totalDocuments: number;
      documentsManquants: number;
      documentsExpires: number;
      documentsProcheExpiration: number;
    };
  };
}

// Initialisation du client Supabase avec des valeurs par défaut pour le développement
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Mock data pour le développement
export const mockProperty: Property = {
  id: '1',
  address: '123 Rue de Paris',
  city: 'Paris',
  type: 'apartment',
  created_at: new Date().toISOString(),
  user_id: 'user123',
  data: {
    overview: {
      price: { value: 350000, currency: 'EUR' },
      surface: { area: 75, unit: 'm²' },
      owner: { name: 'John Doe', since: '2020' },
      mandate: { number: 'M2024-001', date: '2024-01-01' }
    },
    stats: {
      totalDocuments: 12,
      documentsManquants: 3,
      documentsExpires: 1,
      documentsProcheExpiration: 2
    }
  }
};

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
}
