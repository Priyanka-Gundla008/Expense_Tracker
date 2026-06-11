import React, { useState, useEffect } from "react";

import {
  Box,
  Typography,
  Button,
  useTheme,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  useMediaQuery,
  Stack
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import SearchIcon from "@mui/icons-material/Search";

import ExpenseForm from "../components/expenses/ExpenseForm";

import ExpenseList from "../components/expenses/ExpenseList";

import DeleteNotification from "../components/DeleteNotification";

import {
  getExpenses,
  deleteExpense,
  getTotalExpenseByCurrentMonth,
  searchExpenses
} from "../services/expenseService";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const monthMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};

function ExpensePage() {
  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("sm")
  );

  const currentYear = new Date().getFullYear();

  const [selectedYear, setSelectedYear] =
    useState("");

  const [selectedMonth, setSelectedMonth] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [expenses, setExpenses] = useState([]);

  const [curMonth, setCurMonth] = useState();

  const [curYear, setCurYear] = useState();

  const [totalExpenseByMonth, setTotalExpenseByMonth] =
    useState(0);

  const [openForm, setOpenForm] =
    useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [openDeleteDialog, setOpenDeleteDialog] =
    useState(false);

  const startYear = 2020;

  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => currentYear - index
  );

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // FETCH EXPENSES

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();

      setExpenses(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch expenses",
        error
      );
    }
  };

  // FETCH TOTAL EXPENSE

  const fetchTotalExpenseByCurrentMonth =
    async () => {
      try {
        const response =
          await getTotalExpenseByCurrentMonth();

        setTotalExpenseByMonth(
          response.data.totalExpense || 0
        );

        setCurMonth(response.data.month);

        setCurYear(response.data.year);
      } catch (error) {
        console.error(
          "Failed to fetch total expense by month",
          error
        );
      }
    };

  useEffect(() => {
    fetchExpenses();

    fetchTotalExpenseByCurrentMonth();
  }, []);

  // SEARCH FILTER

  useEffect(() => {
    const hasActiveFilters =
      selectedYear !== "" ||
      selectedMonth !== "" ||
      searchText.trim() !== "";

    if (hasActiveFilters) {
      fetchSearchExpense();
    } else {
      fetchExpenses();
    }
  }, [selectedYear, selectedMonth, searchText]);

  const fetchSearchExpense = async () => {
    try {
      const filters = {};

      if (selectedYear) {
        filters.year = selectedYear;
      }

      if (
        selectedMonth &&
        selectedMonth !== "All"
      ) {
        filters.month =
          monthMap[selectedMonth];
      }

      if (searchText.trim()) {
        filters.searchText =
          searchText.trim();
      }

      const response = await searchExpenses(
        filters
      );

      setExpenses(response.data);
    } catch (error) {
      console.error(
        "Failed to search expenses",
        error
      );
    }
  };

  // ADD EXPENSE

  const handleAddClick = () => {
    setEditingExpense(null);

    setOpenForm(true);
  };

  // DELETE EXPENSE

  const handleDeleteClick = (id) => {
    setDeleteId(id);

    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteExpense(deleteId);

      await fetchExpenses();
    } catch (error) {
      console.error(
        "Failed to delete expense",
        error
      );
    } finally {
      setOpenDeleteDialog(false);

      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);

    setDeleteId(null);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: {
          xs: 1.5,
          sm: 2,
          md: 3
        },
        background:
          theme.palette.background.default
      }}
    >
      {/* PAGE TITLE */}
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight={700}
        sx={{
          mb: {
            xs: 2,
            sm: 3
          }
        }}
        color="text.primary"
      >
        Expenses
      </Typography>

      {/* MAIN CARD */}
      <Card
        sx={{
          width: "100%",
          borderRadius: 3,
          backgroundColor:
            theme.palette.background.paper,
          p: {
            xs: 1,
            sm: 2,
            md: 3
          }
        }}
      >
        <CardContent>
          {/* TOP SECTION */}
          <Grid
            container
            spacing={3}
            alignItems="stretch"
          >
            {/* TOTAL EXPENSE CARD */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 3,
                  backgroundColor:
                    theme.palette.background
                      .primary
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: "0.85rem",
                        sm: "0.95rem"
                      }
                    }}
                  >
                    Total Expenses of{" "}
                    {months[curMonth - 1]}{" "}
                    {curYear}
                  </Typography>

                  <Typography
                    variant={
                      isMobile ? "h5" : "h4"
                    }
                    fontWeight={700}
                    color="primary.main"
                    sx={{ mt: 1 }}
                  >
                    ₹
                    {totalExpenseByMonth
                      ? totalExpenseByMonth
                      : 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* FILTERS */}
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row"
                  },
                  gap: 2,
                  alignItems: {
                    xs: "stretch",
                    sm: "center"
                  },
                  justifyContent: "flex-end",
                  flexWrap: "wrap",
                  height: "100%"
                }}
              >
                {/* YEAR */}
                <FormControl
                  size="small"
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 120
                    }
                  }}
                >
                  <InputLabel>
                    Year
                  </InputLabel>

                  <Select
                    label="Year"
                    value={selectedYear}
                    onChange={
                      handleYearChange
                    }
                  >
                    {years.map((year) => (
                      <MenuItem
                        key={year}
                        value={year}
                      >
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* MONTH */}
                <FormControl
                  size="small"
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 140
                    }
                  }}
                >
                  <InputLabel>
                    Month
                  </InputLabel>

                  <Select
                    label="Month"
                    value={selectedMonth}
                    onChange={
                      handleMonthChange
                    }
                  >
                    <MenuItem value="All">
                      All
                    </MenuItem>

                    {months.map((month) => (
                      <MenuItem
                        key={month}
                        value={month}
                      >
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* SEARCH */}

                <TextField
                  fullWidth={isMobile}
                  size="small"
                  placeholder="Search..."
                  value={searchText}
                  onChange={
                    handleSearchChange
                  }
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 220
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* ADD BUTTON */}
          <Box
            sx={{
              display: "flex",
              justifyContent: {
                xs: "center",
                sm: "flex-end"
              },
              mt: {
                xs: 3,
                sm: 4
              }
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddClick}
              startIcon={<AddIcon />}
              fullWidth={isMobile}
              sx={{
                borderRadius: 3,
                borderWidth: 2,
                textTransform: "none",
                maxWidth: {
                  xs: "100%",
                  sm: 220
                }
              }}
            >
              Add Expense
            </Button>
          </Box>

          {/* EXPENSE LIST */}
          <Box
            sx={{
              mt: {
                xs: 3,
                sm: 4
              }
            }}
          >
            <ExpenseList
              expenses={expenses}
              onEdit={(expense) => {
                setEditingExpense(
                  expense
                );
                setOpenForm(true);
              }}
              onDelete={
                handleDeleteClick
              }
            />
          </Box>

          {/* EXPENSE FORM */}
          <ExpenseForm
            open={openForm}
            onClose={() =>
              setOpenForm(false)
            }
            expenseId={editingExpense?.id}
            onSuccess={fetchExpenses}
            currentMonthExpense={
              fetchTotalExpenseByCurrentMonth
            }
          />
        </CardContent>
      </Card>

      {/* DELETE POPUP */}
      <DeleteNotification
        open={openDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        name={"expenses"}
      />
    </Box>
  );
}

export default ExpensePage;