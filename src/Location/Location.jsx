import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Location.module.css";

const Location = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (url, setData, resetData = []) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(url);
      setData(response.data);
      if (resetData.length > 0) resetData.forEach((fn) => fn([]));
    } catch (err) {
      setError("An error occurred while fetching data. Please try again.");
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(
      "https://crio-location-selector.onrender.com/countries",
      setCountries
    );
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchData(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`,
        setStates,
        [() => setCities([]), () => setSelectedState(""), () => setSelectedCity("")]
      );
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetchData(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`,
        setCities,
        [() => setSelectedCity("")]
      );
    }
  }, [selectedCountry, selectedState]);

  return (
    <div className={styles["city-selector"]}>
      <h1>Select Location</h1>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.dropdowns}>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          disabled={!selectedCountry}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
          className={styles.dropdown}
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      {selectedCity && (
        <h2 className={styles.result}>
          You selected <span className={styles.highlight}>{selectedCity}</span>,
          <span className={styles.fade}>
            {" "}
            {selectedState}, {selectedCountry}
          </span>
        </h2>
      )}
    </div>
  );
};

export default Location;
