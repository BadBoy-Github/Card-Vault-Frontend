import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiQrcode,
  HiCheck,
  HiX,
  HiClock,
  HiArrowRight,
  HiPhone,
  HiClipboard,
} from "react-icons/hi";
import QRCode from "qrcode";

const API_URL =
  import.meta.env.VITE_API_URL || "https://card-vault-backend.vercel.app/api";

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef(null);

  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(null);
  const [qrError, setQrError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!amount) {
      navigate("/");
      return;
    }

    // If orderId exists, fetch the order
    if (orderId) {
      fetchOrder();
    } else {
      // No orderId - this is a new order flow
      setLoading(false);
    }
    fetchPaymentConfig();
  }, [user, orderId, amount, navigate]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
        // If already submitted, show status
        if (data.paymentStatus === "awaiting_verification") {
          setMessage({
            type: "info",
            text: "UTR submitted. Waiting for verification.",
          });
        } else if (data.paymentStatus === "verified") {
          setMessage({
            type: "success",
            text: "Payment verified! Order is being processed.",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching order:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/payment/config`);
      const data = await res.json();
      if (res.ok) {
        setPaymentConfig(data);
      }
    } catch (err) {
      console.error("Error fetching payment config:", err);
      setMessage({
        type: "error",
        text: "Unable to load payment details. Please refresh.",
      });
    }
  };

  // Generate UPI QR Code
  useEffect(() => {
    if (!paymentConfig || !amount) return;
    if (qrGenerated) return;

    // Wait for component to mount and canvas to be available
    const timer = setTimeout(() => {
      if (!canvasRef.current) {
        console.error("Canvas ref not available - will retry");
        return; // Just return, don't set error - the canvas will appear
      }

      const generateQR = async () => {
        // Use config values from backend (UPI_ID from backend .env)
        const upiId = paymentConfig.upiId;
        const merchantName = paymentConfig.merchantName || "CardVault";

        if (!upiId) {
          console.error("No UPI ID configured");
          setQrError(true);
          return;
        }

        // Create UPI payment URL with all required parameters
        const transactionNote = orderId ? `Order_${orderId}` : `NewOrder`;
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=${encodeURIComponent(transactionNote)}&cu=INR`;

        console.log("Generating QR for UPI URL:", upiUrl);

        try {
          // Generate QR as data URL first
          const dataUrl = await QRCode.toDataURL(upiUrl, {
            width: 250,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#ffffff",
            },
          });

          // Load image and draw to canvas
          const ctx = canvasRef.current.getContext("2d");
          canvasRef.current.width = 250;
          canvasRef.current.height = 250;

          const img = new Image();
          img.onload = () => {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, 250, 250);
            ctx.drawImage(img, 0, 0, 250, 250);
            setQrGenerated(true);
            console.log("QR code generated successfully");
          };
          img.onerror = () => {
            console.error("Failed to load QR image");
            setQrError(true);
          };
          img.src = dataUrl;
        } catch (err) {
          console.error("QR generation error:", err);
          setQrError(true);
        }
      };

      generateQR();
    }, 100); // Small delay to ensure canvas is mounted

    return () => clearTimeout(timer);
  }, [paymentConfig, orderId, amount, qrGenerated]);

  const handleSubmitUTR = async (e) => {
    e.preventDefault();

    if (!utrNumber.trim()) {
      setMessage({
        type: "error",
        text: "Please enter the UTR/Transaction ID",
      });
      return;
    }

    // Validate UTR format (12-16 digits)
    const utrRegex = /^\d{12,16}$/;
    if (!utrRegex.test(utrNumber.trim())) {
      setMessage({
        type: "error",
        text: "UTR must be 12-16 digits",
      });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      // If no orderId, create order first
      if (!orderId) {
        const pendingOrderData = sessionStorage.getItem("pendingOrder");

        // Create order with UTR - stock will be reduced in backend
        const createRes = await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...(pendingOrderData
              ? JSON.parse(pendingOrderData)
              : { orderItems: [], totalPrice: parseFloat(amount) }),
            utrNumber: utrNumber.trim(),
            paymentAmount: parseFloat(amount),
            paymentStatus: "awaiting_verification",
          }),
        });

        const createdOrder = await createRes.json();

        if (createRes.ok) {
          sessionStorage.removeItem("pendingOrder");
          setMessage({
            type: "success",
            text: "UTR submitted successfully! Redirecting to orders...",
          });
          setOrder(createdOrder);
          setTimeout(() => {
            navigate("/orders");
          }, 1500);
        } else {
          setMessage({
            type: "error",
            text: createdOrder.message || "Failed to create order",
          });
        }
        setSubmitting(false);
        return;
      }

      // Original flow - submit UTR for existing order
      const res = await fetch(`${API_URL}/orders/${orderId}/submit-utr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          utrNumber: utrNumber.trim(),
          paymentAmount: parseFloat(amount),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "UTR submitted successfully! Redirecting to orders...",
        });
        setOrder(data);
        // Redirect to orders page after successful submission
        setTimeout(() => {
          navigate("/orders");
        }, 1500);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to submit UTR",
        });
      }
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
      </div>
    );
  }

  // If payment is already verified, show success
  if (order?.paymentStatus === "verified") {
    return (
      <div className="container-wide flex flex-col py-6 sm:py-8 mt-20">
        <div className="glass-panel mx-auto flex w-full max-w-lg flex-col items-center justify-center rounded-[40px] p-8 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
            <HiCheck className="text-4xl text-green-500" />
          </div>
          <h1 className="apple-display mb-3 text-[var(--color-text)]">
            Payment Verified!
          </h1>
          <p className="apple-body mb-6 text-[var(--color-text-muted)]">
            Your payment has been verified. Your order is now being processed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/orders"
              className="glass-cta inline-block rounded-full px-6 py-3 text-[15px] font-medium text-white"
            >
              View Orders
            </Link>
            <Link
              to="/"
              className="glass-btn inline-block rounded-full px-6 py-3 text-[15px]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide flex flex-col py-4 sm:py-8 mt-14 sm:mt-20 px-2 sm:px-4">
      <div className="mx-auto w-full max-w-xl">
        <div className="glass-panel rounded-[24px] sm:rounded-[32px] p-4 sm:p-8">
          {/* Header */}
          <div className="mb-4 sm:mb-6 text-center">
            <h1 className="apple-display text-[var(--color-text)] text-xl sm:text-2xl">
              Complete Your Payment
            </h1>
            <p className="apple-body mt-1 sm:mt-2 text-[var(--color-text-muted)] text-sm sm:text-base">
              Scan the QR code using any UPI app
            </p>
          </div>

          {/* Order Summary */}
          <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-[var(--color-glass)] p-3 sm:p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[11px] sm:text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider">
                  {orderId ? "Order ID" : "New Order"}
                </p>
                <p className="font-mono text-[12px] sm:text-[14px] text-[var(--color-text)]">
                  {orderId && order
                    ? `#${order._id.toUpperCase().slice(-8)}`
                    : "Payment pending"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] sm:text-[12px] text-[var(--color-text-muted)] uppercase tracking-wider">
                  Amount to Pay
                </p>
                <p className="text-xl sm:text-2xl font-bold text-[var(--color-accent)]">
                  ₹{amount}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          {!qrError && (
            <div className="mb-4 sm:mb-6 flex flex-col items-center">
              {!qrGenerated && (
                <div className="mb-3 sm:mb-4 flex items-center justify-center">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-accent)] border-t-transparent"></div>
                </div>
              )}
              <div
                className={`mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 shadow-lg ${!qrGenerated ? "hidden" : ""}`}
              >
                <canvas
                  ref={canvasRef}
                  width={250}
                  height={250}
                  className="w-[250px] h-[250px]"
                />
              </div>
              <p className="mb-2 text-[12px] font-semibold text-blue-400 rounded-3xl sm:rounded-5xl bg-blue-500/10 px-3 py-1">
                {paymentConfig?.merchantName || "CardVault"}
              </p>
              <p className="text-center text-xs sm:text-[14px] text-[var(--color-text-muted)] px-2 mb-2">
                Scan with any UPI app (GPay, PhonePe, Paytm)
              </p>

              {/* Manual UPI Details */}
              <div className="bg-[var(--color-glass)] rounded-xl p-3 w-full">
                <p className="text-[12px] text-[var(--color-text-muted)] text-center mb-1">
                  Or pay manually to this UPI ID:
                </p>
                <p className="text-[16px] font-bold text-center text-[var(--color-accent)]">
                  {paymentConfig?.upiId || "UPI ID not available"}
                </p>
                <p className="text-[14px] text-center text-[var(--color-text)] mt-1">
                  Amount: <span className="font-bold">₹{amount}</span>
                </p>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-blue-500/10 p-3 sm:p-4">
            <h3 className="mb-2 text-[13px] sm:text-[15px] font-semibold text-blue-400">
              Payment Instructions:
            </h3>
            <ol className="list-inside list-decimal text-xs sm:text-[14px] text-[var(--color-text-muted)] space-y-1">
              <li>Scan the QR code using your UPI app</li>
              <li>Verify the amount is exactly ₹{amount}</li>
              <li>Complete the payment</li>
              <li>Copy the UTR/Transaction ID from payment confirmation</li>
              <li>Enter the UTR below and submit</li>
            </ol>
          </div>

          {/* Message Alert */}
          {message && (
            <div
              className={`mb-4 sm:mb-6 flex items-center gap-3 rounded-xl sm:rounded-2xl p-3 sm:p-4 ${
                message.type === "success"
                  ? "bg-green-500/20 text-green-400"
                  : message.type === "error"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {message.type === "success" && (
                <HiCheck className="text-lg sm:text-xl shrink-0" />
              )}
              {message.type === "error" && (
                <HiX className="text-lg sm:text-xl shrink-0" />
              )}
              {message.type === "info" && (
                <HiClock className="text-lg sm:text-xl shrink-0" />
              )}
              <p className="text-xs sm:text-[14px]">{message.text}</p>
            </div>
          )}

          {/* UTR Submission Form */}
          {(!order || order.paymentStatus !== "awaiting_verification") && (
            <form onSubmit={handleSubmitUTR}>
              <div className="mb-3 sm:mb-4">
                <label className="mb-2 block text-[13px] sm:text-[14px] font-medium text-[var(--color-text)]">
                  Enter UTR/Transaction ID{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="12-16 digit UTR number"
                  className="w-full rounded-xl sm:rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-glass)] px-3 sm:px-4 py-2.5 sm:py-3 text-[14px] sm:text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
                />
                <p className="mt-1 text-[11px] sm:text-[12px] text-[var(--color-text-muted)]">
                  Find this in your payment app's transaction history (12-16
                  digits)
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="glass-cta flex w-full items-center justify-center gap-2 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[16px] font-semibold text-white disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="h-4 sm:h-5 w-4 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <HiQrcode className="text-lg sm:text-xl" />
                    Submit UTR
                  </>
                )}
              </button>
            </form>
          )}

          {/* Already Submitted State */}
          {order?.paymentStatus === "awaiting_verification" && (
            <div className="text-center">
              <div className="mb-3 sm:mb-4 flex justify-center">
                <div className="flex h-14 sm:h-16 w-14 sm:w-16 items-center justify-center rounded-full bg-yellow-500/20">
                  <HiClock className="text-2xl sm:text-3xl text-yellow-500" />
                </div>
              </div>
              <p className="text-[13px] sm:text-[15px] text-[var(--color-text)]">
                UTR Submitted:{" "}
                <span className="font-mono">{order.utrNumber}</span>
              </p>
              <p className="mt-2 text-xs sm:text-[14px] text-[var(--color-text-muted)]">
                We'll verify your payment within 24 hours
              </p>
              <Link
                to="/orders"
                className="glass-btn mt-4 sm:mt-6 inline-flex items-center gap-2 rounded-full px-4 sm:px-6 py-2 sm:py-3 text-[13px] sm:text-[15px]"
              >
                <HiArrowRight />
                View Order Status
              </Link>
            </div>
          )}

          {/* Footer Links */}
          <div className="mt-4 sm:mt-6 flex justify-center gap-3 sm:gap-4 text-xs sm:text-[14px]">
            <Link to="/orders" className="apple-link">
              View Order Details
            </Link>
            <span className="text-[var(--color-text-muted)]">|</span>
            <Link to="/" className="apple-link">
              Cancel & Go Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
