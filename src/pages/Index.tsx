
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import RoomList from "@/components/RoomList";
import StatusBoard from "@/components/StatusBoard";
import BookingDialog from "@/components/BookingDialog";
import { Room } from "@/components/RoomCard";
import { useToast } from "@/components/ui/use-toast";

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

const Index = () => {
  const [roomsData, setRoomsData] = useState<Room[]>(rooms);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleBookRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsBookingOpen(true);
  };

  const handleBookingConfirm = (roomId: string, team: string, duration: string) => {
    // Calculer l'heure de fin en fonction de la durée sélectionnée
    let endTime;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    switch (duration) {
      case "30m":
        endTime = `${hours}:${minutes + 30 >= 60 ? hours + 1 : hours}:${(minutes + 30) % 60 < 10 ? '0' + (minutes + 30) % 60 : (minutes + 30) % 60}`;
        break;
      case "1h":
        endTime = `${hours + 1}:${minutes < 10 ? '0' + minutes : minutes}`;
        break;
      case "2h":
        endTime = `${hours + 2}:${minutes < 10 ? '0' + minutes : minutes}`;
        break;
      case "3h":
        endTime = `${hours + 3}:${minutes < 10 ? '0' + minutes : minutes}`;
        break;
      case "journee":
        endTime = "17:30";
        break;
      default:
        endTime = `${hours + 1}:${minutes < 10 ? '0' + minutes : minutes}`;
    }
    
    const updatedRooms = roomsData.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          isOccupied: true,
          occupiedBy: team,
          occupiedUntil: endTime,
        };
      }
      return room;
    });
    
    setRoomsData(updatedRooms);
    setIsBookingOpen(false);
    
    const selectedRoom = roomsData.find(room => room.id === roomId);
    toast({
      title: "Réservation confirmée",
      description: `${selectedRoom?.name} a été réservée pour ${team} jusqu'à ${endTime}`,
    });
  };

  const selectedRoom = roomsData.find(room => room.id === selectedRoomId);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-6">Salles de réunion</h1>
            <RoomList 
              rooms={roomsData} 
              onBookRoom={handleBookRoom}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-6">Tableau de bord</h2>
            <StatusBoard rooms={roomsData} />
          </div>
        </div>
      </main>
      
      {selectedRoom && (
        <BookingDialog
          open={isBookingOpen}
          roomId={selectedRoomId}
          roomName={selectedRoom.name}
          onClose={() => setIsBookingOpen(false)}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
};

export default Index;
