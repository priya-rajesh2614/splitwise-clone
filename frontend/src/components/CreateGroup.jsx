import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, Paper, Stack,
  FormControl, InputLabel, Select, MenuItem, OutlinedInput, Chip
} from '@mui/material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    axios.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('User fetch error', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('/groups', {
        name: groupName,
        createdBy: user.id
      });
      const groupId = res.data.id;

      await axios.post(`/groups/${groupId}/members`, {
        userIds: [...selectedMembers, user.id]  
      });

      navigate('/groups');
    } catch (err) {
      console.error('Group creation failed:', err);
      setError('Something went wrong!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Create New Group</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />

            <FormControl fullWidth>
              <InputLabel id="members-label">Select Members</InputLabel>
              <Select
                labelId="members-label"
                multiple
                value={selectedMembers}
                onChange={(e) => setSelectedMembers(e.target.value)}
                input={<OutlinedInput label="Select Members" />}
                renderValue={(selected) => (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selected.map((id) => {
                      const member = users.find(u => u.id === id);
                      return <Chip key={id} label={member?.name} />;
                    })}
                  </div>
                )}
              >
                {users
                  .filter(u => u.id !== user.id)
                  .map(u => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained">Create Group</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
