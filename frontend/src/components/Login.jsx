import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const { setUser } = useUser();

  const navigate = useNavigate();

  const handleClick = async () => {
    setIsFormSubmitted(true);

    if (email && password) {
      try {
        const response = await axios.post("/users/login", {
          email: email,
          password: password,
        });
        navigate("/groups");
        setUser(response.data);
      } catch (error) {
        console.error("Login Error:", error);
        alert(error.response?.data || "Something went wrong during login.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      }}
    >
      <Container
        component={Paper}
        sx={{
          padding: "40px",
          width: "400px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          backgroundColor: "#fff",
        }}
      >
        <Stack spacing={3}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            align="center"
            sx={{ color: "gray", fontSize: "14px", mb: 2 }}
          >
            Login to continue to Splitwise Clone
          </Typography>

          <TextField
            label="Email"
            type="email"
            value={email}
            error={isFormSubmitted && !email}
            helperText={
              isFormSubmitted && !email ? "Please enter your email" : ""
            }
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            error={isFormSubmitted && !password}
            helperText={
              isFormSubmitted && !password ? "Please enter your password" : ""
            }
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
          />

          <Button
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 14px rgba(37, 117, 252, 0.4)",
              "&:hover": {
                background: "linear-gradient(90deg, #5a0eb5, #1d63d2)",
              },
            }}
            onClick={handleClick}
          >
            Login
          </Button>

          <Typography align="center" sx={{ fontSize: "14px" }}>
            Don’t have an account?{" "}
            <Link
              to="/register"
              style={{
                textDecoration: "none",
                color: "#2575fc",
                fontWeight: "bold",
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
