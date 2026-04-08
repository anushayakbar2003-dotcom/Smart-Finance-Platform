import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAndTransformProducts } from "../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAndTransformProducts()
      .then(setProducts)
      .catch((err) => console.error("Failed to load products", err));
  }, []);

  // Featured: highest return in each category
  const categories = ["savings", "investment", "insurance", "crypto"];
  const featured = categories
    .map((cat) => {
      const catProducts = products.filter((p) => p.category === cat);
      if (catProducts.length === 0) return null;
      return catProducts.reduce((best, curr) =>
        curr.expectedReturn > best.expectedReturn ? curr : best
      );
    })
    .filter(Boolean);

  return (
    <div className="home">
      <h1>💰 Smart Finance Platform</h1>
      <p>
        Discover financial products tailored to your goals, risk tolerance, and investment horizon.
        From savings to crypto find what fits you.
      </p>

      <h2>Featured Products</h2>
      <div className="products-grid">
        {featured.map((product) => (
          <div
            key={product.id}
            className="card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <h3>{product.name}</h3>
            <span className="category-badge">{product.category}</span>
            <p className="return-value">{product.expectedReturn}% Return</p>
            <p
              className="risk-label"
              style={{
                color:
                  product.riskLevel === "low"
                    ? "green"
                    : product.riskLevel === "medium"
                    ? "orange"
                    : "red",
              }}
            >
              {product.riskLevel} Risk
            </p>
          </div>
        ))}
      </div>

      <h2>Browse by Category</h2>
      <div className="categories">
        <button onClick={() => navigate("/products?category=savings")}>💳 Savings</button>
        <button onClick={() => navigate("/products?category=investment")}>📈 Investment</button>
        <button onClick={() => navigate("/products?category=insurance")}>🛡️ Insurance</button>
        <button onClick={() => navigate("/products?category=crypto")}>₿ Crypto</button>
      </div>

      <div className="cta-section">
        <h2>Get Personalized Recommendations</h2>
        <p>Tell us your goals and we'll match you with the right products.</p>
        <button className="cta-btn" onClick={() => navigate("/profile")}>
          Create My Financial Profile →
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <h3>{products.length}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>4</h3>
          <p>Categories</p>
        </div>
        <div className="stat-card">
          <h3>100%</h3>
          <p>Free to Use</p>
        </div>
      </div>
    </div>
  );
}

export default Home;