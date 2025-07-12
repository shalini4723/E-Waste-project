import React from "react"; 
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import About from "./Components/About/About"; 
import Home from "./Components/Home/Home"; 
import Recycle from "./Components/Recycle/Recycle"; 
import Contact from "./Components/Contactus/Contact"; 
import Efacility from "./Components/e-facilities/Efacility"; 
import Smartphone from "./Components/Recycle/smartphone/Smartphone"; 
import Laptop from "./Components/Recycle/laptop/Laptop"; 
import Accessories from "./Components/Recycle/accessories/Accessories"; 
import Television from "./Components/Recycle/television/Television"; 
import Refrigerator from "./Components/Recycle/refrigerator/Refrigerator"; 
import Others from "./Components/Recycle/other/Others"; 
import RecycleDashboard from "./Components/RecycleDashboard/RecycleDashboard"; 
import ApprovedBookings from "./Components/RecycleDashboard/ApprovedBookings"; 
import RejectedBookings from "./Components/RecycleDashboard/RejectedBookings"; 
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Logout from "./Components/Auth/Logout";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { AdminRoute } from "./Components/AdminRoute";
import Profile from "./Components/Auth/Profile";
 
const App: React.FC = () => { 
  return (
    <AuthProvider>
      <Router> 
        <Routes> 
          {/* Public Routes */}
          <Route path="/" element={<Home />} /> 
          <Route path="/about" element={<About />} /> 
          <Route path="/contact" element={<Contact />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/logout" element={<Logout />} /> 

          
          {/* Protected Routes (User) */}
          <Route path="/recycle" element={
            <ProtectedRoute>
              <Recycle />
            </ProtectedRoute>
          } /> 
          <Route path="/recycle/smartphone" element={
            <ProtectedRoute>
              <Smartphone />
            </ProtectedRoute>
          } /> 
          <Route path="/recycle/laptop" element={
            <ProtectedRoute>
              <Laptop />
            </ProtectedRoute>
          } /> 
          <Route path="/recycle/accessories" element={
            <ProtectedRoute>
              <Accessories />
            </ProtectedRoute>
          } /> 
          <Route path="/recycle/television" element={
            <ProtectedRoute>
              <Television />
            </ProtectedRoute>
          } /> 
          <Route path="/recycle/refrigerator" element={
            <ProtectedRoute>
              <Refrigerator />
            </ProtectedRoute>
          } /> 
          <Route path="/recycle/other" element={
            <ProtectedRoute>
              <Others />
            </ProtectedRoute>
          } /> 
          <Route path="/e-facilities" element={
            <ProtectedRoute>
              <Efacility />
            </ProtectedRoute>
          } /> 
          <Route path="/smartphone" element={
            <ProtectedRoute>
              <Smartphone />
            </ProtectedRoute>
          } /> 
          
          {/* Admin Routes */}
          <Route path="/dashboard" element={
            <AdminRoute>
              <RecycleDashboard />
            </AdminRoute>
          } /> 
          <Route path="/approved" element={
            <AdminRoute>
              <ApprovedBookings />
            </AdminRoute>
          } /> 
          <Route path="/rejected" element={
            <AdminRoute>
              <RejectedBookings />
            </AdminRoute>
          } /> 
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes> 
      </Router>
    </AuthProvider>
  ); 
} 
 
export default App;