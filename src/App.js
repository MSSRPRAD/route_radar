import Map from './Maps'
import RestaurantList from './PlaceList';
import Navbar from './Navbar';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import PlaceList from './PlaceList';

const apikey = 'lG6eFVH2U5Xv-svYuYp4_M2_uxdn2hYGPI_CLW8Wt8E'
// const userPosition = { lat: 64.1472, lng: -21.9398 }


const emergencyCategoryList =
  [
    { name: "Towing Service", id: '700-7200-0278' },
    { name: "Police Station", id: '700-7300-0111' },
    { name: "Fire Department", id: '700-7300-0113' },
    { name: "Ambulance Services", id: '700-7300-0280' },
    { name: "Healthcare", id: '800-8000-0000' },
    { name: "Hospital", id: '800-8000-0159' },
    { name: "Emergency Room", id: '800-8000-0325' }
  ]


function App() {
  const [placePosition, setPlacePosition] = useState(null);
  const [list, setList] = useState([])
  const [userPosition, setUserPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  const onClickHandler_ = (location) => {
    setPlacePosition(location);
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

  const categoryHandler = (category) => {
    const url = `https://browse.search.hereapi.com/v1/browse?at=${userPosition.lat},${userPosition.lng}&categories=${category}&apiKey=${apikey}`

    axios.get(url, {
      withCredentials: false,
    })
      .then(response => {
        response.data.items.map((item) => {
          setList((prevList) => {
            return [...prevList, {
              name: item.title,
              location: item.position
            }]
          })
        })
      })
  }

  return (
    <div className="App">
      <Navbar list={emergencyCategoryList} categoryHandler={categoryHandler} />
      <PlaceList list={list} onClickHandler={onClickHandler_} />
      <Map apikey={apikey}
        userPosition={userPosition}
        placePosition={placePosition}
        list={list}
      />
    </div>
  );
}

export default App;
