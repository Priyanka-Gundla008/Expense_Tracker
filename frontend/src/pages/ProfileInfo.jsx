import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserById, updateUser, changePassword } from "../services/userService";
import PersonalDetailsTab from "../components/PersonalDetailsTab";
import ChangePasswordTab from "../components/ChangePasswordTab";

export default function Profile() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [tab, setTab] = useState(0);
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    setEditing(mode === "edit");
  }, [location.search]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const res = await getUserById(storedUser.id);
        setUser(res.data);
      } catch (err) {
        setNotification({
          open: true,
          message: "Failed to fetch profile",
          severity: "error",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setUser({ ...user, [field]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const payload = {
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        company: user.company,
        department: user.department,
        designation: user.designation,
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(payload));
      console.log("profileImageFile", profileImageFile);
      if (profileImageFile) {
        formData.append("file", profileImageFile);
      }

      const res = await updateUser(storedUser.id, formData);
      setUser(res.data);
      setNotification({
        open: true,
        message: res.message || "Profile updated successfully",
        severity: "success",
      });
      setEditing(false);
      navigate("/profile?mode=view");
    } catch (err) {
      setNotification({
        open: true,
        message: "Failed to update profile",
        severity: "error",
      });
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const res = await changePassword(storedUser.id, { currentPassword, newPassword });
      setNotification({
        open: true,
        message: res.message || "Password updated successfully",
        severity: "success",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: err.response?.data?.message || "Failed to update password",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        p: { xs: 2, sm: 3, md: 4, lg: 4, xl: 5 },
        background: theme.palette.background.default,
      }}
    >
      {/* Title */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        My Profile
      </Typography>

      {/* Tabs */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: { xs: 3, sm: 4, md: 5, lg: 6, xl: 5 },
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Tab label="Personal Details" />
          {editing && <Tab label="Change Password" />}
        </Tabs>
      </Box>

      {/* Main Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "column", lg: "row", xl: "row" },
          gap: { xs: 3, sm: 4, md: 4, lg: 5, xl: 6 },
          alignItems: { xs: "center", sm: "center", md: "center", lg: "flex-start", xl: "flex-start" },
        }}
      >
        {/* LEFT AVATAR PANEL */}
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "100%", lg: 280, xl: 320 },
            textAlign: "center",
            position: { xs: "static", sm: "static", md: "static", lg: "sticky", xl: "sticky" },
            top: 120,
            mt: { xs: 0, sm: 1, md: 2, lg: 3, xl: 3 },
          }}
        >
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Avatar
              src={profileImagePreview || user.profileImage}
              sx={{
                width: { xs: 100, sm: 120, md: 150, lg: 180, xl: 190 },
                height: { xs: 100, sm: 120, md: 150, lg: 180, xl: 190 },
                fontSize: { xs: 30, sm: 36, md: 40, lg: 48, xl: 52 },
                mx: "auto",
              }}
            >
              {!profileImagePreview && user.profileImage}
            </Avatar>

            {editing && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: { xs: 10, sm: 20, md: 25, lg: 25, xl: 30 },
                  backgroundColor: theme.palette.secondary.main,
                  color: "#fff",
                }}
              >
                <PhotoCamera fontSize="small" />
                <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
              </IconButton>
            )}
          </Box>

          <Typography
            sx={{
              mt: 2,
              fontWeight: 600,
              fontSize: { xs: "0.9rem", sm: "1rem", md: "1rem", lg: "1.05rem", xl: "1.1rem" },
            }}
          >
            Username:{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {user?.name}
            </Box>
          </Typography>
        </Box>

        {/* RIGHT CARD */}
       {/* <Card
  sx={{
    flex: 1,
    width: "100%",
    maxWidth: {
      xs: "100%",
      sm: 700,
      md: 850,
      lg: 950,
      xl: 1100,
    },
    mx: "auto",
    borderRadius: 3,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    backgroundColor: theme.palette.background.paper,
    p: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3 },
  }}
> */}
    <Card
  sx={{
    flex: 1,
    width: {
      xs: "100%",
      sm: "100%",
      md: "90%",
      lg: "70%",
      xl: "60%",
    },
    maxWidth: 900,
    mx: "auto",
      borderRadius: 3,
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
    backgroundColor: theme.palette.background.paper,
    p: { xs: 1, sm: 2, md: 2, lg: 3, xl: 3 },
  }}
>
          <CardContent>
            {tab === 0 ? (
              <PersonalDetailsTab
                user={user}
                editing={editing}
                onChange={handleChange}
                onSave={handleSave}
              />
            ) : (
              <ChangePasswordTab
                onChangePassword={handleChangePassword}
                onCancel={() => setTab(0)}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
