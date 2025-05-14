
import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "lucide-react";

interface BookingDialogProps {
  open: boolean;
  roomId: string | null;
  roomName: string;
  onClose: () => void;
  onConfirm: (roomId: string, team: string, duration: string) => void;
}

const teams = ["Équipe Marketing", "Équipe Développement", "Équipe Design", "Équipe RH", "Équipe Direction"];

const BookingDialog: React.FC<BookingDialogProps> = ({ open, roomId, roomName, onClose, onConfirm }) => {
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [duration, setDuration] = useState<string>("1h");
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!roomId) return;
    
    if (!selectedTeam) {
      toast({
        title: "Veuillez sélectionner une équipe",
        variant: "destructive"
      });
      return;
    }
    
    onConfirm(roomId, selectedTeam, duration);
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
                  <SelectItem key={team} value={team}>{team}</SelectItem>
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
