import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Popover,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { useNavigate } from "react-router-dom";
import { getUserById } from "../services/userService";

export default function Header({ toggleSidebar }) {
  const theme = useTheme();
  const navigate = useNavigate();

  // Breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [user, setUser] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleMenuAction = (action) => {
    handlePopoverClose();

    if (action === "viewProfile") navigate("/profile?mode=view");
    if (action === "editProfile") navigate("/profile?mode=edit");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userData = await getUserById(user.id);
        setUser(userData.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        px: { xs: 1.5, sm: 2, md: 3, lg: 4 },
        py: { xs: 1, sm: 1.2, md: 1.5 },
        backgroundColor: theme.palette.background.primary,
        color: theme.palette.text.primary,
        boxShadow: 1,
      }}
    >
      {/* LEFT SECTION */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Sidebar menu button (mobile + tablet) */}
        {(isMobile || isTablet) && (
          <IconButton onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Welcome Text */}
        <Typography
          variant={isMobile ? "subtitle2" : "h6"}
          fontWeight={600}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {isMobile ? "Welcome" : `Welcome, ${user?.name}`}

          <HandshakeIcon
            sx={{
              fontSize: { xs: 18, sm: 20, md: 22 },
              color: theme.palette.primary.main,
            }}
          />
        </Typography>
      </Box>

      {/* RIGHT SECTION */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 2 },
        }}
      >
        {/* Avatar */}
        <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
          <Avatar
            src={user?.profileImage || undefined}
            sx={{
              width: { xs: 32, sm: 36, md: 40 },
              height: { xs: 32, sm: 36, md: 40 },
              bgcolor: theme.palette.primary.main,
            }}
          >
            {!user?.profileImage && user?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        </IconButton>

        {/* Popover */}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Box
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              minWidth: { xs: 160, sm: 200 },
            }}
          >
            <Typography fontWeight={600}>{user?.name}</Typography>

            <Button
              size="small"
              variant="outlined"
              onClick={() => handleMenuAction("viewProfile")}
            >
              View Profile
            </Button>

            <Button
              size="small"
              variant="outlined"
              onClick={() => handleMenuAction("editProfile")}
            >
              Edit Profile
            </Button>

            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
