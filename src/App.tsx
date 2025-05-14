import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { RoomProvider } from "@/context/RoomContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import TeamManagement from "@/pages/TeamManagement";
import CalendarView from "@/pages/CalendarView";
import RoomManagementPage from "@/pages/RoomManagementPage";
import LoginPage from "@/pages/LoginPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RoomProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
            <div className="relative">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/teams"
                  element={
                    <ProtectedRoute requireAdmin>
                      <TeamManagement />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/calendar"
                  element={
                    <ProtectedRoute>
                      <CalendarView />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/rooms"
                  element={
                    <ProtectedRoute requireAdmin>
                      <RoomManagementPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </div>
          </div>
        </Router>
      </RoomProvider>
    </AuthProvider>
  );
};

export default App;
