// components/dashboard/IncomeDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  useTheme
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

function IncomeDialog({
  open,
  onClose,
  incomeValue,
  setIncomeValue,
  onSave,
}) {
  const theme = useTheme();
  const [error, setError] = useState("");

  // useEffect(() => {
  //   validateIncome(incomeValue);
  // }, [incomeValue]);

  const validateIncome = (value) => {
    if (value === "" || value === null) {
      setError("Income is required");
      return false;
    }

    if (Number(value) <= 0) {
      setError("Income must be greater than 0");
      return false;
    }

    setError("");
    return true;
  };

  const handleSave = () => {
    if (validateIncome(incomeValue)) {
      onSave();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        color="text.color"
        sx={{ display: "flex", alignItems: "center", gap: 1, pt:3 }}
      >
        Add / Update Total Income
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          margin="normal"
          label="Total Income"
          type="number"
          value={incomeValue ?? ""}
          onChange={(e) => setIncomeValue(e.target.value)}
          variant="outlined"
          helperText={error}
          FormHelperTextProps={{ sx: { color: "error.main", ml: 0 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoneyIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: "15px" },
          }}
        />

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 2 }}>

        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          sx={{
            borderRadius: "15px",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
            },
          }}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default IncomeDialog;
