/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackendStatusBanner from './components/BackendStatusBanner';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchPage from './pages/SearchPage';
import MovieDetails from './pages/MovieDetails';
import AiRecommendations from './pages/AiRecommendations';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import RecentlyViewed from './pages/RecentlyViewed';
import SearchHistoryPage from './pages/SearchHistoryPage';
import Profile from './pages/Profile';
export default function App() {
    return (<AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-[140px] pointer-events-none -z-10"/>
          <div className="fixed bottom-10 right-10 w-96 h-96 bg-blue-900/10 rounded-full blur-[160px] pointer-events-none -z-10"/>

          <BackendStatusBanner />
          <Navbar />

          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/search" element={<SearchPage />}/>
              <Route path="/movie/:id" element={<MovieDetails />}/>
              <Route path="/recommendations" element={<AiRecommendations />}/>
              <Route path="/favorites" element={<Favorites />}/>
              <Route path="/watchlist" element={<Watchlist />}/>
              <Route path="/recently-viewed" element={<RecentlyViewed />}/>
              <Route path="/search-history" element={<SearchHistoryPage />}/>
              <Route path="/profile" element={<Profile />}/>
              <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>);
}
