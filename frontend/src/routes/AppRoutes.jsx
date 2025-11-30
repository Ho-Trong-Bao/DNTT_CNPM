// File: src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các trang
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import UserInfo from '../pages/UserInfo';
import Search from '../pages/Search'; 
import CreatePost from '../pages/CreatePost'
import MyPosts from '../pages/MyPosts';
import BookDetail from '../pages/BookDetail'
import AdminDashboard from '../pages/AdminDashboard';
// 1. IMPORT CỔNG BẢO VỆ
import ProtectedRoute from '../components/ProtectedRoute'; 

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- NHÓM 1: CÔNG KHAI (Ai cũng vào được) --- */}
      <Route path="/" element={<Home />} />
      <Route path="/pages/login" element={<Login />} />
      <Route path="/pages/signup" element={<Signup />} />
      <Route path="/pages/search" element={<Search />} />
      <Route path="/pages/create-posts" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/pages/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute><UserInfo /></ProtectedRoute>} />
      <Route path="/pages/book/:id" element={ <BookDetail />} />
      <Route path="/pages/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AppRoutes;