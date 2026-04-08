import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../contexts/UserProfileContext";
import { fetchAndTransformProducts } from "../services/api";

function Recommendations() {
  const navigate = useNavigate();
  const { profile, getRecommendations, isProfileComplete } = useUserProfile();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchAndTransformProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  if (!isProfileComplete()) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>No Profile Found</h2>
        <p>Please create your financial profile first to get recommendations.</p>
        <button className="cta-btn" onClick={() => navigate("/profile")}>
          Create Profile
        </button>
      </div>
    );
  }

  const recommended = getRecommendations(products);

  return (
    <div className="recommendations-page">
      <h2>Your Personalized Recommendations</h2>
      <p>
        Based on your profile: <strong>{profile.riskTolerance}</strong> risk,{" "}
        <strong>{profile.investmentHorizon}</strong> horizon
      </p>
      {recommended.length === 0 ? (
        <p>
          No products match your current profile. Try adjusting your profile settings (e.g., increase
          monthly capacity or change risk tolerance).
        </p>
      ) : (
        <div className="products-grid">
          {recommended.map((product) => (
            <div
              key={product.id}
              className="card"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <h3>{product.name}</h3>
              <span className="category-badge">{product.category}</span>
              <p className="return-value">{product.expectedReturn}% Return</p>
              <p
                style={{
                  color:
                    product.riskLevel === "low"
                      ? "green"
                      : product.riskLevel === "medium"
                      ? "orange"
                      : "red",
                }}
              >
                Risk: {product.riskLevel}
              </p>
              <p>Min: PKR {product.minInvestment.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Recommendations;