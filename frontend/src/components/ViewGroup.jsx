import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';
import {
  Box, Typography, Paper, Button, Stack, Divider, List, ListItem, ListItemText
} from '@mui/material';
import AddMembers from './AddMembers';

export default function ViewGroup() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroup();
    fetchMembers();
    fetchBalances();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`/groups/${groupId}`);
      setGroup(res.data);
    } catch (err) {
      console.error('Failed to fetch group', err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`/groups/${groupId}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  };

  const fetchBalances = async () => {
    try {
      const res = await axios.get(`/groups/${groupId}/balances`);
      setBalances(res.data);
    } catch (err) {
      console.error('Failed to fetch balances', err);
    }
  };

  if (!group) return <Typography>Loading group...</Typography>;

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>{group.name}</Typography>
        <Typography variant="subtitle1">Created by: {group.createdBy}</Typography>
        <Typography variant="subtitle2">Created at: {new Date(group.createdAt).toLocaleDateString()}</Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>Add Members</Button>
          <Button variant="contained" color="secondary" onClick={() => navigate(`/groups/${groupId}/add-expense`)}>Add Expense</Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Members</Typography>
          <List>
            {members.map(member => (
              <ListItem key={member.id}>
                <ListItemText primary={member.name} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Balances</Typography>
          <List>
            {balances.map((bal, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={`${bal.userName} ${bal.balance >= 0 ? 'is owed' : 'owes'} ₹${Math.abs(bal.balance)}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      <AddMembers
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        groupId={groupId}
        currentMembers={members.map(m => m.id)}
        onSuccess={fetchMembers}
      />
    </>
  );
}
