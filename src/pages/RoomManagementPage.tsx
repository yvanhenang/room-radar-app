import React from "react";
import Navbar from "@/components/Navbar";
import { RoomManagement } from "@/components/RoomManagement";
import { Building2 } from "lucide-react";

const RoomManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gestion des Bureaux
            </h1>
          </div>
          <p className="text-gray-600">
            Gérez vos espaces de travail, modifiez leur capacité et suivez leur utilisation.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-none">
          <RoomManagement />
        </div>
      </main>
    </div>
  );
};

export default RoomManagementPage; 