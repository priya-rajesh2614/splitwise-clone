import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button,
  Typography, CircularProgress, Container,
  Alert
} from '@mui/material';
import { useUser } from '../UserContext';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useUser();

  useEffect(() => {
    axios.get(`/groups/user/${user.id}`)
      .then(response => {
        setGroups(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching groups:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if(!groups.length){
    return <Alert severity="info" sx={{ mt: 2, justifyContent: 'center' }}>
      No groups found. Please create a group to get started.
    </Alert>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Group List
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Group Name</strong></TableCell>
              <TableCell><strong>Created By</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell align="center"><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.createdBy}</TableCell>
                <TableCell>{new Date(group.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/group/${group.id}`)}
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
