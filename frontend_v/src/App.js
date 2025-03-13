// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/dashboards/user-dashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import ProfileView from "./components/profile/ProfileView";
import PlantSearch from "./components/plants/PlantSearch";
import PlantDetails from "./components/plants/PlantDetails";
import PlantForm from "./components/plants/PlantForm";
import Notifications from "./components/notifications/Notifications";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/plants" element={<PlantSearch />} />
            <Route path="/plants/:id" element={<PlantDetails />} />
            <Route path="/plants/add" element={<PlantForm />} />
            <Route path="/plants/edit/:id" element={<PlantForm />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
