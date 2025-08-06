import { Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from '../api/axios'; // Axios instance with base URL
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    setIsFormSubmitted(true);

    if (name && email && password) {
      try {
        const response = await axios.post('/users', {
          name: name,
          email: email,
          password: password,
        });

        
          navigate('/login');
       
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration.");
      }
    } else {
      alert('Please fill in all the fields');
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f3f4f6", }}>
      <Container component={Paper} sx={{ padding: 4, width: 400 }}>
        <Stack spacing={2}>
          <Typography variant="h5" align="center">
            Register
          </Typography>

          <TextField
            label="User Name"
            value={name}
            error={isFormSubmitted && !name}
            helperText={isFormSubmitted && !name ? "Please enter user name" : ""}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Email"
            type="email"
            value={email}
            error={isFormSubmitted && !email}
            helperText={isFormSubmitted && !email ? "Please enter email" : ""}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            error={isFormSubmitted && !password}
            helperText={isFormSubmitted && !password ? "Please enter password" : ""}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            fullWidth
          >
            Submit
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
