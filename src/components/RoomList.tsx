
import React, { useState } from "react";
import RoomCard, { Room } from "./RoomCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface RoomListProps {
  rooms: Room[];
  onBookRoom?: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onBookRoom }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "occupied">("all");
  
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "available") return matchesSearch && !room.isOccupied;
    if (filter === "occupied") return matchesSearch && room.isOccupied;
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une salle..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as "all" | "available" | "occupied")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les salles</SelectItem>
              <SelectItem value="available">Disponibles</SelectItem>
              <SelectItem value="occupied">Occupées</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} onBookRoom={onBookRoom} />
        ))}
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-gray-900">Aucune salle trouvée</p>
          <p className="mt-1 text-gray-500">
            Aucune salle ne correspond à votre recherche.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomList;
