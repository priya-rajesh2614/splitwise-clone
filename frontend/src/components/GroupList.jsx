import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Container,
  Alert,
  Box,
} from "@mui/material";
import { useUser } from "../UserContext";

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useUser();

  useEffect(() => {
    axios
      .get(`/groups/user/${user.id}`)
      .then((response) => {
        setGroups(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress size={50} thickness={4} />
        <Typography variant="body1" sx={{ mt: 2, color: "gray" }}>
          Loading your groups...
        </Typography>
      </Container>
    );
  }

  if (!groups.length) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Alert
          severity="info"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            borderRadius: "10px",
            p: 2,
            background: "rgba(37,117,252,0.05)",
            border: "1px solid rgba(37,117,252,0.2)",
          }}
        >
          No groups found. Please create a group to get started.
        </Alert>
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
              color: "#fff",
              borderRadius: "8px",
              px: 3,
              "&:hover": {
                background: "linear-gradient(90deg, #5a0fb3 0%, #1f65e6 100%)",
              },
            }}
            onClick={() => navigate("/create-group")}
          >
            Create Group
          </Button>
        </Box>
      </Container>
    );
  }

  return (
  <Container sx={{ mt: 6 }}>
    <Typography
      variant="h4"
      gutterBottom
      sx={{
        fontWeight: "bold",
        background: "linear-gradient(90deg, #2575fc, #6a11cb)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      Your Groups
    </Typography>

    <TableContainer
      component={Paper}
      sx={{
        overflow: "hidden",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background: "linear-gradient(90deg, #2575fc, #6a11cb)",
            }}
          >
            {["ID", "Group Name", "Created By", "Created At", "Action"].map(
              (header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                  }}
                  align={header === "Action" ? "center" : "left"}
                >
                  {header}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {groups.map((group, idx) => (
            <TableRow
              key={group.id}
              sx={{
                backgroundColor: idx % 2 === 0 ? "#f9faff" : "#ffffff",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "rgba(37,117,252,0.1)",
                  transform: "scale(1.01)",
                },
              }}
            >
              <TableCell>{group.id}</TableCell>
              <TableCell sx={{ fontWeight: "500" }}>{group.name}</TableCell>
              <TableCell>{group.createdBy}</TableCell>
              <TableCell>
                {new Date(group.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                    borderRadius: "20px",
                    px: 2.5,
                    boxShadow: "0px 3px 10px rgba(0, 114, 255, 0.3)",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 4px 14px rgba(0, 114, 255, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => navigate(`/groups/${group.id}`)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Container>
);

};

export default GroupList;
