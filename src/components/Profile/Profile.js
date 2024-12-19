import React, { useState, useEffect } from 'react';
import { useAuth } from '../SignUp/useAuth';
import { db } from '../../firebaseConfig'; // Import Firestore
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBriefcase, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [newTag, setNewTag] = useState('Home');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    if (user) {
      fetchAddresses();
      fetchOrderHistory();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (user && user.uid) {
      const addressesCollection = collection(db, 'users', user.uid, 'addresses');
      const addressesSnapshot = await getDocs(addressesCollection);
      const addressesList = addressesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAddresses(addressesList);
    }
  };

  const fetchOrderHistory = async () => {
    if (user && user.uid) {
      const ordersCollection = collection(db, 'users', user.uid, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrderHistory(ordersList);
    }
  };

  const addAddress = async () => {
    if (newTag && newAddress && user && user.uid) {
      const addressesCollection = collection(db, 'users', user.uid, 'addresses');
      await addDoc(addressesCollection, { tag: newTag, address: newAddress });
      fetchAddresses();
      setNewTag('Home');
      setNewAddress('');
    }
  };

  return (
    <div className="profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <h3>Account Information</h3>
        <p>Email: {user?.email}</p>
        <p>Name: {user?.name}</p>
      </div>
      <div className="profile-addresses">
        <h3>Addresses</h3>
        <ul>
          {addresses.map(address => (
            <li key={address.id}>
              <strong>{address.tag}:</strong> {address.address}
            </li>
          ))}
        </ul>
        <div className="address-input">
          <select value={newTag} onChange={(e) => setNewTag(e.target.value)}>
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Address"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button onClick={addAddress}>Add Address</button>
        </div>
      </div>
      <div className="profile-orders">
        <h3>Order History</h3>
        <ul>
          {orderHistory.map(order => (
            <li key={order.id}>
              <strong>Date:</strong> {order.date}
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
