import React, { useState } from 'react';
import { useProperty } from '../contexts/PropertyContext';
import { Upload, AlertTriangle, FileText, Clock, Download, MapPin, SquareIcon, EuroIcon } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { Modal } from './Modal';

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  details: React.ReactNode;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
}

export function OgusteView() {
  const { selectedProperty } = useProperty();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Bonjour ! Je suis votre assistant pour le bien situé au ${selectedProperty.address}. Comment puis-je vous aider ?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const handleEstimationRequest = () => {
    // Fermer la modale
    setActiveModal(null);
    
    // Ajouter le message dans le chat
    const newMessage: Message = {
      id: Date.now().toString(),
      content: "Démarrons le processus d'estimation pour votre bien.",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleRequestDocument = (documentName: string) => {
    // Fermer la modale si elle est ouverte
    setActiveModal(null);
    
    // Ajouter le message dans le chat
    const newMessage: Message = {
      id: Date.now().toString(),
      content: `Je souhaite demander le document : ${documentName}`,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);

    // Réponse automatique
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: `Je vais m'occuper de la demande pour le document "${documentName}". Je vous tiendrai informé de l'avancement.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const stats: StatCard[] = [
    {
      title: 'Documents totaux',
      value: selectedProperty.data?.stats?.totalDocuments || 0,
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      color: 'blue',
      details: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'ajout</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validité</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Télécharger</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">DPE.pdf</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Diagnostic</td>
                  <td className="px-4 py-3 text-sm text-gray-500">15/12/2024</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Valide jusqu'au 15/12/2025
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">2.4 MB</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-900">Mandat.pdf</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Administratif</td>
                  <td className="px-4 py-3 text-sm text-gray-500">10/12/2024</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Valide jusqu'au 10/12/2025
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">1.8 MB</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                {/* Ajoutez d'autres documents ici */}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      title: 'Documents manquants',
      value: selectedProperty.data?.stats?.documentsManquants || 0,
      icon: <AlertTriangle className="h-8 w-8 text-yellow-500" />,
      color: 'yellow',
      details: (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>Documents manquants</span>
            </div>
            <span className="text-yellow-500 font-medium">2</span>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-2">Document</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Statut</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="py-2">Bulletin de salaire</td>
                    <td className="py-2">Revenus</td>
                    <td className="py-2 text-red-500">Manquant</td>
                    <td className="py-2">
                      <button 
                        onClick={() => handleRequestDocument("Bulletin de salaire")}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Demander le document
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Avis d'imposition</td>
                    <td className="py-2">Revenus</td>
                    <td className="py-2 text-red-500">Manquant</td>
                    <td className="py-2">
                      <button 
                        onClick={() => handleRequestDocument("Avis d'imposition")}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Demander le document
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Documents expirés',
      value: selectedProperty.data?.stats?.documentsExpires || 0,
      icon: <Clock className="h-8 w-8 text-red-500" />,
      color: 'red',
      details: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Documents dont la validité a expiré :
          </p>
          <ul className="space-y-3">
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span>Diagnostic plomb</span>
                <span className="text-red-600">Expiré le 15/12/2024</span>
              </div>
              <button className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors">
                Demander le document
              </button>
            </li>
            <li className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span>Diagnostic électricité</span>
                <span className="text-red-600">Expiré le 10/12/2024</span>
              </div>
              <button className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors">
                Demander le document
              </button>
            </li>
          </ul>
        </div>
      )
    },
    {
      title: 'Proche expiration',
      value: selectedProperty.data?.stats?.documentsProcheExpiration || 0,
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      color: 'orange',
      details: (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span>Documents proches de l'expiration</span>
            </div>
            <span className="text-orange-500 font-medium">3</span>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-2">Document</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Date d'expiration</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="py-2">Carte d'identité</td>
                    <td className="py-2">Personnel</td>
                    <td className="py-2 text-red-500">Expiré</td>
                    <td className="py-2">
                      <button 
                        onClick={() => handleRequestDocument("Carte d'identité")}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Demander le document
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Justificatif de domicile</td>
                    <td className="py-2">Logement</td>
                    <td className="py-2 text-yellow-500">Dans 5 jours</td>
                    <td className="py-2">
                      <button 
                        onClick={() => handleRequestDocument("Justificatif de domicile")}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        Demander le document
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Colonne de gauche - Chat IA (50%) */}
      <div className="w-1/2">
        <ChatPanel 
          onClose={() => setActiveModal(null)} 
          messages={messages} 
          onMessagesUpdate={setMessages}
        />
      </div>

      {/* Colonne droite - Documents et informations (50%) */}
      <main className="w-1/2 bg-gray-50 overflow-y-auto">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center bg-white m-6">
          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600 text-sm">Déposez vos documents ici ou</p>
          <button className="text-blue-500 hover:text-blue-600 text-sm">parcourez vos fichiers</button>
        </div>

        <div className="p-6 space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <button
                key={stat.title}
                onClick={() => setActiveModal(stat.title)}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                  {stat.icon}
                </div>
              </button>
            ))}
          </div>

          {/* Points de vigilance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Points de vigilance</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Aucun point de vigilance</p>
            </div>
          </div>

          {/* Synthèse du dossier */}
          <button 
            onClick={() => { setActiveModal('synthese'); }}
            className="w-full bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left"
          >
            <h2 className="text-lg font-semibold mb-4">Synthèse du dossier</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Localisation</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedProperty.address}, {selectedProperty.city}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Surface totale</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedProperty.data.overview.surface.area} {selectedProperty.data.overview.surface.unit}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Prix actuel</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedProperty.data.overview.price.value.toLocaleString()} {selectedProperty.data.overview.price.currency}
                </p>
              </div>
            </div>
          </button>
        </div>
      </main>

      {/* Modales pour chaque statistique */}
      {stats.map((stat) => (
        <Modal
          key={stat.title}
          isOpen={activeModal === stat.title}
          onClose={() => setActiveModal(null)}
          title={stat.title}
        >
          {stat.details}
        </Modal>
      ))}

      {/* Modale pour la synthèse détaillée */}
      <Modal
        isOpen={activeModal === 'synthese'}
        onClose={() => setActiveModal(null)}
        title="Synthèse du dossier"
      >
        <div className="space-y-8">
          {/* Localisation */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Localisation</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p className="text-base font-medium">{selectedProperty.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ville</p>
                <p className="text-base font-medium">{selectedProperty.city}</p>
              </div>
            </div>
          </div>

          {/* Surface et pièces */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <SquareIcon className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Surface et pièces</h3>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">Surface totale</p>
              <p className="text-base font-medium">{selectedProperty.data.overview.surface.area} {selectedProperty.data.overview.surface.unit}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">Détail des pièces</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                  <span>Cuisine</span>
                  <span className="font-medium">12 m²</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                  <span>Salon</span>
                  <span className="font-medium">25 m²</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                  <span>Chambre 1</span>
                  <span className="font-medium">14 m²</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                  <span>Chambre 2</span>
                  <span className="font-medium">12 m²</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                  <span>Salle de bain</span>
                  <span className="font-medium">6 m²</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                  <span>WC</span>
                  <span className="font-medium">2 m²</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
                  <span>Entrée</span>
                  <span className="font-medium">4 m²</span>
                </div>
              </div>
            </div>
          </div>

          {/* Informations financières */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-4">
              <EuroIcon className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold">Informations financières</h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Prix estimé par le client</p>
                <p className="text-base font-medium">480 000 €</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimation agence</p>
                <p className="text-base font-medium">465 000 €</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prix actuel</p>
                <p className="text-base font-medium">450 000 €</p>
              </div>
            </div>
            <div className="mt-4">
              <button 
                onClick={handleEstimationRequest}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Réaliser une nouvelle estimation
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
