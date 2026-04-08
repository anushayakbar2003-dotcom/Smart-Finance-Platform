import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import UserProfile from "./pages/UserProfile";
import Portfolio from "./pages/Portfolio";
import Recommendations from "./pages/Recommendations";
import NotFound from "./pages/NotFound";
import { PortfolioProvider, usePortfolio } from "./contexts/PortfolioContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import "./styles.css";

function Navbar() {
  const { portfolio } = usePortfolio();
  return (
    <nav className="navbar">
      <span className="nav-brand">💰 SmartFinance</span>
      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <NavLink to="/portfolio">
          Portfolio {portfolio.length > 0 && `(${portfolio.length})`}
        </NavLink>
        <NavLink to="/recommendations">Recommendations</NavLink>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <UserProfileProvider>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </UserProfileProvider>
  );
}

export default App;