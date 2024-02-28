import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
function Admin() {
  const [photographers, setPhotographers] = useState([]);
  const [verifiedPhotographers, setVerifiedPhotographers] = useState([]);
  const [unverifiedPhotographers, setUnverifiedPhotographers] = useState([]);

  useEffect(() => {
    // Fetch photographers from your backend API
    // Make a GET request to your API endpoint to get the list of photographers
    // Update the state with the fetched data
    // Example using Axios:
    axios.get('/photographers')
      .then(response => {
        const allPhotographers = response.data;
        setPhotographers(allPhotographers);
        setVerifiedPhotographers(allPhotographers.filter(photographer => photographer.isVerified));
        setUnverifiedPhotographers(allPhotographers.filter(photographer => !photographer.isVerified));
      })
      .catch(error => {
        // Handle error
        console.error('Error fetching photographers:', error.response);
      });
  }, []);

  // Function to verify/unverify a photographer
  const toggleVerification = (photographerId) => {
    // Make a PUT request to your backend to update the photographer's verification status
    // Example using Axios:
    axios.put(`/api/photographers/${photographerId}/verify`, { isVerified: !photographers.find(p => p._id === photographerId).isVerified })
      .then(response => {
        // Update the state or refetch the data if needed
        // Handle success
        console.log('Photographer verification status updated:', response.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error updating photographer verification status:', error);
      });
  };

  return (
    <div>
        <div className={styles.outer_div}>
      <div style={styles.container}>
        <h3 style={styles.heading}>Verified Photographers</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>portfolio</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {verifiedPhotographers.map(photographer => (
              <tr key={photographer._id}>
                <td>{photographer.name}</td>
                <td>{photographer.email}</td>
                <td>{photographer.contact}</td>
                <td><a href="{photographer.portfolio}">{photographer.portfolio}</a></td>
                <td>{photographer.address}</td>
                <td>
                  <button onClick={() => toggleVerification(photographer._id)} style={styles.button1}>
                    Unverify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.container}>
        <h3 style={styles.heading}>Unverified Photographers</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>portfolio</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unverifiedPhotographers.map(photographer => (
              <tr key={photographer._id}>
                <td>{photographer.name}</td>
                <td>{photographer.email}</td>
                <td>{photographer.contact}</td>
                <td><a href="{photographer.portfolio}">{photographer.portfolio}</a></td>
                <td>{photographer.address}</td>
                <td>
                  <button onClick={() => toggleVerification(photographer._id)} style={styles.button2}>
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to={"/"} style={styles.link}>HOME</Link>
    </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '10px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    border: '1px solid #ddd',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  button1: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',

  },
  button2:{
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'underline',
    color: 'black',
    marginTop: '10px',
    display: 'block',
  },
  outer_div:{
    backgroundColor:'white',
    padding:'5px 10px',
  }
  
};

export default Admin;
