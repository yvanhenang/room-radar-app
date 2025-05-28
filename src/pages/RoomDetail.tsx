import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DoorOpen, Users, MapPin, ArrowLeft, Clock, X } from "lucide-react";
import { Room } from "@/components/RoomCard";
import BookingDialog from "@/components/BookingDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useRooms } from "@/context/RoomContext";

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const { getRoom, updateRoomStatus } = useRooms();
  
  const room = getRoom(id || "");
  
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

  const handleBookRoom = () => {
    if (!room.isOccupied) {
      setIsBookingOpen(true);
    }
  };

  const handleCancelBooking = () => {
    updateRoomStatus(room.id, false);
    toast({
      title: "Réservation annulée",
      description: `La réservation de ${room.name} a été annulée`,
    });
    setIsCancelDialogOpen(false);
  };

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
                
                {room.isOccupied && (
                <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Réservation actuelle</p>
                      <div className="flex items-center">
                        <DoorOpen className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="font-medium">{room.occupiedBy}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-gray-400" />
                        <span className="font-medium">Jusqu'à {room.occupiedUntil}</span>
                    </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {room.isOccupied ? (
                  <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <X className="h-4 w-4 mr-2" />
                        Annuler la réservation
                    </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir annuler la réservation de {room.name} ?
                          Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Non, garder la réservation</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelBooking}>
                          Oui, annuler la réservation
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <Button className="w-full" onClick={handleBookRoom}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Réserver la salle
                    </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <BookingDialog
          open={isBookingOpen}
          roomId={room.id}
          roomName={room.name}
          onClose={() => setIsBookingOpen(false)}
        />
      </main>
    </div>
  );
};

export default RoomDetail;
