// pages/PasswordResetConfirmation.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Button, useTheme } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate , useLocation } from "react-router-dom";

function PasswordResetConfirmation() {
    const theme = useTheme();
    const navigates = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "your email";

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
                    backdropFilter: "blur(10px)",
                    backgroundColor: theme.palette.background.paper,
                    textAlign: "center",
                    p: 4,
                }}
            >
                <CardContent>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2 }}
                    />
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                        Reset Link Sent!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>
                        We have sent a password reset link to <b>{email}</b>.
                        <br />
                        Please check your inbox and follow the instructions to reset your password.
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigates("/login")}
                        sx={{
                            py: 1.5,
                            borderRadius: "15px",
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            "&:hover": {
                                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                            },
                        }}
                    >
                        Back to Login
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}

export default PasswordResetConfirmation;
