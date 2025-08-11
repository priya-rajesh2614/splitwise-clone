import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Typography,
  Box
} from "@mui/material";
import axios from "../api/axios";

export default function PaymentDialog({
  open,
  onClose,
  groupId,
  fromUserId,
  toUserId,
  amount,
  onSuccess,
  toUserName
}) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {

    try {
      setLoading(true);
      const res = await axios.post("/payments", {
        groupId,
        fromUserId,
        toUserId,
        amount
      });
      alert("Payment successful!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Payment failed", err);
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
          padding: 2,
          width: 400,
          maxWidth: "90%"
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", pb: 1 }}>
        Make Payment
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="subtitle1">
          Paying <strong>₹{amount}</strong> to User <strong>{toUserName}</strong>
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: "bold"
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handlePayment}
          disabled={loading}
          sx={{
            background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
            color: "#fff",
            px: 3,
            py: 1,
            borderRadius: "12px",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(255, 118, 140, 0.3)",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 16px rgba(255, 118, 140, 0.4)"
            },
            transition: "all 0.3s ease"
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Pay Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
