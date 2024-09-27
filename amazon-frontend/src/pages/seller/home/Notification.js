import React from "react";

function Notification({ notifications }) {
  return (
    <div>
      <h4>Notifications</h4>
      <ul>
        {notifications.map((notification) => (
          <li key={notification._id}>
            <p>
              <strong>User:</strong> {notification.user}
            </p>
            <p>
              <strong>Address:</strong> {notification.userAddress}
            </p>
            <p>
              <strong>Product Details:</strong>
              {notification.productDetails ? (
                <ul>
                  {notification.productDetails.map((product, index) => (
                    <li key={index}>
                      <p>{product.title}</p>
                      <p>Quantity: {product.quantity} units</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No product details available</p>
              )}
            </p>
            <p>
              <strong>Message:</strong> {notification.message}
            </p>
            <p>
              <strong>Created At:</strong> {notification.createdAt}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notification;
