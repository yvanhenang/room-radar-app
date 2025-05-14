import React from "react";
import Navbar from "@/components/Navbar";
import TeamManagement from "@/components/TeamManagement";

const TeamManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <TeamManagement />
      </main>
    </div>
  );
};

export default TeamManagementPage; 