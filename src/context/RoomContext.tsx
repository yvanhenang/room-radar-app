import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  isOccupied: boolean;
  occupiedBy?: string;
  occupiedUntil?: string;
}

interface RoomContextType {
  rooms: Room[];
  updateRoomStatus: (roomId: string, isOccupied: boolean, occupiedBy?: string, occupiedUntil?: string) => void;
  addRoom: (name: string, capacity: number) => void;
  updateRoom: (id: string, name: string, capacity: number) => void;
  deleteRoom: (id: string) => void;
  getRoom: (roomId: string) => Room | undefined;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const savedRooms = localStorage.getItem("rooms");
    if (savedRooms) {
      return JSON.parse(savedRooms);
    }
    return [
      { id: "1", name: "Salle Harmonie", capacity: 8, isOccupied: false },
      { id: "2", name: "Salle Créativité", capacity: 6, isOccupied: false },
      { id: "3", name: "Salle Innovation", capacity: 12, isOccupied: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  const updateRoomStatus = (roomId: string, isOccupied: boolean, occupiedBy?: string, occupiedUntil?: string) => {
    setRooms(rooms.map(room =>
      room.id === roomId ? { ...room, isOccupied, occupiedBy, occupiedUntil } : room
    ));
  };

  const addRoom = (name: string, capacity: number) => {
    const newRoom: Room = {
      id: Date.now().toString(),
      name,
      capacity,
      isOccupied: false,
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, name: string, capacity: number) => {
    setRooms(rooms.map(room =>
      room.id === id ? { ...room, name, capacity } : room
    ));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const getRoom = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  return (
    <RoomContext.Provider value={{ rooms, updateRoomStatus, addRoom, updateRoom, deleteRoom, getRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRooms = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRooms must be used within a RoomProvider");
  }
  return context;
}; 