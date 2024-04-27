import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Enum for Itinerary Type
const ItineraryType = {
  ONE_WAY: 'ONE_WAY',
  ROUND_TRIP: 'ROUND_TRIP',
};

// Enum for Sort Order
const SortOrder = {
  PRICE: 'PRICE',
  DURATION: 'DURATION',
};


// Enum for Class of Service
const ClassOfService = {
  ECONOMY: 'ECONOMY',
  BUSINESS: 'BUSINESS',
};

// Enum for API Key
const ApiKey = {
  YOUR_API_KEY_1: '919d8df4e0msh343320fea8221a3p1e7733jsn4f7c69f0b2a7',
  // Add more valid API keys here
};

function App() {
  const [sourceAirportCode, setSourceAirportCode] = useState('');
  const [destinationAirportCode, setDestinationAirportCode] = useState('');
  const [date, setDate] = useState('');
  const [sortOrder, setSortOrder] = useState(SortOrder.PRICE); // Default to PRICE
  const [classOfService, setClassOfService] = useState(ClassOfService.ECONOMY); // Default to ECONOMY
  const [flightResults, setFlightResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numAdults, setNumAdults] = useState(1); // Default to 1 adult


  const tripAdvisorApiKey = ApiKey.YOUR_API_KEY_1; // Default API key

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights', {
        params: {
          sourceAirportCode,
          destinationAirportCode,
          date,
          itineraryType: ItineraryType.ONE_WAY,
          sortOrder,
          numAdults: 1,
          numSeniors: 0,
          classOfService,
          pageNumber: 1,
          currencyCode: 'INR',
        },
        headers: {
          'X-RapidAPI-Key': tripAdvisorApiKey,
          'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com',
        },
      });

      setFlightResults(response.data.data.flights);
    } catch (error) {
      console.error(error);
      setError(error.message || 'An error occurred while fetching flights.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Optionally, fetch initial flight results based on default values (if any)
    // This can be done here if there are default values for any of the search parameters
  }, []);

  return (
    <div className="App">
      <h1>FLIGHT SEARCH</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="sourceAirportCode">Source Airport Code:</label>
          <input
            type="text"
            id="sourceAirportCode"
            value={sourceAirportCode}
            onChange={(e) => setSourceAirportCode(e.target.value)}
            required
          />
        </div>
        <div>
  <label htmlFor="numAdults">Number of Adults:</label>
  <input
    type="number"
    id="numAdults"
    value={numAdults}
    onChange={(e) => setNumAdults(e.target.value)}
    min={1}
    required
  />
</div>

        <div>
          <label htmlFor="destinationAirportCode">Destination Airport Code:</label>
          <input
            type="text"
            id="destinationAirportCode"
            value={destinationAirportCode}
            onChange={(e) => setDestinationAirportCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date">Date (YYYY-MM-DD):</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="sortOrder">Sort Order:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value={SortOrder.PRICE}>Price</option>
            <option value={SortOrder.DURATION}>Duration</option>
          </select>
        </div>
        <div>
          <label htmlFor="classOfService">Class of Service:</label>
          <select
            id="classOfService"
            value={classOfService}
            onChange={(e) => setClassOfService(e.target.value)}
          >
            <option value={ClassOfService.ECONOMY}>Economy</option>
            <option value={ClassOfService.BUSINESS}>Business</option>
          </select>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {flightResults.length > 0 ? (
          <div>
            <h2>Flight Results</h2>
            <ul>
              {flightResults.map((flight, index) => (
                <li key={index}>
                  <p>Airline: {flight.segments[0].legs[0].marketingCarrier.displayName}</p>
                  <p>Departure: {flight.segments[0].legs[0].originStationCode}</p>
                  <p>Destination: {flight.segments[0].legs[0].destinationStationCode}</p>
                  <p>Departure Time: {flight.segments[0].legs[0].departureDateTime}</p>
                  <p>Arrival Time: {flight.segments[0].legs[0].arrivalDateTime}</p>
                  <p>Flight Number: {flight.segments[0].legs[0].flightNumber}</p>

                  {flight.purchaseLinks?.length > 0 && (
                    <div>
                      <h3>Purchase Options:</h3>
                      <ul>
                        {flight.purchaseLinks.map((purchaseLink, linkIndex) => (
                          <li key={linkIndex}>
                            <a href={purchaseLink?.url} target="_blank" rel="noopener noreferrer">
                             {purchaseLink?.providerId} 
                            </a>
                            <br></br>
                            PRICE: {purchaseLink?.totalPrice} INR
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Add more flight details here based on API response */}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No flight results yet. Please perform a search.</p>
        )}
      </div>
    </div>
  );
}

export default App;

