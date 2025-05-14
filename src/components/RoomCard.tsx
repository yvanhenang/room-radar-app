
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
  onBookRoom?: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBookRoom }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/room/${room.id}`);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{room.name}</CardTitle>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-500">
            <Users className="mr-2 h-4 w-4" />
            <span>Capacité: {room.capacity} personnes</span>
          </div>
          
          {room.isOccupied && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Occupé par:</p>
              <p className="text-sm text-gray-600">{room.occupiedBy}</p>
              {room.occupiedUntil && (
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>Jusqu'à {room.occupiedUntil}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewDetails}
            >
              Détails
            </Button>
            
            {!room.isOccupied && onBookRoom && (
              <Button 
                size="sm"
                onClick={() => onBookRoom(room.id)}
              >
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
