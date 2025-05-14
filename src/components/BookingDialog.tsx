import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "lucide-react";
import { useRooms } from "@/context/RoomContext";

interface Team {
  id: string;
  name: string;
}

interface BookingDialogProps {
  open: boolean;
  roomId: string | null;
  roomName: string;
  onClose: () => void;
}

const BookingDialog: React.FC<BookingDialogProps> = ({ open, roomId, roomName, onClose }) => {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [duration, setDuration] = useState<string>("1h");
  const [teams, setTeams] = useState<Team[]>([]);
  const { toast } = useToast();
  const { updateRoomStatus } = useRooms();

  // Charger les équipes depuis le localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  const handleConfirm = () => {
    if (!roomId) return;
    
    if (!selectedTeam) {
      toast({
        title: "Veuillez sélectionner une équipe",
        variant: "destructive"
      });
      return;
    }

    // Calculer l'heure de fin en fonction de la durée
    const now = new Date();
    let endTime = new Date(now);
    
    switch (duration) {
      case "30m":
        endTime.setMinutes(now.getMinutes() + 30);
        break;
      case "1h":
        endTime.setHours(now.getHours() + 1);
        break;
      case "2h":
        endTime.setHours(now.getHours() + 2);
        break;
      case "3h":
        endTime.setHours(now.getHours() + 3);
        break;
      case "journee":
        endTime.setHours(17, 0, 0); // Fin de journée à 17h
        break;
    }

    const endTimeString = endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    // Mettre à jour le statut de la salle
    updateRoomStatus(roomId, true, selectedTeam, endTimeString);
    
    toast({
      title: "Réservation confirmée",
      description: `${roomName} a été réservée pour ${selectedTeam} jusqu'à ${endTimeString}`,
    });
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedTeam("");
    setDuration("1h");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Réserver {roomName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="team">Équipe</Label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une équipe" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.name}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Durée</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Durée de la réservation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30m">30 minutes</SelectItem>
                <SelectItem value="1h">1 heure</SelectItem>
                <SelectItem value="2h">2 heures</SelectItem>
                <SelectItem value="3h">3 heures</SelectItem>
                <SelectItem value="journee">Toute la journée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} className="gap-2">
            <Calendar className="h-4 w-4" />
            Réserver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
