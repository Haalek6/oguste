import React, { createContext, useContext, useState } from 'react';
import type { Property as SupabaseProperty } from '../lib/supabase';
import { mockProperty } from '../lib/supabase';

// Types pour les documents
interface Document {
  id: string;
  type: 'diagnostic' | 'acte' | 'permis' | 'autre';
  name: string;
  dateUpload: string;
  dateExpiration?: string;
  status: 'valide' | 'expiré' | 'manquant' | 'non-conforme';
  surface?: number;
  notes?: string;
  metadata: Record<string, any>;
}

// Types pour les rappels
interface Reminder {
  id: string;
  type: 'document_manquant' | 'document_expire' | 'suivi_dossier';
  message: string;
  date: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

// Type principal pour une propriété
interface Property extends Omit<SupabaseProperty, 'data'> {
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
    documents: {
      diagnostics: Document[];
      actes: Document[];
      permis: Document[];
      autres: Document[];
    };
    reminders: Reminder[];
    stats: {
      totalDocuments: number;
      documentsManquants: number;
      documentsExpires: number;
      documentsProcheExpiration: number;
    };
    compliance: {
      status: 'conforme' | 'non_conforme' | 'attention_requise';
      lastCheck: string;
      issues: Array<{
        type: string;
        description: string;
        severity: 'high' | 'medium' | 'low';
      }>;
    };
  };
}

// Interface du contexte
interface PropertyContextType {
  selectedProperty: Property;
  setSelectedProperty: (property: Property) => void;
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'user_id'>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  addDocument: (propertyId: string, document: Omit<Document, 'id'>) => Promise<void>;
  updateDocument: (propertyId: string, documentId: string, updates: Partial<Document>) => Promise<void>;
  deleteDocument: (propertyId: string, documentId: string) => Promise<void>;
  addReminder: (propertyId: string, reminder: Omit<Reminder, 'id'>) => Promise<void>;
  updateReminder: (propertyId: string, reminderId: string, updates: Partial<Reminder>) => Promise<void>;
  checkCompliance: (propertyId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PropertyContext = createContext<PropertyContextType>({
  selectedProperty: mockProperty as Property,
  setSelectedProperty: () => {},
  properties: [mockProperty as Property],
  addProperty: async () => {},
  deleteProperty: async () => {},
  addDocument: async () => {},
  updateDocument: async () => {},
  deleteDocument: async () => {},
  addReminder: async () => {},
  updateReminder: async () => {},
  checkCompliance: async () => {},
  loading: false,
  error: null
});

export function PropertyProvider({ children }: { children: React.ReactNode }) {
  const [selectedProperty, setSelectedProperty] = useState<Property>(mockProperty as Property);
  const [properties, setProperties] = useState<Property[]>([mockProperty as Property]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Gestion des propriétés
  const addProperty = async (property: Omit<Property, 'id' | 'user_id'>) => {
    try {
      const newProperty = {
        ...property,
        id: Date.now().toString(),
        user_id: '1',
        created_at: new Date().toISOString()
      };

      setProperties(prev => [...prev, newProperty as Property]);
    } catch (err) {
      console.error('Error adding property:', err);
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      throw err;
    }
  };

  // Gestion des documents
  const addDocument = async (propertyId: string, document: Omit<Document, 'id'>) => {
    try {
      const newDocument = { ...document, id: Date.now().toString() };
      setProperties(prev => {
        const propertyIndex = prev.findIndex(p => p.id === propertyId);
        if (propertyIndex === -1) throw new Error('Property not found');

        const newProperties = [...prev];
        const property = { ...newProperties[propertyIndex] };
        
        if (document.type === 'diagnostic') {
          property.data.documents.diagnostics.push(newDocument as Document);
        } else if (document.type === 'acte') {
          property.data.documents.actes.push(newDocument as Document);
        } else if (document.type === 'permis') {
          property.data.documents.permis.push(newDocument as Document);
        } else {
          property.data.documents.autres.push(newDocument as Document);
        }

        newProperties[propertyIndex] = property;
        return newProperties;
      });
    } catch (err) {
      console.error('Error adding document:', err);
      throw err;
    }
  };

  const updateDocument = async (propertyId: string, documentId: string, updates: Partial<Document>) => {
    setProperties(prev => {
      const propertyIndex = prev.findIndex(p => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const newProperties = [...prev];
      const property = { ...newProperties[propertyIndex] };
      
      ['diagnostics', 'actes', 'permis', 'autres'].forEach(category => {
        const docs = property.data.documents[category as keyof typeof property.data.documents];
        const docIndex = docs.findIndex(d => d.id === documentId);
        if (docIndex !== -1) {
          docs[docIndex] = { ...docs[docIndex], ...updates };
        }
      });

      newProperties[propertyIndex] = property;
      return newProperties;
    });
  };

  const deleteDocument = async (propertyId: string, documentId: string) => {
    setProperties(prev => {
      const propertyIndex = prev.findIndex(p => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const newProperties = [...prev];
      const property = { ...newProperties[propertyIndex] };
      
      ['diagnostics', 'actes', 'permis', 'autres'].forEach(category => {
        const docs = property.data.documents[category as keyof typeof property.data.documents];
        const docIndex = docs.findIndex(d => d.id === documentId);
        if (docIndex !== -1) {
          docs.splice(docIndex, 1);
        }
      });

      newProperties[propertyIndex] = property;
      return newProperties;
    });
  };

  const addReminder = async (propertyId: string, reminder: Omit<Reminder, 'id'>) => {
    setProperties(prev => {
      const propertyIndex = prev.findIndex(p => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const newProperties = [...prev];
      const property = { ...newProperties[propertyIndex] };
      
      const newReminder = { ...reminder, id: Date.now().toString() };
      property.data.reminders.push(newReminder as Reminder);

      newProperties[propertyIndex] = property;
      return newProperties;
    });
  };

  const updateReminder = async (propertyId: string, reminderId: string, updates: Partial<Reminder>) => {
    setProperties(prev => {
      const propertyIndex = prev.findIndex(p => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const newProperties = [...prev];
      const property = { ...newProperties[propertyIndex] };
      
      const reminderIndex = property.data.reminders.findIndex(r => r.id === reminderId);
      if (reminderIndex !== -1) {
        property.data.reminders[reminderIndex] = {
          ...property.data.reminders[reminderIndex],
          ...updates
        };
      }

      newProperties[propertyIndex] = property;
      return newProperties;
    });
  };

  const checkCompliance = async (propertyId: string) => {
    setProperties(prev => {
      const propertyIndex = prev.findIndex(p => p.id === propertyId);
      if (propertyIndex === -1) return prev;

      const newProperties = [...prev];
      const property = { ...newProperties[propertyIndex] };
      
      // Mise à jour du statut de conformité
      property.data.compliance = {
        ...property.data.compliance,
        lastCheck: new Date().toISOString()
      };

      newProperties[propertyIndex] = property;
      return newProperties;
    });
  };

  return (
    <PropertyContext.Provider
      value={{
        selectedProperty,
        setSelectedProperty,
        properties,
        addProperty,
        deleteProperty,
        addDocument,
        updateDocument,
        deleteDocument,
        addReminder,
        updateReminder,
        checkCompliance,
        loading,
        error
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}
