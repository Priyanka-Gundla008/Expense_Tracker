import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Tabs,
  Tab,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Edit, Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useTheme } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { getUserById, updateUser, changePassword } from "../services/userService";

export default function Profile() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // const params = new URLSearchParams(location.search);
  // const mode = params.get("mode");
  // const isEditMode = mode === "edit";




  const [tab, setTab] = useState(0);
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null); // for UI
  const [profileImageFile, setProfileImageFile] = useState(null); // for backend


  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    setEditing(mode === "edit");
  }, [location.search]);


  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(passwordForm.currentPassword)
    ) {
      errors.currentPassword =
        "Must include uppercase, lowercase, number & special character";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(passwordForm.newPassword)
    ) {
      errors.newPassword =
        "Must include uppercase, lowercase, number & special character";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  };


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

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm({ ...passwordForm, [field]: e.target.value });
    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: "" });
    }

  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImageFile(file); // store actual File for upload
    setProfileImagePreview(URL.createObjectURL(file)); // preview in Avatar
  };


  const handleSave = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        address: user.address,
        company: user.company,
        department: user.department,
        designation: user.designation,
      };

      const formData = new FormData();
      formData.append("json", JSON.stringify(payload));

      // use the actual File object
      console.log("profileImageFile", profileImageFile)
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

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setNotification({
          open: true,
          message: "Passwords do not match",
          severity: "error",
        });
        return;
      }

      const payload = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };

      const res = await changePassword(storedUser.id, payload);

      setNotification({
        open: true,
        message: res.message || "Password updated successfully",
        severity: "success",
      });

      // clear form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
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
        p: 3,
        background: theme.palette.background.default,
      }}
    >
      {/* Title */}
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        My Profile
      </Typography>

      {/* Tabs */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 10, ml: editing ? -37 : -57, }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: theme.palette.primary.main },
          }}
        >
          {/* Always show Personal Details tab */}
          <Tab label="Personal Details" />

          {/* Show Change Password only in edit mode */}
          {editing && <Tab label="Change Password" />}
        </Tabs>
      </Box>


      {/* Main Card */}
      <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
        {/* LEFT AVATAR PANEL */}
        <Box sx={{ width: 320, textAlign: "center", position: "sticky", top: 200, mt: 3 }}>
          <Box sx={{ position: "relative", display: "inline-block", }} >
            <Avatar src={profileImagePreview || user.profileImage} sx={{ width: 220, height: 220, fontSize: 48 }}>
              {!profileImagePreview && user.profileImage}
            </Avatar>

            {editing && (
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 25,
                  backgroundColor: theme.palette.secondary.main,
                  color: "#fff",
                  "&:hover": { backgroundColor: theme.palette.primary.dark },
                }}
              >
                <PhotoCamera fontSize="small" />
                <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
              </IconButton>
            )}

          </Box>

          <Typography sx={{ mt: 2, fontWeight: 600 }}>
            Username:{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {user?.firstName} {user?.lastName}
            </Box>
          </Typography>
        </Box>

        {/* RIGHT CARD */}
        <Card
          sx={{
            flex: 1,
            maxWidth: 870,
            borderRadius: 3,
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
            backgroundColor: theme.palette.background.paper,
            ml: 15,
            p: 2,
            pt: 5,
          }}
        >
          <CardContent>

            {/* Tab Content in Same Card */}
            {tab === 0 ? (
              <Grid container spacing={3}>
                {/* Row 1 */}
                <Grid item xs={12} sm={6} sx={{ mb: 1, mr: 15 }}>
                  <TextField
                    label="First Name"
                    value={user?.firstName || ""}
                    onChange={handleChange("firstName")}
                    disabled={!editing}
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "15px", width: "135%" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    value={user?.lastName || ""}
                    onChange={handleChange("lastName")}
                    disabled={!editing}
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "15px", width: "135%" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Row 2 */}
                <Grid item xs={12} sm={6} sx={{ mb: 1, mr: 15 }}>
                  <TextField
                    label="Mobile Number"
                    value={user?.mobile || ""}
                    onChange={handleChange("mobile")}
                    disabled={!editing}
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "15px", width: "135%" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    value={user?.email || ""}
                    disabled
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "15px", width: "135%" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Row 3 */}
                <Grid item xs={12} sm={6} sx={{ mb: 1, mr: 15 }}>
                  <TextField
                    label="Address"
                    value={user?.address || ""}
                    onChange={handleChange("address")}
                    disabled={!editing}
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "15px", width: "135%" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Designation"
                    value={user?.designation || ""}
                    onChange={handleChange("designation")}
                    disabled={!editing}
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "15px", width: "135%" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <WorkIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Row 4 */}
                <Grid item xs={12} sm={6} sx={{ mb: 1, mr: 15 }}>
                  <TextField
                    label="Company"
                    value={user?.company || ""}
                    onChange={handleChange("company")}
                    disabled={!editing}
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "15px", width: "135%" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <BusinessIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Department"
                    value={user?.department || ""}
                    onChange={handleChange("department")}
                    disabled={!editing}
                    fullWidth
                    InputProps={{
                      sx: { borderRadius: "15px", width: "135%" },
                      startAdornment: (
                        <InputAdornment position="start">
                          <ApartmentIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                </Grid>

                {/* Save and Cancel Buttons */}
                {editing && (
                  <>
                    {/* Full-width Divider */}
                    <Box sx={{ width: "100%" }}>
                      <Divider />
                    </Box>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", ml: 81 }}>

                        {/* Save Changes Button */}
                        <Button
                          type="submit"
                          variant="contained"
                          onClick={handleSave}
                          sx={{
                            py: 1.5,
                            px: 3,
                            fontWeight: 600,
                            borderRadius: "15px",
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            "&:hover": {
                              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                            },
                          }}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  </>
                )}


              </Grid>
            ) : (
              <Box>
                {/* Current Password */}

                <TextField
                  label="Current Password"
                  type={showPass ? "text" : "password"}
                  fullWidth
                  sx={{ mb: 2 }}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange("currentPassword")}
                  helperText={passwordErrors.currentPassword}
                  FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
                  InputProps={{
                    sx: { borderRadius: "15px" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPass(!showPass)}>
                          {showPass ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* New Password */}
                <TextField
                  label="New Password"
                  type={showNewPass ? "text" : "password"}
                  fullWidth
                  sx={{ mb: 2 }}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange("newPassword")}
                  helperText={passwordErrors.newPassword}
                  FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
                  InputProps={{
                    sx: { borderRadius: "15px" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPass(!showNewPass)}>
                          {showNewPass ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirm Password */}
                <TextField
                  label="Confirm Password"
                  type={showConfirmPass ? "text" : "password"}
                  fullWidth
                  sx={{ mb: 3 }}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange("confirmPassword")}
                  helperText={passwordErrors.confirmPassword}
                  FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
                  InputProps={{
                    sx: { borderRadius: "15px" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPass(!showConfirmPass)}>
                          {showConfirmPass ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* <Box sx={{ width: "100%" }}> */}
                <Divider sx={{ mt: 1 }} />
                {/* </Box> */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
                  {/* Cancel Button */}
                  <Button
                    onClick={() => {
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setPasswordErrors({});
                      setTab(0); // switch back to Personal Details tab if desired
                    }}
                  >
                    Cancel
                  </Button>

                  {/* Update Password Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={handleChangePassword}
                    sx={{
                      py: 1.5,
                      px: 3,
                      fontWeight: 600,
                      borderRadius: "15px",
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                      },
                    }}
                  >
                    Update Password
                  </Button>
                </Box>


              </Box>

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
