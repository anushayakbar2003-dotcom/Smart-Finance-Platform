// src/services/api.js
export async function fetchAndTransformProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();

  return data.map((item) => {
    // Map original categories to financial categories
    const categoryMap = {
      electronics: "investment",
      jewelery: "savings",
      "men's clothing": "insurance",
      "women's clothing": "crypto",
    };
    const category = categoryMap[item.category] || "investment";

    // Risk based on category (deterministic)
    const riskMap = {
      savings: "low",
      insurance: "low",
      investment: "medium",
      crypto: "high",
    };
    const riskLevel = riskMap[category];

    // Expected return – realistic ranges
    let expectedReturn = 5; // low default
    if (riskLevel === "medium") expectedReturn = 8 + Math.random() * 5; // 8-13%
    if (riskLevel === "high") expectedReturn = 15 + Math.random() * 12; // 15-27%
    expectedReturn = parseFloat(expectedReturn.toFixed(1));

    // Min investment – scale price to meaningful PKR values
    const minInvestment = Math.max(1000, Math.round(item.price * 2000));

    // Liquidity – based on category + risk
    let liquidity = "moderate";
    if (category === "savings") liquidity = "easy";
    if (category === "crypto") liquidity = "easy";
    if (category === "insurance") liquidity = "locked";
    if (category === "investment" && riskLevel === "low") liquidity = "easy";

    // Time horizon – based on risk and category
    let timeHorizon = "medium";
    if (riskLevel === "low") timeHorizon = "short";
    if (riskLevel === "high") timeHorizon = "long";
    if (category === "insurance") timeHorizon = "long";
    if (category === "crypto") timeHorizon = "long";

    return {
      id: String(item.id),
      name: item.title.length > 40 ? item.title.slice(0, 40) + "..." : item.title,
      description: item.description.slice(0, 200),
      category,
      expectedReturn,
      riskLevel,
      liquidity,
      timeHorizon,
      minInvestment,
      image: item.image,
    };
  });
}