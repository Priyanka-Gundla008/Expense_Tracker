import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  InputAdornment,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";

export default function PersonalDetailsTab({ user, editing, onChange, onSave, onCancel }) {
  const theme = useTheme();

  return (
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 3,
  }}
>
      {/* Name */}
      {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}> */}
      <Box>
         <TextField
          label="Name"
          value={user?.name || ""}
          onChange={onChange("name")}
          disabled={!editing}
          fullWidth
          InputProps={{
            sx: { borderRadius: "15px" },
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
       

      {/* Mobile */}
      {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}> */}
      <Box>
        <TextField
          label="Mobile Number"
          value={user?.mobile || ""}
          onChange={onChange("mobile")}
          disabled={!editing}
          fullWidth
          InputProps={{
            sx: { borderRadius: "15px" },
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        </Box>
      {/* </Grid> */}

      {/* Email */}
      {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}> */}
        <Box>
        <TextField
          label="Email"
          value={user?.email || ""}
          disabled
          fullWidth
          InputProps={{
            sx: { borderRadius: "15px" },
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        </Box>
      {/* </Grid> */}

      {/* Address */}
      {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}> */}
      <Box>
        <TextField
          label="Address"
          value={user?.address || ""}
          onChange={onChange("address")}
          disabled={!editing}
          fullWidth
          InputProps={{
            sx: { borderRadius: "15px" },
            startAdornment: (
              <InputAdornment position="start">
                <HomeIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        </Box>
      {/* </Grid> */}

      {/* Designation */}
      {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}> */}
        <Box>
        <TextField
          label="Designation"
          value={user?.designation || ""}
          onChange={onChange("designation")}
          disabled={!editing}
          fullWidth
          InputProps={{
            sx: { borderRadius: "15px" },
            startAdornment: (
              <InputAdornment position="start">
                <WorkIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* Company */}
      {/* <Grid item xs={12} sm={6} md={6} lg={6} xl={6}> */}
        <Box>
        <TextField
          label="Company"
          value={user?.company || ""}
          onChange={onChange("company")}
          disabled={!editing}
          fullWidth
          InputProps={{
            sx: { borderRadius: "15px" },
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
     </Box>
      {/* Divider — always visible */}
 <Box sx={{ gridColumn: "1 / -1" }}>
  <Divider />
</Box>
      {/* Save Changes + Cancel — only in edit mode */}
   {editing && (
    
    <Box
      sx={{
            gridColumn: "1 / -1",

        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", sm: "row", md: "row", lg: "row", xl: "row" },
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 2,
      }}
    >
        

      <Button
        onClick={onCancel}
        sx={{
          py: 1,
          px: 3,
          borderRadius: "15px",
        }}
      >
        Cancel
      </Button>

      <Button
        type="submit"
        variant="contained"
        onClick={onSave}
        sx={{
          py: 1,
          px: 3,
                      width: { xs: "100%", sm: "auto", md: "auto" },

        //   fontWeight: 600,
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
)}

    </Box>
  );
}