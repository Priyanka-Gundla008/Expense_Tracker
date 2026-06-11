import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  TablePagination,
  Box,
  Button,
  Stack,
  useMediaQuery,
  Card,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

function ExpenseList({ expenses = [], onEdit, onDelete }) {
  const theme = useTheme();

  const isLight = theme.palette.mode === "light";

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // PAGINATION

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 3 : 5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);
  };

  // PAGINATED DATA

  const paginatedExpenses = expenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      {/* MOBILE VIEW */}

      {/* MOBILE VIEW */}

      {isMobile ? (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {paginatedExpenses.map((expense, index) => (
              <Card
                key={expense.id}
                sx={{
                  borderRadius: 3,

                  boxShadow: 4,

                  width: "100%",

                  overflow: "hidden",

                  transition: "0.3s",

                  "&:hover": {
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 2,
                  }}
                >
                  <Stack spacing={1.5}>
                    {/* TOP ROW */}

                    <Box
                      sx={{
                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",
                      }}
                    >
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: "0.9rem",
                        }}
                      >
                        #{page * rowsPerPage + index + 1}
                      </Typography>

                      <Box
                        sx={{
                          px: 1.5,

                          py: 0.5,

                          borderRadius: "8px",

                          backgroundColor: "#d1f9d5ff",

                          fontWeight: 700,

                          fontSize: "0.85rem",

                          whiteSpace: "nowrap",
                        }}
                      >
                        ₹ {expense.amount}
                      </Box>
                    </Box>

                    {/* TITLE */}

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        fontSize: {
                          xs: "1rem",
                          sm: "1.1rem",
                        },

                        wordBreak: "break-word",
                      }}
                    >
                      {expense.title}
                    </Typography>

                    {/* CATEGORY */}

                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.95rem",
                        },

                        wordBreak: "break-word",
                      }}
                    >
                      <strong>Category :</strong> {expense.category?.name}
                    </Typography>

                    {/* DATE */}

                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.95rem",
                        },
                      }}
                    >
                      <strong>Date :</strong> {expense.date}
                    </Typography>

                    {/* BUTTONS */}

                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={1.5}
                      mt={1}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        color="edit"
                        startIcon={<EditIcon />}
                        sx={{
                          borderRadius: "10px",

                          textTransform: "none",

                          fontWeight: 600,

                          py: 1,
                        }}
                        onClick={() => onEdit(expense)}
                      >
                        Edit
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{
                          borderRadius: "10px",

                          textTransform: "none",

                          fontWeight: 600,

                          py: 1,
                        }}
                        onClick={() => onDelete(expense.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Card>
            ))}
          </Box>

          {/* MOBILE PAGINATION */}

          <Box
            sx={{
              mt: 3,

              display: "flex",

              justifyContent: "center",

              width: "100%",
            }}
          >
            <TablePagination
              component="div"
              count={expenses.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[3, 5, 10]}
              sx={{
                ".MuiTablePagination-toolbar": {
                  flexWrap: "wrap",

                  justifyContent: "center",

                  gap: 1,

                  px: 0,
                },

                ".MuiTablePagination-selectLabel": {
                  fontSize: "0.8rem",
                },

                ".MuiTablePagination-displayedRows": {
                  fontSize: "0.8rem",
                },
              }}
            />
          </Box>
        </>
      ) : (
        /* DESKTOP TABLE VIEW */

        <TableContainer
          component={Paper}
          sx={{
            overflowX: "auto",
            borderRadius: 3,
            boxShadow: 4,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Table>
            {/* TABLE HEAD */}

            <TableHead>
              <TableRow
                sx={{
                  background: isLight
                    ? `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.main})`
                    : theme.palette.background.paper,
                }}
              >
                {["S.No", "Title", "Category", "Amount", "Date", "Actions"].map(
                  (head) => (
                    <TableCell
                      key={head}
                      align="center"
                      sx={{
                        fontWeight: 700,

                        fontSize: {
                          sm: "0.9rem",
                          md: "1rem",
                          lg: "1.1rem",
                        },

                        color: isLight ? "#fff" : theme.palette.text.primary,

                        whiteSpace: "nowrap",
                      }}
                    >
                      {head}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>

            {/* TABLE BODY */}

            <TableBody>
              {paginatedExpenses.map((expense, index) => (
                <TableRow key={expense.id} hover>
                  {/* SERIAL NUMBER */}

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: {
                        sm: "0.85rem",
                        md: "0.95rem",
                      },
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  {/* TITLE */}

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: {
                        sm: "0.85rem",
                        md: "0.95rem",
                      },
                    }}
                  >
                    {expense.title}
                  </TableCell>

                  {/* CATEGORY */}

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: {
                        sm: "0.85rem",
                        md: "0.95rem",
                      },
                    }}
                  >
                    {expense.category?.name}
                  </TableCell>

                  {/* AMOUNT */}

                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "inline-block",

                        px: {
                          sm: 1.5,
                          md: 2,
                        },

                        py: 0.5,

                        borderRadius: "10px",

                        backgroundColor: "#d1f9d5ff",

                        color: theme.palette.text.primary,

                        fontWeight: 700,

                        fontSize: {
                          sm: "0.85rem",
                          md: "0.95rem",
                        },

                        minWidth: {
                          sm: 70,
                          md: 90,
                        },
                      }}
                    >
                      ₹ {expense.amount}
                    </Box>
                  </TableCell>

                  {/* DATE */}

                  <TableCell
                    align="center"
                    sx={{
                      fontSize: {
                        sm: "0.85rem",
                        md: "0.95rem",
                      },

                      whiteSpace: "nowrap",
                    }}
                  >
                    {expense.date}
                  </TableCell>

                  {/* ACTIONS */}

                  <TableCell align="center">
                    <Stack
                      direction={{
                        sm: "column",
                        md: "row",
                      }}
                      spacing={1}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        color="edit"
                        startIcon={<EditIcon />}
                        sx={{
                          borderRadius: "10px",

                          textTransform: "none",

                          fontWeight: 600,

                          minWidth: {
                            sm: 90,
                            md: 70,
                          },
                        }}
                        onClick={() => onEdit(expense)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{
                          borderRadius: "10px",

                          textTransform: "none",

                          fontWeight: 600,

                          minWidth: {
                            sm: 90,
                            md: 70,
                          },
                        }}
                        onClick={() => onDelete(expense.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* PAGINATION */}

          <TablePagination
            component="div"
            count={expenses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}
    </>
  );
}

export default ExpenseList;
