import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    handleMenuClose();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%) !important",
        color: "#fff",
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            cursor: "pointer",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
          onClick={() => navigate("/")}
        >
          Splitwise Clone
        </Typography>

        {user && (
          <Box>
            <Button
              color="inherit"
              sx={{
                mr: 2,
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.5)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
              onClick={() => navigate("/groups")}
            >
              Groups
            </Button>
            <Button
              color="inherit"
              sx={{
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.5)",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
              onClick={() => navigate("/create-group")}
            >
              Create Group
            </Button>
          </Box>
        )}

        {user && (
          <Box sx={{ ml: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#fff",
                color: "#000",
                cursor: "pointer",
                fontWeight: "bold",
                border: "2px solid #fff",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={handleAvatarClick}
            >
              {user.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: "12px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography
                sx={{
                  px: 2,
                  py: 1,
                  fontWeight: "bold",
                  fontSize: "14px",
                  color: "gray",
                }}
              >
                {user.name}
              </Typography>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
