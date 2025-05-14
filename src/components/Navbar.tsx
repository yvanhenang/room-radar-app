import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Building2, Users, Calendar, LogOut, UserCog } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, isAdmin, logout, users, promoteToAdmin } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const handlePromoteToAdmin = (userId: string) => {
    try {
      promoteToAdmin(userId);
      toast({
        title: "Promotion réussie",
        description: "L'utilisateur a été promu administrateur",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de promouvoir l'utilisateur",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button
                variant={location.pathname === "/" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Accueil
              </Button>
            </Link>

            {isAdmin && (
              <Link to="/rooms">
                <Button
                  variant={location.pathname === "/rooms" ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Gérer les bureaux
                </Button>
              </Link>
            )}

            {isAdmin && (
              <Link to="/teams">
                <Button
                  variant={location.pathname === "/teams" ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Gérer les équipes
                </Button>
              </Link>
            )}

            <Link to="/calendar">
              <Button
                variant={location.pathname === "/calendar" ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Calendrier
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <UserCog className="h-4 w-4" />
                    Gestion des utilisateurs
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {users
                    .filter(u => u.role !== 'admin')
                    .map(user => (
                      <DropdownMenuItem
                        key={user.id}
                        onClick={() => handlePromoteToAdmin(user.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{user.name}</span>
                          <span className="text-xs text-gray-500">({user.email})</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
