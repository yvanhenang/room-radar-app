import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Team {
  id: string;
  name: string;
}

const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const { toast } = useToast();

  // Charger les équipes depuis le localStorage au démarrage
  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  // Sauvegarder les équipes dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("teams", JSON.stringify(teams));
  }, [teams]);

  const handleAddTeam = () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de l'équipe ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName.trim(),
    };

    setTeams([...teams, newTeam]);
    setNewTeamName("");
    toast({
      title: "Succès",
      description: "Équipe ajoutée avec succès",
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId));
    toast({
      title: "Succès",
      description: "Équipe supprimée avec succès",
    });
  };

  const handleDeleteAllTeams = () => {
    setTeams([]);
    toast({
      title: "Succès",
      description: "Toutes les équipes ont été supprimées",
    });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des équipes</h2>
        {teams.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Supprimer toutes les équipes
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action supprimera définitivement toutes les équipes. Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllTeams}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium mb-4">Ajouter une nouvelle équipe</h3>
        <div className="flex gap-4">
          <Input
            placeholder="Nom de la nouvelle équipe"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTeam()}
          />
          <Button onClick={handleAddTeam} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter l'équipe
          </Button>
        </div>
      </div>

      {teams.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-lg font-medium mb-4">Liste des équipes</h3>
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white"
            >
              <span className="font-medium">{team.name}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTeam(team.id)}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucune équipe n'a été créée. Commencez par ajouter une équipe ci-dessus.
        </div>
      )}
    </div>
  );
};

export default TeamManagement; 