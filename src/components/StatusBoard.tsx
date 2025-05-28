import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "./RoomCard";
import { DoorOpen, CheckCircle2 } from "lucide-react";

interface StatusBoardProps {
  rooms: Room[];
}

const StatusBoard: React.FC<StatusBoardProps> = ({ rooms }) => {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.isOccupied).length;
  const availableRooms = totalRooms - occupiedRooms;

  return (
    <Card>
      <CardHeader>
        <CardTitle>État des salles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-available/10 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Disponibles</span>
            </div>
            <span className="text-2xl font-bold">{availableRooms}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-occupied/10 rounded-lg">
            <div className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5 text-red-500" />
              <span className="font-medium">Occupées</span>
            </div>
            <span className="text-2xl font-bold">{occupiedRooms}</span>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total des salles</span>
              <span className="font-medium">{totalRooms}</span>
                    </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(availableRooms / totalRooms) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusBoard;
