import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePortfolio } from "../contexts/PortfolioContext";
import { fetchAndTransformProducts } from "../services/api";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToPortfolio, portfolio } = usePortfolio();
  const [products, setProducts] = useState([]);
  const [investment, setInvestment] = useState("");
  const [years, setYears] = useState(1);
  const [projectedReturn, setProjectedReturn] = useState(null);
  const [compareId, setCompareId] = useState("");

  useEffect(() => {
    fetchAndTransformProducts()
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  const product = products.find((p) => p.id === id);
  const compareProduct = products.find((p) => p.id === compareId);

  if (!product) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Product not found!</h2>
        <button onClick={() => navigate("/products")}>Back to Products</button>
      </div>
    );
  }

  const generateDecisionInsight = (p) => {
    const insights = [];
    if (p.riskLevel === "low")
      insights.push("Suitable for conservative investors prioritizing capital preservation.");
    else if (p.riskLevel === "medium")
      insights.push("Suitable for moderate-risk investors seeking balanced growth.");
    else insights.push("Best for aggressive investors comfortable with significant volatility.");

    if (p.liquidity === "locked")
      insights.push("Requires commitment; early withdrawal may incur penalties.");
    else if (p.liquidity === "easy")
      insights.push("Funds can be accessed quickly if needed.");

    if (p.timeHorizon === "long")
      insights.push("Optimal when held for 5+ years to maximize returns.");
    else if (p.timeHorizon === "short")
      insights.push("Good for short-term goals within 1-2 years.");

    return insights.join(" ");
  };

  const calculateReturn = () => {
    if (!investment || isNaN(investment) || investment <= 0) {
      setProjectedReturn("Please enter a valid amount.");
      return;
    }
    const amount = parseFloat(investment);
    const rate = product.expectedReturn / 100;
    const earned = amount * rate * years;
    const total = amount + earned;
    setProjectedReturn({ earned: earned.toFixed(2), total: total.toFixed(2) });
  };

  const alreadyAdded = portfolio.some((item) => item.product.id === product.id);
  const riskWidth =
    product.riskLevel === "low" ? "30%" : product.riskLevel === "medium" ? "60%" : "100%";
  const riskColor =
    product.riskLevel === "low" ? "green" : product.riskLevel === "medium" ? "orange" : "red";

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate("/products")}>
        ← Back
      </button>
      <h2>{product.name}</h2>
      <span className="category-badge">{product.category}</span>
      <div className="detail-grid">
        <div>
          <strong>Expected Return:</strong> {product.expectedReturn}%
        </div>
        <div>
          <strong>Liquidity:</strong> {product.liquidity}
        </div>
        <div>
          <strong>Time Horizon:</strong> {product.timeHorizon}
        </div>
        <div>
          <strong>Min Investment:</strong> PKR {product.minInvestment.toLocaleString()}
        </div>
      </div>
      <p>{product.description}</p>
      <h3>Risk Level</h3>
      <div className="risk-bar-bg">
        <div
          className="risk-bar-fill"
          style={{ width: riskWidth, backgroundColor: riskColor }}
        ></div>
      </div>
      <p style={{ color: riskColor }}>{product.riskLevel.toUpperCase()}</p>
      <h3>Who is this for?</h3>
      <p className="insight-box">{generateDecisionInsight(product)}</p>
      <h3>Return Projection Calculator</h3>
      <div className="calculator">
        <input
          type="number"
          placeholder="Enter amount (PKR)"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
        />
        <label>
          Years:
          <select value={years} onChange={(e) => setYears(Number(e.target.value))}>
            <option value={1}>1 year</option>
            <option value={3}>3 years</option>
            <option value={5}>5 years</option>
            <option value={10}>10 years</option>
          </select>
        </label>
        <button onClick={calculateReturn}>Calculate</button>
      </div>
      {projectedReturn && typeof projectedReturn === "object" && (
        <div className="projection-result">
          <p>Return Earned: PKR {projectedReturn.earned}</p>
          <p>Total Value: PKR {projectedReturn.total}</p>
        </div>
      )}
      {typeof projectedReturn === "string" && <p>{projectedReturn}</p>}
      <button
        className={alreadyAdded ? "added-btn" : "add-btn"}
        onClick={() => addToPortfolio(product)}
        disabled={alreadyAdded}
      >
        {alreadyAdded ? "Already in Portfolio ✓" : "Add to Portfolio"}
      </button>
      <h3>Compare with Another Product</h3>
      <select value={compareId} onChange={(e) => setCompareId(e.target.value)}>
        <option value="">Select a product to compare</option>
        {products
          .filter((p) => p.id !== product.id)
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
      </select>
      {compareProduct && (
        <div className="compare-grid">
          <div className="compare-card">
            <h4>{product.name} (Current)</h4>
            <p>Return: {product.expectedReturn}%</p>
            <p>Risk: {product.riskLevel}</p>
            <p>Liquidity: {product.liquidity}</p>
            <p>Min: PKR {product.minInvestment.toLocaleString()}</p>
          </div>
          <div className="compare-card">
            <h4>{compareProduct.name}</h4>
            <p>Return: {compareProduct.expectedReturn}%</p>
            <p>Risk: {compareProduct.riskLevel}</p>
            <p>Liquidity: {compareProduct.liquidity}</p>
            <p>Min: PKR {compareProduct.minInvestment.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;