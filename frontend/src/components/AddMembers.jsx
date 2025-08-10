import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "../api/axios";
import { useUser } from "../UserContext";

export default function AddMembersDialog({
  open,
  onClose,
  groupId,
  currentMembers,
  onSuccess,
}) {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get("/users")
        .then((res) => {
          const filtered = res.data.filter(
            (u) => !currentMembers.includes(u.id) && u.id !== user.id
          );
          setAllUsers(filtered);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setError("Failed to load users");
          setLoading(false);
        });
    } else {
      setSelectedUsers([]);
      setError("");
    }
  }, [open, currentMembers, user.id]);

  const handleChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  const handleAdd = async () => {
    try {
      await axios.post(`/groups/${groupId}/members`, {
        userIds: selectedUsers,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to add members", err);
      setError("Something went wrong while adding members.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: "12px" },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>
        Add Members
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={24} />
              <Typography variant="body2" color="gray">
                Loading available members...
              </Typography>
            </Stack>
          ) : (
            <FormControl fullWidth>
              <InputLabel>Select Members</InputLabel>
              <Select
                multiple
                value={selectedUsers}
                onChange={handleChange}
                input={<OutlinedInput label="Select Members" />}
                renderValue={(selected) => (
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    {selected.map((id) => {
                      const u = allUsers.find((usr) => usr.id === id);
                      return (
                        <Chip
                          key={id}
                          label={u?.name || id}
                          sx={{
                            backgroundColor: "rgba(37,117,252,0.08)",
                            color: "#2575fc",
                          }}
                        />
                      );
                    })}
                  </Stack>
                )}
              >
                {allUsers.length > 0 ? (
                  allUsers.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No users available</MenuItem>
                )}
              </Select>
            </FormControl>
          )}

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={selectedUsers.length === 0 || loading}
          sx={{
            background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
            borderRadius: "8px",
            px: 3,
            py: 1,
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(90deg, #5a0fb3 0%, #1f65e6 100%)",
            },
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
