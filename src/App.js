import Map from './Maps'
import RestaurantList from './RestaurantList';
import React, { useEffect, useState } from 'react';

import './App.css';

const apikey = 'lG6eFVH2U5Xv-svYuYp4_M2_uxdn2hYGPI_CLW8Wt8E'
// const userPosition = { lat: 64.1472, lng: -21.9398 }

const restaurantList = [
  {
    name: "The Fish Market",
    location: { lat: 64.1508, lng: -21.9536 },
  },
  {
    name: "Bæjarins Beztu Pylsur",
    location: { lat: 64.1502, lng: -21.9519 },
  },
  {
    name: "Grillmarkadurinn",
    location: { lat: 64.1475, lng: -21.9347 },
  },
  {
    name: "Kol Restaurant",
    location: { lat: 64.1494, lng: -21.9337 },
  },
];


function App() {
  const [restaurantPosition, setRestaurantPosition] = useState(null);
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);


  const onClickHandler_ = (location) => {
    setRestaurantPosition(location);
  }

  // useEffect
  useEffect(
    () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserPosition(
              {
                lat: parseFloat(position.coords.latitude),
                lng: parseFloat(position.coords.longitude)
              }
            );
            console.log(userPosition);
            setLoading(false);
          },
          (error) => {
            console.error(error);
            setLoading(false);
          }
        );
      } else {
        setLoading(false);
        console.error('Geolocation is not supported by this browser!');
      }
    }, []
  );

  if (loading) {
    return <div>Loading (Fetching User Location).....</div>
  }

  return (
    <div className="App">
      <RestaurantList list={restaurantList} onClickHandler={onClickHandler_} />
      <Map apikey={apikey}
        userPosition={userPosition}
        restaurantPosition={restaurantPosition}
      />
    </div>
  );
}

export default App;
