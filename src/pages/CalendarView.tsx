
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Room } from "@/components/RoomCard";

// Données statiques pour la démonstration
const rooms: Room[] = [
  {
    id: "1",
    name: "Salle Harmonie",
    capacity: 8,
    isOccupied: false,
  },
  {
    id: "2",
    name: "Salle Créativité",
    capacity: 6,
    isOccupied: true,
    occupiedBy: "Équipe Marketing",
    occupiedUntil: "14:00",
  },
  {
    id: "3",
    name: "Salle Innovation",
    capacity: 12,
    isOccupied: false,
  },
  {
    id: "4",
    name: "Bureau Collaboration",
    capacity: 4,
    isOccupied: true,
    occupiedBy: "Équipe Design",
    occupiedUntil: "15:30",
  },
  {
    id: "5",
    name: "Salle Stratégie",
    capacity: 10,
    isOccupied: false,
  },
  {
    id: "6",
    name: "Espace Projet",
    capacity: 16,
    isOccupied: false,
  }
];

interface CalendarEvent {
  room: string;
  team: string;
  start: string;
  end: string;
}

// Données simulées pour les événements du calendrier
const events: Record<string, CalendarEvent[]> = {
  "2025-05-14": [
    { room: "Salle Créativité", team: "Équipe Marketing", start: "11:00", end: "14:00" },
    { room: "Bureau Collaboration", team: "Équipe Design", start: "13:00", end: "15:30" },
  ],
  "2025-05-15": [
    { room: "Salle Harmonie", team: "Équipe RH", start: "09:00", end: "11:00" },
    { room: "Salle Innovation", team: "Équipe Développement", start: "14:00", end: "16:00" },
  ],
  "2025-05-16": [
    { room: "Salle Stratégie", team: "Équipe Direction", start: "10:00", end: "12:00" },
    { room: "Espace Projet", team: "Équipe Développement", start: "14:30", end: "17:00" },
  ]
};

const CalendarView = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const dateKey = date ? date.toISOString().split('T')[0] : "";
  const dayEvents = events[dateKey] || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Calendrier des réservations</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Card>
              <CardContent className="pt-6">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>
                  Réservations du {date?.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dayEvents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <p className="text-lg font-medium text-gray-900">Aucune réservation</p>
                    <p className="mt-1 text-gray-500">
                      Il n'y a pas de réservations prévues pour cette date.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dayEvents.map((event, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{event.room}</h3>
                          <Badge variant="outline">{event.start} - {event.end}</Badge>
                        </div>
                        <p className="mt-1 text-gray-600">{event.team}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarView;
