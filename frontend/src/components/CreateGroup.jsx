import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    axios
      .get("/users")
      .then((res) => {
        setUsers(res.data);
        setLoadingUsers(false);
      })
      .catch((err) => {
        console.error("User fetch error", err);
        setLoadingUsers(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }

    try {
      const res = await axios.post("/groups", {
        name: groupName,
        createdBy: user.id,
      });
      const groupId = res.data.id;

      await axios.post(`/groups/${groupId}/members`, {
        userIds: [...selectedMembers, user.id],
      });

      navigate("/groups");
    } catch (err) {
      console.error("Group creation failed:", err);
      setError("Something went wrong! Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333",
            mb: 2,
          }}
        >
          Create New Group
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            />

            {loadingUsers ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={24} />
                <Typography variant="body2" color="gray">
                  Loading members...
                </Typography>
              </Stack>
            ) : (
              <FormControl fullWidth>
                <InputLabel id="members-label">Select Members</InputLabel>
                <Select
                  labelId="members-label"
                  multiple
                  value={selectedMembers}
                  onChange={(e) => setSelectedMembers(e.target.value)}
                  input={<OutlinedInput label="Select Members" />}
                  renderValue={(selected) => (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {selected.map((id) => {
                        const member = users.find((u) => u.id === id);
                        return (
                          <Chip
                            key={id}
                            label={member?.name}
                            sx={{
                              backgroundColor: "rgba(37,117,252,0.08)",
                              color: "#2575fc",
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                >
                  {users
                    .filter((u) => u.id !== user.id)
                    .map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 1,
                background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
                color: "#fff",
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #5a0fb3 0%, #1f65e6 100%)",
                },
              }}
            >
              Create Group
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
