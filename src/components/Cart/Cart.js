import React from 'react';
import './Cart.css';

const Cart = ({ cart, cartHandler }) => {
  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cart.map(item => (
            <li key={item.id}>
              <div>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => cartHandler(item)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;
