import React, { createContext, useState, useContext, useEffect } from "react";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("portfolio");
    if (saved) setPortfolio(JSON.parse(saved));
  }, []);

  // Save to localStorage whenever portfolio changes
  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  function addToPortfolio(product, amount = product.minInvestment) {
    if (portfolio.some((item) => item.product.id === product.id)) return;
    setPortfolio([...portfolio, { product, amount: Number(amount) }]);
  }

  function removeFromPortfolio(productId) {
    setPortfolio(portfolio.filter((item) => item.product.id !== productId));
  }

  function updateAmount(productId, newAmount) {
    setPortfolio(
      portfolio.map((item) =>
        item.product.id === productId ? { ...item, amount: Number(newAmount) } : item
      )
    );
  }

  const totalInvested = portfolio.reduce((sum, item) => sum + item.amount, 0);

  const weightedReturn =
    totalInvested === 0
      ? 0
      : portfolio.reduce(
          (sum, item) => sum + (item.amount / totalInvested) * item.product.expectedReturn,
          0
        ).toFixed(2);

  const riskDistribution = { low: 0, medium: 0, high: 0 };
  if (totalInvested > 0) {
    portfolio.forEach((item) => {
      riskDistribution[item.product.riskLevel] += (item.amount / totalInvested) * 100;
    });
  }

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        addToPortfolio,
        removeFromPortfolio,
        updateAmount,
        totalInvested,
        weightedReturn: Number(weightedReturn),
        riskDistribution,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}