import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../SignUp/useAuth';
import { db } from '../../firebaseConfig';
import { collection, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [orderHistory, setOrderHistory] = useState([]);
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month

  const fetchOrderHistory = useCallback(async () => {
    if (user && user.uid) {
      const ordersCollection = collection(db, 'orders');
      const q = query(ordersCollection, where('userId', '==', user.uid), orderBy('date', 'desc'));
      const ordersSnapshot = await getDocs(q);
      const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrderHistory(ordersList);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrderHistory();
    }
  }, [user, fetchOrderHistory]);

  const updatePhone = async () => {
    if (phone && user && user.uid) {
      const userDoc = doc(db, 'users', user.uid);
      await updateDoc(userDoc, { phone });
      setUser(prevUser => ({ ...prevUser, phone }));
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
  };

  const filteredOrders = orderHistory.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate.getMonth() + 1 === selectedMonth;
  });

  return (
    <div className="profile">
      <h2>User Profile</h2>
      <div className="profile-info">
        <h3>Account Information</h3>
        <p>Email: {user?.email}</p>
        <p>Name: {user?.name}</p>
        <p>Phone: {user?.phone}</p>
        {!user?.phone && (
          <>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={updatePhone}>Update Phone</button>
          </>
        )}
      </div>
      <div className="profile-orders">
        <h3>Order History</h3>
        <div className="month-filter">
          <label htmlFor="month">Select Month: </label>
          <select id="month" value={selectedMonth} onChange={handleMonthChange}>
            {[...Array(12).keys()].map(month => (
              <option key={month + 1} value={month + 1}>
                {new Date(0, month).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <ul className="order-list">
          {filteredOrders.map(order => (
            <li key={order.id} className="order-item">
              <div className="order-header">
                <div className="order-info">
                  <strong>Order ID:</strong> {order.orderId}
                  <ul className="order-items">
                    {order.items.map((item, index) => (
                      <li key={index}>{item.name} - {item.quantity} x ${item.price.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
                <div className="order-meta">
                  <span className="order-date">{new Date(order.date).toLocaleString()}</span>
                  <span className={`order-status ${order.status ? order.status.toLowerCase() : ''}`}>{order.status}</span>
                  <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
