// components/RazorpayButton.tsx
import { useEffect } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayButton = () => {
  const loadRazorpayScript = () => {
    return new Promise<void>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    await loadRazorpayScript();

    const options = {
      key: "rzp_test_V34kkTd9Flgwg0", // Replace with your test Key ID
      amount: 50000, // Amount in paisa = ₹500
      currency: "INR",
      name: "EV Charging Station",
      description: "Test Transaction",
      handler: (response: any) => {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Your User",
        email: "user@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Test address",
      },
      theme: {
        color: "#0f172a",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={openRazorpay}
    >
      Pay ₹500
    </button>
  );
};

export default RazorpayButton;
