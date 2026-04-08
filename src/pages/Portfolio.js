import React, { useState } from "react";
import { usePortfolio } from "../contexts/PortfolioContext";

function Portfolio() {
  const {
    portfolio,
    removeFromPortfolio,
    updateAmount,
    totalInvested,
    weightedReturn,
    riskDistribution,
  } = usePortfolio();

  return (
    <div className="portfolio-page">
      <h2>My Portfolio</h2>
      {portfolio.length === 0 ? (
        <p>Your portfolio is empty. Add products from the Products page.</p>
      ) : (
        <>
          {portfolio.map((item) => (
            <PortfolioItem
              key={item.product.id}
              item={item}
              onRemove={() => removeFromPortfolio(item.product.id)}
              onUpdateAmount={(newAmount) => updateAmount(item.product.id, newAmount)}
            />
          ))}
          <div className="portfolio-summary">
            <h3>Portfolio Summary</h3>
            <p>Total Invested: PKR {totalInvested.toLocaleString()}</p>
            <p>Weighted Expected Return: {weightedReturn}%</p>
            <h4>Risk Distribution</h4>
            <div className="risk-dist">
              <div>
                <span>Low Risk:</span>
                <div className="risk-bar-bg">
                  <div
                    className="risk-bar-fill"
                    style={{ width: `${riskDistribution.low.toFixed(0)}%`, backgroundColor: "green" }}
                  ></div>
                </div>
                <span>{riskDistribution.low.toFixed(1)}%</span>
              </div>
              <div>
                <span>Medium Risk:</span>
                <div className="risk-bar-bg">
                  <div
                    className="risk-bar-fill"
                    style={{ width: `${riskDistribution.medium.toFixed(0)}%`, backgroundColor: "orange" }}
                  ></div>
                </div>
                <span>{riskDistribution.medium.toFixed(1)}%</span>
              </div>
              <div>
                <span>High Risk:</span>
                <div className="risk-bar-bg">
                  <div
                    className="risk-bar-fill"
                    style={{ width: `${riskDistribution.high.toFixed(0)}%`, backgroundColor: "red" }}
                  ></div>
                </div>
                <span>{riskDistribution.high.toFixed(1)}%</span>
              </div>
            </div>
            {riskDistribution.high > 70 && (
              <div className="warning">
                ⚠️ More than 70% of your portfolio is in high-risk products. Consider diversifying.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function PortfolioItem({ item, onRemove, onUpdateAmount }) {
  const [amount, setAmount] = useState(item.amount);
  return (
    <div className="portfolio-item">
      <h4>{item.product.name}</h4>
      <p>Category: {item.product.category}</p>
      <p>Return: {item.product.expectedReturn}%</p>
      <p>Risk: {item.product.riskLevel}</p>
      <div className="amount-edit">
        <label>Allocated Amount (PKR):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={item.product.minInvestment}
        />
        <button onClick={() => onUpdateAmount(Number(amount))}>Update</button>
      </div>
      <button className="remove-btn" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}

export default Portfolio;