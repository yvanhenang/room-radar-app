
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Room } from "./RoomCard";
import { Door Open, User } from "lucide-react";

interface StatusBoardProps {
  rooms: Room[];
}

const StatusBoard: React.FC<StatusBoardProps> = ({ rooms }) => {
  const availableRooms = rooms.filter(room => !room.isOccupied);
  const occupiedRooms = rooms.filter(room => room.isOccupied);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">État des salles</CardTitle>
        <CardDescription>Aperçu en temps réel des salles disponibles et occupées</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center p-2 bg-available rounded">
            <div className="flex items-center gap-2">
              <Door Open className="h-5 w-5 text-available-foreground" />
              <span className="font-medium text-available-foreground">Disponibles</span>
            </div>
            <Badge variant="outline" className="bg-white">
              {availableRooms.length}
            </Badge>
          </div>

          <div className="flex justify-between items-center p-2 bg-occupied rounded">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-occupied-foreground" />
              <span className="font-medium text-occupied-foreground">Occupées</span>
            </div>
            <Badge variant="outline" className="bg-white">
              {occupiedRooms.length}
            </Badge>
          </div>

          {occupiedRooms.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Occupation actuelle:</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {occupiedRooms.map(room => (
                  <div key={room.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{room.name}</p>
                      <p className="text-sm text-gray-500">{room.occupiedBy}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {room.occupiedUntil}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusBoard;
