import React, { createContext, useState, useContext, useEffect } from "react";

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  function updateProfile(newProfile) {
    setProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  }

  function isProfileComplete() {
    if (!profile) return false;
    return (
      profile.riskTolerance &&
      profile.investmentHorizon &&
      profile.monthlyCapacity > 0 &&
      profile.liquidityPreference &&
      profile.investmentGoal
    );
  }

  function getRecommendations(products) {
    if (!isProfileComplete()) return [];

    const riskMapping = {
      conservative: ["low"],
      moderate: ["low", "medium"],
      aggressive: ["low", "medium", "high"],
    };
    const horizonMapping = {
      short: ["short"],
      medium: ["short", "medium"],
      long: ["short", "medium", "long"],
    };
    const liquidityMapping = {
      easy: ["easy"],
      moderate: ["easy", "moderate"],
      locked: ["easy", "moderate", "locked"],
    };

    const allowedRisk = riskMapping[profile.riskTolerance] || ["low"];
    const allowedHorizon = horizonMapping[profile.investmentHorizon] || ["short"];
    const allowedLiquidity = liquidityMapping[profile.liquidityPreference] || ["easy"];

    const recommended = products.filter(
      (p) =>
        p.minInvestment <= profile.monthlyCapacity &&
        allowedRisk.includes(p.riskLevel) &&
        allowedHorizon.includes(p.timeHorizon) &&
        allowedLiquidity.includes(p.liquidity)
    );

    if (profile.riskTolerance === "conservative") {
      return recommended.sort((a, b) => a.expectedReturn - b.expectedReturn);
    } else {
      return recommended.sort((a, b) => b.expectedReturn - a.expectedReturn);
    }
  }

  return (
    <UserProfileContext.Provider
      value={{ profile, updateProfile, isProfileComplete, getRecommendations }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}