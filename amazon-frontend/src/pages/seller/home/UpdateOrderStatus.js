import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";

function UpdateOrderStatus({ orderId }) {
  const [status, setStatus] = useState("");
  const token = localStorage.getItem("token");
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const updateStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/sellers/order-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: status }),
        }
      );

      if (response.ok) {
        // Handle successful update, e.g., show a success message
        console.log("Order status updated successfully");
        window.location.reload();
      } else {
        // Handle error, e.g., show an error message
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status", error);
    }
  };

  return (
    <div>
      <Form.Group>
        <Form.Control
          type="text"
          placeholder="Enter new status"
          value={status}
          onChange={handleStatusChange}
        />
      </Form.Group>
      <Button onClick={updateStatus} variant="primary">
        Update Status
      </Button>
    </div>
  );
}

export default UpdateOrderStatus;
