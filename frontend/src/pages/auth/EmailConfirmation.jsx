// pages/PasswordResetConfirmation.jsx

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useLocation } from "react-router-dom";

function PasswordResetConfirmation() {
  const theme = useTheme();
  const navigate = useNavigate();
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
        px: {
          xs: 2,
          sm: 3,
        },
        py: {
          xs: 2,
          sm: 0,
        },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: {
            xs: 380,
            sm: 450,
            md: 500,
          },
          borderRadius: {
            xs: 2,
            sm: 3,
          },
          boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)",
          backgroundColor: theme.palette.background.paper,
          textAlign: "center",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              sm: 4,
            },
          }}
        >
          <CheckCircleOutlineIcon
            sx={{
              color: theme.palette.success.main,
              mb: 2,
              fontSize: {
                xs: 55,
                sm: 65,
              },
            }}
          />

          <Typography
            sx={{
              mb: 2,
              fontWeight: 700,
              fontSize: {
                xs: "1.5rem",
                sm: "1.8rem",
              },
            }}
          >
            Reset Link Sent!
          </Typography>

          <Typography
            sx={{
              mb: 3,
              color: theme.palette.text.secondary,
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
              lineHeight: 1.7,
              wordBreak: "break-word",
            }}
          >
            We have sent a password reset link to
            <br />
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {email}
            </Typography>
            .
            <br />
            Please check your inbox and follow the instructions to reset your
            password.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/login")}
            sx={{
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
            Back to Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PasswordResetConfirmation;
