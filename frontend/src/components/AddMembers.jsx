import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip, Stack, Typography
} from '@mui/material';
import axios from '../api/axios';
import { useUser } from '../UserContext';

export default function AddMembersDialog({ open, onClose, groupId, currentMembers, onSuccess }) {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (open) {
      axios.get('/users')
        .then(res => {
          const filtered = res.data.filter(u => !currentMembers.includes(u.id) && u.id !== user.id);
          setAllUsers(filtered);
        })
        .catch(err => {
          console.error('Error fetching users:', err);
          setError('Failed to load users');
        });
    }
  }, [open, currentMembers, user.id]);

  const handleChange = (event) => {
    setSelectedUsers(event.target.value);
  };

  const handleAdd = async () => {
    try {
      await axios.post(`/groups/${groupId}/members`, {
        userIds: selectedUsers
      });
      onSuccess(); 
      onClose();
    } catch (err) {
      console.error('Failed to add members', err);
      setError('Something went wrong');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Members</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <FormControl fullWidth>
            <InputLabel>Select Members</InputLabel>
            <Select
              multiple
              value={selectedUsers}
              onChange={handleChange}
              input={<OutlinedInput label="Select Members" />}
              renderValue={(selected) => (
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {selected.map(id => {
                    const u = allUsers.find(user => user.id === id);
                    return <Chip key={id} label={u?.name || id} />;
                  })}
                </Stack>
              )}
            >
              {allUsers.map(u => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={selectedUsers.length === 0}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
