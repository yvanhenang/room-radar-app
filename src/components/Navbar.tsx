
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, DoorOpen, MapPin } from "lucide-react";

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DoorOpen className="h-6 w-6 text-primary" />
          <Link to="/" className="font-bold text-xl text-primary">SalleRéunion</Link>
        </div>
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-primary flex items-center gap-2">
            <DoorOpen className="h-4 w-4" />
            <span>Salles</span>
          </Link>
          <Link to="/calendar" className="text-gray-600 hover:text-primary flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Calendrier</span>
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Aide
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
