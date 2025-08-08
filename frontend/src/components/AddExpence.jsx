import React, { useEffect, useState } from 'react';
import {
  Container, TextField, Button, Typography, Paper,
  MenuItem, Select, InputLabel, FormControl, Stack, OutlinedInput, Checkbox, ListItemText
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useUser } from '../UserContext';

export default function AddExpense() {
  const { groupId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/groups/${groupId}/members`)
      .then(res => {
        setMembers(res.data);
        setPaidBy(user.id);
      })
      .catch(err => {
        console.error('Error fetching members:', err);
        setError('Failed to load members');
      });
  }, [groupId, user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/expenses`, {
        description,
        amount: parseFloat(amount),
        groupId: parseInt(groupId),
        paidBy,
        userIds
      });
      navigate(`/groups/${groupId}`);
    } catch (err) {
      console.error('Add expense error:', err);
      setError('Failed to add expense');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Add Expense</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Paid By</InputLabel>
              <Select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
                label="Paid By"
              >
                {members.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Split Between</InputLabel>
              <Select
                multiple
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                input={<OutlinedInput label="Split Between" />}
                renderValue={(selected) => members
                  .filter(m => selected.includes(m.id))
                  .map(m => m.name)
                  .join(', ')
                }
              >
                {members.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    <Checkbox checked={userIds.includes(m.id)} />
                    <ListItemText primary={m.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained">Add Expense</Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
