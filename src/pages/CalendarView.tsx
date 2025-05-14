import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, Users, Building2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import { useRooms } from "@/context/RoomContext";
import { Badge } from "@/components/ui/badge";

interface Team {
  id: string;
  name: string;
}

interface Reservation {
  id: string;
  roomId: string;
  teamId: string;
  date: string;
  startTime: string;
  endTime: string;
}

const CalendarView: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();
  const { rooms } = useRooms();

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }

    const savedReservations = localStorage.getItem("reservations");
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }
  }, []);

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  const handleBooking = () => {
    if (!date || !selectedTeam || !startTime || !endTime || !selectedRoom) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: "Erreur",
        description: "L'heure de fin doit être après l'heure de début",
        variant: "destructive",
      });
      return;
}

    const isRoomAvailable = !reservations.some(reservation => 
      reservation.roomId === selectedRoom &&
      reservation.date === date.toISOString().split('T')[0] &&
      ((startTime >= reservation.startTime && startTime < reservation.endTime) ||
       (endTime > reservation.startTime && endTime <= reservation.endTime))
    );

    if (!isRoomAvailable) {
      toast({
        title: "Erreur",
        description: "Cette salle est déjà réservée pour cette période",
        variant: "destructive",
      });
      return;
    }

    const newReservation: Reservation = {
      id: Date.now().toString(),
      roomId: selectedRoom,
      teamId: selectedTeam,
      date: date.toISOString().split('T')[0],
      startTime,
      endTime,
    };

    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));

    toast({
      title: "Réservation confirmée",
      description: `La salle a été réservée pour ${startTime} - ${endTime}`,
    });

    setSelectedTeam("");
    setStartTime("");
    setEndTime("");
    setSelectedRoom("");
  };

  const getReservationsForDate = (date: Date) => {
    return reservations.filter(
      reservation => reservation.date === date.toISOString().split('T')[0]
    );
  };

  const getRoomName = (roomId: string) => {
    return rooms.find(room => room.id === roomId)?.name || "Salle inconnue";
  };

  const getTeamName = (teamId: string) => {
    return teams.find(team => team.id === teamId)?.name || "Équipe inconnue";
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Calendrier des Réservations
            </h1>
          </div>
          <p className="text-gray-600">
            Planifiez et gérez les réservations de vos espaces de travail.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Calendrier</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border bg-white/50"
                />
              </CardContent>
            </Card>
          
            {date && (
              <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                  <CardTitle className="text-xl font-semibold text-primary">
                    Réservations du {date.toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                    {getReservationsForDate(date).map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                      >
                        <div>
                          <h3 className="font-medium text-primary">{getRoomName(reservation.roomId)}</h3>
                          <p className="text-sm text-gray-600">
                            {getTeamName(reservation.teamId)}
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {reservation.startTime} - {reservation.endTime}
                        </Badge>
                      </div>
                    ))}
                    {getReservationsForDate(date).length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        Aucune réservation pour cette date
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Nouvelle Réservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Salle</label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Sélectionner une salle" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            {room.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Équipe</label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            {team.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Heure de début</label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Sélectionner une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Heure de fin</label>
                  <Select
                    value={endTime}
                    onValueChange={setEndTime}
                    disabled={!startTime}
                  >
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Sélectionner une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots
                        .filter((time) => time > startTime)
                        .map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
                  onClick={handleBooking}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Réserver
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarView;
