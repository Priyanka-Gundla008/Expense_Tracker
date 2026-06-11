import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";

export default function ChangePasswordTab({ onChangePassword, onCancel }) {
  const theme = useTheme();

  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
        passwordForm.newPassword,
      )
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

  const handlePasswordChange = (field) => (e) => {
    setPasswordForm({ ...passwordForm, [field]: e.target.value });
    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: "" });
    }
  };

  const handleSubmit = () => {
    if (!validatePasswordForm()) return;
    onChangePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
  };

  const handleCancel = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    onCancel();
  };

  return (
    <Box>
      {/* Current Password */}
      <TextField
        label="Current Password"
        type={showPass ? "text" : "password"}
        fullWidth
        sx={{ mb: 3 }}
        value={passwordForm.currentPassword}
        onChange={handlePasswordChange("currentPassword")}
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
        sx={{ mb: 4 }}
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

      <Divider sx={{ mt: 1 }} />

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            sm: "column",
            md: "row",
            lg: "row",
            xl: "row",
          },
          justifyContent: "flex-end",
          gap: 2,
          mt: 3,
        }}
      >
        {/* Cancel Button */}
        <Button onClick={handleCancel}>Cancel</Button>

        {/* Update Password Button */}
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            py: 1,
            px: 3,
            width: { xs: "100%", sm: "100%", md: "auto" },

            //   fontWeight: 600,
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
  );
}
