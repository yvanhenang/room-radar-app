import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import RoomCard from "@/components/RoomCard";
import BookingDialog from "@/components/BookingDialog";
import StatusBoard from "@/components/StatusBoard";
import { useRooms } from "@/context/RoomContext";

const Index: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { rooms } = useRooms();

  const handleBookRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setIsBookingOpen(true);
  };

  const selectedRoom = selectedRoomId ? rooms.find(room => room.id === selectedRoomId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Salles de réunion</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
              onBookRoom={handleBookRoom}
            />
              ))}
            </div>
          </div>
          
          <div>
            <StatusBoard rooms={rooms} />
          </div>
        </div>
      
      {selectedRoom && (
        <BookingDialog
          open={isBookingOpen}
            roomId={selectedRoom.id}
          roomName={selectedRoom.name}
            onClose={() => {
              setIsBookingOpen(false);
              setSelectedRoomId(null);
            }}
        />
      )}
      </main>
    </div>
  );
};

export default Index;
