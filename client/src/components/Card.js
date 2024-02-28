import { useEffect, useState } from 'react';
import axios from 'axios';
import './Card.css';
import { useNavigate } from 'react-router-dom';
import { truncate } from 'lodash';
import Navbar3 from './Navbar3';

function Card() {
  const navigate = useNavigate();
  const [profileCards, setProfileCards] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/allcards')
      .then((response) => {
        setProfileCards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching profile cards:', error);
      });
  }, []);

  const handleCardClick = (id) => {
    navigate(`/desc/${id}`);
  };

  return (
    <div> 
      <Navbar3/>
    <div className="r-cards-container mt-6 mx-6 ">
     
      {profileCards.map((profile) => (
        <div className="r-card" key={profile._id} onClick={() => handleCardClick(profile._id)}>
          <div className="profile-card">
            <img src={`http://localhost:4000/${profile.photos[0]}`} alt="Profile" />
            <div className="profile-details">
              <h2 className="primaryText">{profile.title}</h2>
              <span className="secondaryText">{truncate(profile.description, { length: 80 })}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Card;
