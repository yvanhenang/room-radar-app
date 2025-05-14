import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DoorOpen, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  isOccupied: boolean;
  occupiedBy?: string;
  occupiedUntil?: string;
}

interface RoomCardProps {
  room: Room;
  onBookRoom: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBookRoom }) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{room.name}</CardTitle>
        {room.isOccupied ? (
          <Badge variant="outline" className="bg-occupied text-occupied-foreground animate-pulse-slow">
            Occupée
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-available text-available-foreground">
            Disponible
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-2 h-4 w-4" />
            {room.capacity} personnes
          </div>
          
          {room.isOccupied && (
            <div className="text-sm text-gray-500">
              <div className="flex items-center">
                <DoorOpen className="mr-2 h-4 w-4" />
                Occupée par {room.occupiedBy}
              </div>
              <div className="ml-6 mt-1">
                Jusqu'à {room.occupiedUntil}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/room/${room.id}`)}
            >
              Détails
            </Button>
            {!room.isOccupied && (
              <Button
                className="flex-1"
                onClick={() => onBookRoom(room.id)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Réserver
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
