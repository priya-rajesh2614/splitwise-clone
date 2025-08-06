
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const Header = () => {
  const navigate = useNavigate();

  const { user } = useUser();

  return (
    <AppBar position="fixed" elevation={2} sx={{
        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%) !important',
        color: '#fff',
      }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Splitwise Clone
        </Typography>

        <Box>
          <Button  color='inherit' variant='outlined' sx={{mr: 2}} onClick={() => navigate('/')}>Groups</Button>
          <Button  color='inherit' variant='outlined' onClick={() => navigate('/create-group')}>Create Group</Button>
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <Avatar sx={{ bgcolor: '#ffffff', color: '#000' }}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </Box>
        )}  
      </Toolbar>
    </AppBar>
  );
};

export default Header;
