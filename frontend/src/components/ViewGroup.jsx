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
  CardContent,
  Tabs,
  Tab
} from "@mui/material";
import AddMembers from "./AddMembers";
import PaymentDialog from "./PaymentDialog"
import { useUser } from "../UserContext";

export default function ViewGroup() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({ toUserId: null, amount: 0, userName: '' });

  const { user } = useUser()

  const currentUserId = user?.id

  const handleOpenPayment = (toUserId, amount, userName) => {
    setPaymentInfo({ toUserId, amount, userName });
    setPaymentDialogOpen(true);
  };


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


  if (!group) return <Typography sx={{ p: 3 }}>Loading group...</Typography>;

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: "16px",
            textAlign: "center"
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #0072ff, #00c6ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "1px"
            }}
          >
            {group.name}
          </Typography>

          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ color: "#555", fontWeight: 500 }}
          >
            Created by:{" "}
            <Box component="span" sx={{ fontWeight: "bold", color: "#333" }}>
              {group.createdBy}
            </Box>
          </Typography>

          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ color: "#777", fontStyle: "italic" }}
          >
            Created at: {new Date(group.createdAt).toLocaleDateString()}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              sx={{
                background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                color: "#fff",
                px: 3,
                py: 1,
                borderRadius: "12px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(0, 114, 255, 0.3)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(0, 114, 255, 0.4)"
                },
                transition: "all 0.3s ease"
              }}
            >
              Add Members
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate(`/groups/${groupId}/add-expense`)}
              sx={{
                background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
                color: "#fff",
                px: 3,
                py: 1,
                borderRadius: "12px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(255, 118, 140, 0.3)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(255, 118, 140, 0.4)"
                },
                transition: "all 0.3s ease"
              }}
            >
              Add Expense
            </Button>
          </Stack>
        </Box>


        <Paper sx={{ mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Members" />
            <Tab label="Balances" />
            <Tab label="Expenses" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tabValue === 0 && (
              <List>
                {members.map((member) => (
                  <ListItem key={member.id}>
                    <ListItemText primary={member.name} />
                  </ListItem>
                ))}
              </List>
            )}

            {tabValue === 1 && (
              <>
                {balances.length === 0 ? (
                  <Typography variant="body1" color="textSecondary">
                    No balances yet.
                  </Typography>
                ) : (
                  <List>
                    {balances.map((bal, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={`${bal.userName} ${bal.balance >= 0 ? "is owed" : "owes"} ₹${Math.abs(bal.balance)}`}
                        />
                        {currentUserId == bal.userId && (
                          <Button
                            sx={{
                              background: "linear-gradient(90deg, #00c6ff, #0072ff)",
                              color: "#fff",
                              px: 3,
                              py: 1,
                              borderRadius: "12px",
                              fontWeight: "bold",
                              textTransform: "none",
                              boxShadow: "0 4px 12px rgba(0, 114, 255, 0.3)",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 16px rgba(0, 114, 255, 0.4)"
                              },
                              transition: "all 0.3s ease"
                            }}
                            onClick={() => handleOpenPayment(bal.toUserId, bal.balance, bal.toUserName)}
                          >
                            Settle Up
                          </Button>
                        )}
                      </ListItem>
                    ))}
                  </List>
                )}
              </>

            )}

            {tabValue === 2 && (
              <>
                {expenses.length === 0 ? (
                  <Typography variant="body1" color="textSecondary">
                    No expenses yet.
                  </Typography>
                ) : (
                  expenses.map((expense) => (
                    <Card
                      key={expense.expenseId}
                      sx={{
                        mb: 3,
                        boxShadow: 2,
                        borderRadius: 2,
                        background:
                          "linear-gradient(145deg, #f5f7fa, #e4e7eb)"
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {expense.description}
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ₹{expense.amount}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
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
                            <ListItem
                              key={split.userId}
                              sx={{ paddingY: 0.5 }}
                            >
                              <ListItemText
                                primary={split.userName}
                                secondary={`Owes ₹${split.amountOwed}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  ))
                )}
              </>
            )}
          </Box>
        </Paper>
      </Box>

      <AddMembers
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        groupId={groupId}
        currentMembers={members.map((m) => m.id)}
        onSuccess={fetchMembers}
      />

      <PaymentDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        groupId={groupId}
        fromUserId={currentUserId}
        toUserId={paymentInfo.toUserId}
        amount={paymentInfo.amount}
        onSuccess={fetchBalances}
        toUserName={paymentInfo.userName}
      />

    </>
  );
}
