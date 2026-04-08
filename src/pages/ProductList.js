import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePortfolio } from "../contexts/PortfolioContext";
import { fetchAndTransformProducts } from "../services/api";

function ProductList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToPortfolio, portfolio } = usePortfolio();
  const [products, setProducts] = useState([]);

  // Filter states
  const [riskFilter, setRiskFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [liquidityFilter, setLiquidityFilter] = useState("all");
  const [timeHorizonFilter, setTimeHorizonFilter] = useState("all");
  const [minReturn, setMinReturn] = useState("");
  const [maxReturn, setMaxReturn] = useState("");
  const [budget, setBudget] = useState(""); // user's max affordable investment

  useEffect(() => {
    fetchAndTransformProducts()
      .then(setProducts)
      .catch((err) => console.error(err));
  }, []);

  // Pre-select category from URL if present
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && !categoryFilter.includes(cat)) {
      setCategoryFilter([cat]);
    }
  }, [searchParams, categoryFilter]);

  const filteredProducts = products.filter((product) => {
    return (
      (riskFilter.length === 0 || riskFilter.includes(product.riskLevel)) &&
      (categoryFilter.length === 0 || categoryFilter.includes(product.category)) &&
      (liquidityFilter === "all" || product.liquidity === liquidityFilter) &&
      (timeHorizonFilter === "all" || product.timeHorizon === timeHorizonFilter) &&
      (minReturn === "" || product.expectedReturn >= parseFloat(minReturn)) &&
      (maxReturn === "" || product.expectedReturn <= parseFloat(maxReturn)) &&
      (budget === "" || product.minInvestment <= parseFloat(budget))
    );
  });

  const handleRiskChange = (value) => {
    setRiskFilter((prev) =>
      prev.includes(value) ? prev.filter((r) => r !== value) : [...prev, value]
    );
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const isInPortfolio = (productId) =>
    portfolio.some((item) => item.product.id === productId);

  return (
    <div className="product-list-page">
      <h2>All Products</h2>
      <div className="page-layout">
        {/* Filters Panel */}
        <div className="filters-panel">
          <h3>Filters</h3>

          <div className="filter-group">
            <h4>Risk Level</h4>
            {["low", "medium", "high"].map((risk) => (
              <label key={risk}>
                <input
                  type="checkbox"
                  checked={riskFilter.includes(risk)}
                  onChange={() => handleRiskChange(risk)}
                />{" "}
                {risk}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            {["savings", "investment", "insurance", "crypto"].map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={categoryFilter.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />{" "}
                {cat}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Liquidity</h4>
            <select onChange={(e) => setLiquidityFilter(e.target.value)} value={liquidityFilter}>
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="locked">Locked</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Time Horizon</h4>
            <select onChange={(e) => setTimeHorizonFilter(e.target.value)} value={timeHorizonFilter}>
              <option value="all">All</option>
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>

          <div className="filter-group">
            <h4>Expected Return (%)</h4>
            <input
              type="number"
              placeholder="Min %"
              value={minReturn}
              onChange={(e) => setMinReturn(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max %"
              value={maxReturn}
              onChange={(e) => setMaxReturn(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <h4>Maximum Affordable Investment</h4>
            <input
              type="number"
              placeholder="Your budget (PKR)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <p className="result-count">{filteredProducts.length} products found</p>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p>No products match your filters. Try adjusting them.</p>
          ) : (
            filteredProducts.map((product) => {
              const inPortfolio = isInPortfolio(product.id);
              return (
                <div key={product.id} className="card">
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
                    Risk: {product.riskLevel}
                  </p>
                  <p>Liquidity: {product.liquidity}</p>
                  <p>Min Investment: PKR {product.minInvestment.toLocaleString()}</p>
                  <div className="card-buttons">
                    <button onClick={() => navigate(`/product/${product.id}`)}>
                      View Details
                    </button>
                    <button
                      onClick={() => addToPortfolio(product)}
                      disabled={inPortfolio}
                      className={inPortfolio ? "added-btn" : "add-btn"}
                    >
                      {inPortfolio ? "Added ✓" : "Add to Portfolio"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;