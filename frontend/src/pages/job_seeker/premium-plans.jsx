import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/navbar";

const Premium = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/premium/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsPremium(res.data.premium);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyPremium = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8080/premium/create-order",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { key, order } = res.data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "JobMatch Premium",
        description: "Premium Membership",
        order_id: order.id,

        handler: async function (response) {
          await verifyPayment(response);
        },

        prefill: {
          name: user?.name,
          email: user?.email,
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      setMessage("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/premium/verify",
        {
          razorpayOrderId: paymentResponse.razorpay_order_id,
          razorpayPaymentId: paymentResponse.razorpay_payment_id,
          razorpaySignature: paymentResponse.razorpay_signature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Premium Activated Successfully 🎉");
      setIsPremium(true);

      setTimeout(checkPremiumStatus, 1000);
    } catch (err) {
      console.error(err);
      setMessage("Payment verification failed.");
    }
  };

  return (
    <div className="premium-container">
      <Navbar />

      <div className="premium-card">

        <div className="premium-badge">
          ⭐ PREMIUM MEMBERSHIP
        </div>

        <h1>Unlock Premium</h1>

        <p className="premium-subtitle">
          Get priority visibility, AI-powered job matching and exclusive
          premium benefits.
        </p>

        <div className="premium-price">
          ₹499
          <span>/30 Days</span>
        </div>

        {isPremium && (
          <div className="premium-active">
            ✅ Your Premium Membership is Active
          </div>
        )}

        {message && <div className="message">{message}</div>}

        <ul className="premium-features">
          <li>✅ Resume Parsing with AI</li>
          <li>✅ Matched Jobs every 4 Days via Email</li>
          <li>✅ Priority in Recruiter Search</li>
          <li>✅ Featured Candidate Profile</li>
          <li>✅ Faster Job Recommendations</li>
          <li>✅ Early Access to New Jobs</li>
        </ul>

        <button
          className="buy-btn"
          disabled={loading || isPremium}
          onClick={handleBuyPremium}
        >
          {isPremium
            ? "Premium Active"
            : loading
            ? "Processing..."
            : "Upgrade to Premium"}
        </button>

      </div>
    </div>
  );
};

export default Premium;