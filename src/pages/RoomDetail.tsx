
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Door Open, Users, MapPin, ArrowLeft } from "lucide-react";
import { Room } from "@/components/RoomCard";

// Données statiques pour la démonstration
const rooms: Room[] = [
  {
    id: "1",
    name: "Salle Harmonie",
    capacity: 8,
    isOccupied: false,
  },
  {
    id: "2",
    name: "Salle Créativité",
    capacity: 6,
    isOccupied: true,
    occupiedBy: "Équipe Marketing",
    occupiedUntil: "14:00",
  },
  {
    id: "3",
    name: "Salle Innovation",
    capacity: 12,
    isOccupied: false,
  },
  {
    id: "4",
    name: "Bureau Collaboration",
    capacity: 4,
    isOccupied: true,
    occupiedBy: "Équipe Design",
    occupiedUntil: "15:30",
  },
  {
    id: "5",
    name: "Salle Stratégie",
    capacity: 10,
    isOccupied: false,
  },
  {
    id: "6",
    name: "Espace Projet",
    capacity: 16,
    isOccupied: false,
  }
];

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const room = rooms.find(room => room.id === id);
  
  if (!room) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Salle non trouvée</h2>
              <p className="text-gray-500 mb-6">La salle que vous recherchez n'existe pas.</p>
              <Button onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux salles
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux salles
          </Button>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            {room.isOccupied ? (
              <Badge variant="outline" className="bg-occupied text-occupied-foreground animate-pulse-slow">
                Occupée
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-available text-available-foreground">
                Disponible
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Capacité</p>
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="font-medium">{room.capacity} personnes</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Emplacement</p>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="font-medium">Bâtiment A, {room.id}e étage</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Équipements</h3>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                      Projecteur
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                      Tableau blanc
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                      Visioconférence
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                      WiFi
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Historique des réservations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Équipe Développement</p>
                      <p className="text-sm text-gray-500">Aujourd'hui, 09:00 - 10:30</p>
                    </div>
                    <Badge variant="outline">Terminé</Badge>
                  </div>
                  
                  {room.isOccupied && (
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{room.occupiedBy}</p>
                        <p className="text-sm text-gray-500">Aujourd'hui, 11:00 - {room.occupiedUntil}</p>
                      </div>
                      <Badge variant="outline" className="bg-occupied text-occupied-foreground">En cours</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">Équipe RH</p>
                      <p className="text-sm text-gray-500">Demain, 14:00 - 15:00</p>
                    </div>
                    <Badge variant="outline">À venir</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>État actuel</CardTitle>
              </CardHeader>
              <CardContent>
                {room.isOccupied ? (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-occupied/10">
                      <h3 className="font-medium mb-2">Actuellement occupée par</h3>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">{room.occupiedBy}</p>
                      </div>
                      <div className="flex items-center mt-3 text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          Jusqu'à {room.occupiedUntil}
                        </span>
                      </div>
                    </div>
                    <Button disabled variant="outline" className="w-full">
                      Actuellement indisponible
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-available/10">
                      <h3 className="font-medium mb-1">Disponible</h3>
                      <p className="text-gray-500 text-sm">
                        Cette salle est libre et peut être réservée maintenant.
                      </p>
                    </div>
                    <Button className="w-full" onClick={() => navigate('/')}>
                      Réserver cette salle
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RoomDetail;
