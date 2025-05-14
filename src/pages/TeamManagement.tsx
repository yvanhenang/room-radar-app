import React, { useState, useEffect } from "react";
import { Users, Plus, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Team {
  id: string;
  name: string;
  members: number;
}

const TeamManagement: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  const handleCreateTeam = () => {
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
      members: 0,
    };

    const updatedTeams = [...teams, newTeam];
    setTeams(updatedTeams);
    localStorage.setItem("teams", JSON.stringify(updatedTeams));
    setNewTeamName("");

    toast({
      title: "Équipe créée",
      description: `L'équipe "${newTeam.name}" a été créée avec succès`,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gestion des Équipes
            </h1>
          </div>
          <p className="text-gray-600">
            Créez et gérez vos équipes pour une meilleure organisation des espaces de travail.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Liste des Équipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-primary">{team.name}</h3>
                          <p className="text-sm text-gray-600">
                            {team.members} membre{team.members > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {teams.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      Aucune équipe n'a été créée
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  Nouvelle Équipe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName" className="text-gray-700">
                    Nom de l'équipe
                  </Label>
                  <Input
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Entrez le nom de l'équipe"
                    className="bg-white/50"
                  />
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
                  onClick={handleCreateTeam}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Créer l'équipe
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeamManagement; 