import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent
} from "@mui/material";
import AddMembers from "./AddMembers";

export default function ViewGroup() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchGroup();
    fetchMembers();
    fetchBalances();
    fetchExpenses();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`/groups/${groupId}`);
      setGroup(res.data);
    } catch (err) {
      console.error("Failed to fetch group", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get(`/groups/${groupId}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members", err);
    }
  };

  const fetchBalances = async () => {
    try {
      const res = await axios.get(`/groups/${groupId}/balances`);
      setBalances(res.data);
    } catch (err) {
      console.error("Failed to fetch balances", err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`/groups/${groupId}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  if (!group) return <Typography>Loading group...</Typography>;

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {group.name}
        </Typography>
        <Typography variant="subtitle1">
          Created by: {group.createdBy}
        </Typography>
        <Typography variant="subtitle2">
          Created at: {new Date(group.createdAt).toLocaleDateString()}
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => setOpenDialog(true)}>
            Add Members
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate(`/groups/${groupId}/add-expense`)}
          >
            Add Expense
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Members
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <List>
            {members.map((member) => (
              <ListItem key={member.id}>
                <ListItemText primary={member.name} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Balances
        </Typography>
        <Paper sx={{ p: 2, mb: 3 }}>

          <List>
            {balances.map((bal, i) => (
              <ListItem key={i}>
                <ListItemText
                  primary={`${bal.userName} ${bal.balance >= 0 ? "is owed" : "owes"
                    } ₹${Math.abs(bal.balance)}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Expenses
        </Typography>
        {expenses.length === 0 && (
          <Typography variant="body1" color="textSecondary">
            No expenses yet.
          </Typography>
        )}

        {expenses.map((expense) => (
          <Card
            key={expense.expenseId}
            sx={{
              mb: 3,
              boxShadow: 1,
              padding: 1
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                {expense.description}
              </Typography>

              <Typography variant="h6" color="primary">
                ₹{expense.amount}
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Paid by <strong>{expense.paidBy}</strong> on{" "}
                {new Date(expense.createdAt).toLocaleDateString()}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Split Details:
              </Typography>
              <List>
                {expense.splitDetails.map((split) => (
                  <ListItem key={split.userId} sx={{ paddingY: 0.5 }}>
                    <ListItemText
                      primary={split.userName}
                      secondary={`Owes ₹${split.amountOwed}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Box>


      <AddMembers
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        groupId={groupId}
        currentMembers={members.map((m) => m.id)}
        onSuccess={fetchMembers}
      />
    </>
  );
}
