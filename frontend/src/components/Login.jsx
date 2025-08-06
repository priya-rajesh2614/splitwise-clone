import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from '../api/axios'; 
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
        const response = await axios.post('/users/login', {
          email: email,
          password: password,
        });
          navigate("/groups");
          setUser(response.data);
      } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong during login.");
      }
    } else {
      alert("Please enter both email and password");
    }
  };

  return (
    <Box
      sx={{
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <Container component={Paper} sx={{ padding: "40px", width: "400px" }}>
        <Stack spacing={3}>
          <Typography variant="h5" align="center">
            Login
          </Typography>

          <TextField
            label="Email"
            type="email"
            value={email}
            error={isFormSubmitted && !email}
            helperText={isFormSubmitted && !email ? "Please enter your email" : ""}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            error={isFormSubmitted && !password}
            helperText={isFormSubmitted && !password ? "Please enter your password" : ""}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            fullWidth
          >
            Login
          </Button>

          <Typography align="center">
            Don’t have an account?{" "}
            <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
