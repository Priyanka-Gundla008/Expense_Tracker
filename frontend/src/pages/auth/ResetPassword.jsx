import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [location.search]);

  console.log("Token", token)

  const validators = {
    password: (value) => {
      if (!value) return "Password is required";
      if (value.length < 8) return "Minimum 8 characters required";
      if (!/(?=.*[a-z])/.test(value)) return "Must include a lowercase letter";
      if (!/(?=.*[A-Z])/.test(value)) return "Must include an uppercase letter";
      if (!/(?=.*\d)/.test(value)) return "Must include a number";
      if (!/(?=.*[@$!%*?&])/.test(value)) return "Must include a special character";
      return "";
    },
    confirmPassword: (value) => {
      if (!value) return "Confirm password is required";
      if (value !== form.password) return "Passwords do not match";
      return "";
    },
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    Object.keys(form).forEach((key) => {
      validationErrors[key] = validators[key](form[key]);
    });
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) return;

    try {
      await resetPassword({
        token,
        newPassword: form.password,
      });

      setNotification({
        open: true,
        message: "Password reset successfully. Please login.",
        severity: "success",
      });

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setNotification({
        open: true,
        message: err?.response?.data?.message || "Reset failed",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: theme.palette.background.default,
      }}
    >
      <Card
        sx={{
          width: 500,
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              textAlign: "center",
              color: theme.palette.primary.main,
            }}
          >
            Reset Password
          </Typography>

          <Typography
            variant="body2"
            sx={{ mb: 3, textAlign: "center", color: theme.palette.text.secondary }}
          >
            Enter your new password below
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="New Password"
              margin="normal"
              value={form.password}
              onChange={handleChange("password")}
              helperText={errors.password}
              FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: "15px" },
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              margin="normal"
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              helperText={errors.confirmPassword}
              FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                sx: { borderRadius: "15px" },
              }}
            />

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: "15px",
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                },
              }}
              variant="contained"
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={notification.severity} variant="filled">
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ResetPassword;
