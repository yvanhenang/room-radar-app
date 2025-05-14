import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useRooms } from "@/context/RoomContext";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function RoomManagement() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
  const { toast } = useToast();
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState<number>(4);
  const [editingRoom, setEditingRoom] = useState<{ id: string; name: string; capacity: number } | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la salle ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    if (newRoomCapacity < 1) {
      toast({
        title: "Erreur",
        description: "La capacité doit être d'au moins 1 personne",
        variant: "destructive",
      });
      return;
    }

    addRoom(newRoomName.trim(), newRoomCapacity);
    setNewRoomName("");
    setNewRoomCapacity(4);
    toast({
      title: "Succès",
      description: "La salle a été créée avec succès",
    });
  };

  const handleUpdateRoom = () => {
    if (!editingRoom) return;

    if (!editingRoom.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la salle ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    if (editingRoom.capacity < 1) {
      toast({
        title: "Erreur",
        description: "La capacité doit être d'au moins 1 personne",
        variant: "destructive",
      });
      return;
    }

    updateRoom(editingRoom.id, editingRoom.name.trim(), editingRoom.capacity);
    setEditingRoom(null);
    toast({
      title: "Succès",
      description: "La salle a été mise à jour avec succès",
    });
  };

  const handleDeleteRoom = (id: string) => {
    deleteRoom(id);
    setRoomToDelete(null);
    toast({
      title: "Succès",
      description: "La salle a été supprimée avec succès",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle salle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="roomName">Nom de la salle</Label>
              <Input
                id="roomName"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Entrez le nom de la salle"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roomCapacity">Capacité</Label>
              <Input
                id="roomCapacity"
                type="number"
                min="1"
                value={newRoomCapacity}
                onChange={(e) => setNewRoomCapacity(parseInt(e.target.value) || 1)}
              />
            </div>
            <Button onClick={handleCreateRoom}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter la salle
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Salles existantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                {editingRoom?.id === room.id ? (
                  <div className="flex-1 grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`edit-room-name-${room.id}`}>Nom</Label>
                      <Input
                        id={`edit-room-name-${room.id}`}
                        value={editingRoom.name}
                        onChange={(e) =>
                          setEditingRoom({ ...editingRoom, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`edit-room-capacity-${room.id}`}>Capacité</Label>
                      <Input
                        id={`edit-room-capacity-${room.id}`}
                        type="number"
                        min="1"
                        value={editingRoom.capacity}
                        onChange={(e) =>
                          setEditingRoom({
                            ...editingRoom,
                            capacity: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateRoom}>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingRoom(null)}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium">{room.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Capacité : {room.capacity} personnes
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setEditingRoom({
                            id: room.id,
                            name: room.name,
                            capacity: room.capacity,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setRoomToDelete(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!roomToDelete} onOpenChange={() => setRoomToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La suppression de cette salle supprimera également toutes les réservations associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => roomToDelete && handleDeleteRoom(roomToDelete)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 