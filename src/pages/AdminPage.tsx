import React from "react";
import TeamManagement from "@/components/TeamManagement";

const AdminPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>
      <TeamManagement />
    </div>
  );
};

export default AdminPage; 