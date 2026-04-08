import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "../contexts/UserProfileContext";
import { fetchAndTransformProducts } from "../services/api";

function UserProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile, getRecommendations } = useUserProfile();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(
    profile || {
      riskTolerance: "",
      investmentHorizon: "",
      monthlyCapacity: "",
      liquidityPreference: "",
      investmentGoal: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchAndTransformProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.riskTolerance) newErrors.riskTolerance = "Required";
    if (!form.investmentHorizon) newErrors.investmentHorizon = "Required";
    if (!form.monthlyCapacity || form.monthlyCapacity < 1000)
      newErrors.monthlyCapacity = "Minimum PKR 1,000";
    if (!form.liquidityPreference) newErrors.liquidityPreference = "Required";
    if (!form.investmentGoal) newErrors.investmentGoal = "Required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    updateProfile({ ...form, monthlyCapacity: Number(form.monthlyCapacity) });
    setSaved(true);
  };

  const matchCount = profile ? getRecommendations(products).length : 0;

  return (
    <div className="profile-page">
      <h2>My Financial Profile</h2>
      {saved && (
        <div className="success-msg">
          ✅ Profile saved! {matchCount} products match your profile.
          <button onClick={() => navigate("/recommendations")}>View Recommendations</button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Risk Tolerance</label>
          <select name="riskTolerance" value={form.riskTolerance} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="conservative">Conservative (Low risk)</option>
            <option value="moderate">Moderate (Medium risk)</option>
            <option value="aggressive">Aggressive (High risk)</option>
          </select>
          {errors.riskTolerance && <span className="error">{errors.riskTolerance}</span>}
        </div>
        <div className="form-group">
          <label>Investment Horizon</label>
          <select name="investmentHorizon" value={form.investmentHorizon} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="short">Short (1-2 years)</option>
            <option value="medium">Medium (3-5 years)</option>
            <option value="long">Long (5+ years)</option>
          </select>
          {errors.investmentHorizon && <span className="error">{errors.investmentHorizon}</span>}
        </div>
        <div className="form-group">
          <label>Monthly Investment Capacity (PKR)</label>
          <input
            type="number"
            name="monthlyCapacity"
            value={form.monthlyCapacity}
            onChange={handleChange}
            placeholder="e.g., 25000"
            min="1000"
          />
          {errors.monthlyCapacity && <span className="error">{errors.monthlyCapacity}</span>}
        </div>
        <div className="form-group">
          <label>Liquidity Preference</label>
          <select name="liquidityPreference" value={form.liquidityPreference} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="easy">Need quick access</option>
            <option value="moderate">Some flexibility</option>
            <option value="locked">Can lock funds</option>
          </select>
          {errors.liquidityPreference && <span className="error">{errors.liquidityPreference}</span>}
        </div>
        <div className="form-group">
          <label>Investment Goal</label>
          <select name="investmentGoal" value={form.investmentGoal} onChange={handleChange}>
            <option value="">-- Select --</option>
            <option value="wealth">Wealth Building</option>
            <option value="retirement">Retirement</option>
            <option value="emergency">Emergency Fund</option>
            <option value="purchase">Specific Purchase</option>
          </select>
          {errors.investmentGoal && <span className="error">{errors.investmentGoal}</span>}
        </div>
        <button type="submit" className="cta-btn">
          Save Profile
        </button>
      </form>
      {profile && (
        <div className="profile-summary">
          <h3>Current Profile</h3>
          <p>Risk Tolerance: {profile.riskTolerance}</p>
          <p>Investment Horizon: {profile.investmentHorizon}</p>
          <p>Monthly Capacity: PKR {profile.monthlyCapacity.toLocaleString()}</p>
          <p>Liquidity Preference: {profile.liquidityPreference}</p>
          <p>Goal: {profile.investmentGoal}</p>
          <p>Matching Products: {matchCount}</p>
        </div>
      )}
    </div>
  );
}

export default UserProfile;