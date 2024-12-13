import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Location () {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [locationStatement, setLocationStatement] = useState('');

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://crio-location-selector.onrender.com/countries');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries: ', error);
            }
        };
        fetchCountries();
    }, []);

    const handleCountryChange = async (e) => {
        const countryName = e.target.value;
        setSelectedCountry(countryName);
        setSelectedState('');
        setSelectedCity('');
        setLocationStatement('');

        try {
            const response = await axios.get(`https://crio-location-selector.onrender.com/states?country=${countryName}`);
            setStates(response.data);
            setCities([]);
        } catch (error) {
            console.error(`Error fetching states for ${countryName}: `, error);
        }
    };

    const handleStateChange = async (e) => {
        const stateName = e.target.value;
        setSelectedState(stateName);
        setSelectedCity('');
        setLocationStatement('');

        try {
            const response = await axios.get(`https://crio-location-selector.onrender.com/cities?country=${selectedCountry}&state=${stateName}`);
            setCities(response.data);
        } catch (error) {
            console.error(`Error fetching cities for ${selectedCountry}, ${stateName}: `, error);
        }
    };

    const handleCityChange = (e) => {
        const cityName = e.target.value;
        setSelectedCity(cityName);
        setLocationStatement(`You selected ${cityName}, ${selectedState}, ${selectedCountry}`);
    };

    return (
        <div>
          <h2>Select Location</h2>
          <form>
            <select
              id="countrySelect"
              value={selectedCountry}
              onChange={handleCountryChange}
              style={{ padding: '8px', marginRight: '8px' }}>
              <option value="">Select Country</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
    
            <select
              id="stateSelect"
              value={selectedState}
              onChange={handleStateChange}
              disabled={!selectedCountry}
              style={{ padding: '8px', marginRight: '8px' }}>
              <option value="">Select State</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
    
            <select
              id="citySelect"
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedState}
              style={{ padding: '8px', marginRight: '8px' }}>
              <option value="">Select City</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </form>
    
          {selectedCity && (
            <h3>{locationStatement}</h3>
          )}
        </div>
    );
}

export default Location;
