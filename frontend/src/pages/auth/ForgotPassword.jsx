import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Snackbar,
    Alert,
    useTheme,
} from "@mui/material";
import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
    const theme = useTheme();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Basic email validation
    const validateEmail = (value) => {
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
        return "";
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError(validateEmail(e.target.value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const res = await forgotPassword({ email: email.trim().toLowerCase() });
            setNotification({
                open: true,
                message: res?.message || "Reset link sent to your email",
                severity: "success",
            });

            navigate("/email-confirmation", { state: { email: email } });
            setTimeout(() => navigate("/login"), 5000);
        } catch (err) {
            setNotification({
                open: true,
                message: err?.response?.data?.message || "Something went wrong",
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
    px: {
      xs: 2,
      sm: 3,
    },
    py: {
      xs: 3,
      sm: 0,
    },
  }}
>
           <Card
  sx={{
    p: {
      xs: 2,
      sm: 3,
    },
    width: "100%",
    maxWidth: 500,
    borderRadius: {
      xs: 2,
      sm: 3,
    },
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
    backgroundColor: theme.palette.background.paper,
  }}
>
                <CardContent>
                   <Typography
  sx={{
    mb: 1,
    fontWeight: 700,
    textAlign: "center",
    color: theme.palette.primary.main,
    fontSize: {
      xs: "1.8rem",
      sm: "2.125rem",
    },
  }}
>
                        Forgot Password
                    </Typography>
                 <Typography
  sx={{
    mb: 3,
    textAlign: "center",
    color: theme.palette.text.primary,
    fontSize: {
      xs: "0.9rem",
      sm: "1rem",
    },
  }}
>
                        Enter your registered email to receive a password reset link
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <TextField
                            fullWidth
                            type="email"
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={handleChange}
                            helperText={error}
                            FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
                            InputProps={{
  startAdornment: (
    <InputAdornment position="start">
      <Email color="action" />
    </InputAdornment>
  ),
  sx: {
    borderRadius: "15px",
    fontSize: {
      xs: "0.9rem",
      sm: "1rem",
    },
  },
}}
                        />

                       <Button
  type="submit"
  variant="contained"
  fullWidth
  sx={{
    mt: 3,
    py: {
      xs: 1.2,
      sm: 1.5,
    },
    fontSize: {
      xs: "0.9rem",
      sm: "1rem",
    },
                                fontWeight: 600,
                                borderRadius: "15px",
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                "&:hover": {
                                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                                },
                            }}
                        >
                            Send Reset Link
                        </Button>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 2,
                                textAlign: "center",
                                color: theme.palette.text.primary,
                                  cursor: "pointer",
    fontSize: {
      xs: "0.85rem",
      sm: "0.95rem",
    },
                            }}
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </Typography>
                    </form>
                </CardContent>
            </Card>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
anchorOrigin={{
  vertical: "top",
  horizontal: window.innerWidth < 600 ? "center" : "right",
}}            >
                <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ForgotPassword;
