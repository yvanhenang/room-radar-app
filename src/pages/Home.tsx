import React, { useState, useEffect } from "react";
import { Home as HomeIcon, Building2, Users, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useRooms } from "@/context/RoomContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { format, addDays, subDays, isToday, isTomorrow, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/context/AuthContext";

interface Reservation {
  id: string;
  roomId: string;
  teamId: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Team {
  id: string;
  name: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { rooms } = useRooms();
  const { toast } = useToast();
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [selectedViewDate, setSelectedViewDate] = useState<Date>(new Date());

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ];

  useEffect(() => {
    const savedReservations = localStorage.getItem("reservations");
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }

    const savedTeams = localStorage.getItem("teams");
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  const features = [
    {
      title: "Gestion des Bureaux",
      description: "Gérez vos espaces de travail et leur disponibilité",
      icon: Building2,
      path: "/rooms",
      adminOnly: true
    },
    {
      title: "Gestion des Équipes",
      description: "Organisez vos équipes et leurs besoins",
      icon: Users,
      path: "/teams",
      adminOnly: true
    },
    {
      title: "Calendrier",
      description: "Planifiez et suivez les réservations",
      icon: Calendar,
      path: "/calendar",
      adminOnly: false
    },
  ];

  const getRoomName = (roomId: string) => {
    return rooms.find(room => room.id === roomId)?.name || "Bureau inconnu";
  };

  const getTeamName = (teamId: string) => {
    return teams.find(team => team.id === teamId)?.name || "Équipe inconnue";
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return "Aujourd'hui";
    if (isTomorrow(date)) return "Demain";
    if (isYesterday(date)) return "Hier";
    return format(date, "EEEE d MMMM yyyy", { locale: fr });
  };

  const handlePreviousDay = () => {
    setSelectedViewDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedViewDate(prev => addDays(prev, 1));
  };

  const handleToday = () => {
    setSelectedViewDate(new Date());
  };

  const filteredReservations = reservations
    .filter(res => res.date === format(selectedViewDate, "yyyy-MM-dd"))
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleBooking = () => {
    if (!selectedRoom || !selectedTeam || !startTime || !endTime) {
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
      reservation.date === selectedViewDate.toISOString().split('T')[0] &&
      ((startTime >= reservation.startTime && startTime < reservation.endTime) ||
       (endTime > reservation.startTime && endTime <= reservation.endTime))
    );

    if (!isRoomAvailable) {
      toast({
        title: "Erreur",
        description: "Ce bureau est déjà réservé pour cette période",
        variant: "destructive",
      });
      return;
    }

    const newReservation: Reservation = {
      id: Date.now().toString(),
      roomId: selectedRoom,
      teamId: selectedTeam,
      date: selectedViewDate.toISOString().split('T')[0],
      startTime,
      endTime,
    };

    const updatedReservations = [...reservations, newReservation];
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));

    toast({
      title: "Réservation confirmée",
      description: `Le bureau a été réservé pour ${startTime} - ${endTime}`,
    });

    setSelectedRoom("");
    setSelectedTeam("");
    setStartTime("");
    setEndTime("");
  };

  const handleReleaseRoom = (reservationId: string) => {
    const updatedReservations = reservations.filter(res => res.id !== reservationId);
    setReservations(updatedReservations);
    localStorage.setItem("reservations", JSON.stringify(updatedReservations));

    toast({
      title: "Bureau libéré",
      description: "Le bureau a été libéré avec succès",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HomeIcon className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Room Radar
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bienvenue {user?.name} dans votre espace de gestion des bureaux. Gérez vos espaces de travail, 
            organisez vos équipes et planifiez vos réservations en toute simplicité.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-8">
          {features
            .filter(feature => !feature.adminOnly || user?.role === 'admin')
            .map((feature) => (
              <Card 
                key={feature.title}
                className="border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-primary">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white transition-colors"
                    onClick={() => navigate(feature.path)}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto mb-8">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-primary">
                    Réservations
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousDay}
                    className="p-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToday}
                    className="text-sm"
                  >
                    Aujourd'hui
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextDay}
                    className="p-2"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {formatDate(selectedViewDate)}
              </div>
            </CardHeader>
            <CardContent>
              {filteredReservations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="p-4 border rounded-lg bg-white/50 hover:bg-white/80 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        <h3 className="font-medium text-primary">
                          {getRoomName(reservation.roomId)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <p className="text-sm text-gray-600">
                          {getTeamName(reservation.teamId)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {reservation.startTime} - {reservation.endTime}
                        </Badge>
                        {isToday(selectedViewDate) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleReleaseRoom(reservation.id)}
                          >
                            Libérer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  Aucune réservation pour {formatDate(selectedViewDate).toLowerCase()}
                </p>
              )}
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  className="bg-white/50 hover:bg-white/80"
                  onClick={() => navigate('/calendar')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Voir toutes les réservations
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold text-primary">
                  Réserver un Bureau
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bureau</label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="bg-white/50">
                      <SelectValue placeholder="Sélectionner un bureau" />
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
                  <Calendar className="mr-2 h-4 w-4" />
                  Réserver
                </Button>
              </div>

              {/* Historique des réservations futures */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Historique des réservations futures
                </h3>
                <div className="space-y-3">
                  {reservations
                    .filter(res => new Date(res.date) > new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((reservation) => (
                      <div
                        key={reservation.id}
                        className="p-3 bg-white/50 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="font-medium text-primary">
                              {getRoomName(reservation.roomId)}
                            </span>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {format(new Date(reservation.date), "dd/MM/yyyy", { locale: fr })}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{getTeamName(reservation.teamId)}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {reservation.startTime} - {reservation.endTime}
                        </div>
                      </div>
                    ))}
                  {reservations.filter(res => new Date(res.date) > new Date()).length === 0 && (
                    <p className="text-center text-gray-500 py-2">
                      Aucune réservation future
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Home; 