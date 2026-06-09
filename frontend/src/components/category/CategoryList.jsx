import React, { useState, useEffect } from "react";

import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  TablePagination,
  useTheme,
  useMediaQuery
} from "@mui/material";

import { deleteCategory } from "../../services/categoryService";

import CategoryForm from "./CategoryForm";

import DeleteNotification from "../DeleteNotification";

import AddIcon from "@mui/icons-material/Add";

import RestaurantIcon from "@mui/icons-material/Restaurant";

import ReceiptIcon from "@mui/icons-material/Receipt";

import FlightIcon from "@mui/icons-material/Flight";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import MovieIcon from "@mui/icons-material/Movie";

import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import SchoolIcon from "@mui/icons-material/School";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

import PetsIcon from "@mui/icons-material/Pets";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";

import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function CategoryList({ categoriesList = [], getAPI }) {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openForm, setOpenForm] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(
    isSmallScreen ? 3 : 9
  );

  const categoryIcons = {
    Food: <RestaurantIcon />,
    Bills: <ReceiptIcon />,
    Travel: <FlightIcon />,
    Shopping: <ShoppingCartIcon />,
    Entertainment: <MovieIcon />,
    Health: <LocalHospitalIcon />,
    Education: <SchoolIcon />,
    Fitness: <FitnessCenterIcon />,
    Pets: <PetsIcon />,
    Transport: <DirectionsCarIcon />,
    Mobile: <PhoneAndroidIcon />,
    Subscriptions: <SubscriptionsIcon />
  };

  const totalItems = categoriesList.length;

  const rowsPerPageOptions = isSmallScreen ? [] : [9, 14, 24];

  const paginatedCategories = categoriesList.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    setRowsPerPage(isSmallScreen ? 3 : 9);

    setPage(0);
  }, [isSmallScreen]);

  const handleDelete = (id) => {
    setDeleteCategoryId(id);

    setOpenConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(deleteCategoryId);

      await getAPI();
    } catch (error) {
      console.error("Failed to delete category", error);
    } finally {
      setOpenConfirmDelete(false);

      setDeleteCategoryId(null);
    }
  };

  const cancelDelete = () => {
    setOpenConfirmDelete(false);

    setDeleteCategoryId(null);
  };

  return (
    <>
      {/* CATEGORY GRID */}

      <Box
        sx={{
          display: "grid",

          width: "100%",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)"
          },

          gap: {
            xs: 2,
            sm: 2.5,
            md: 3
          },

          alignItems: "stretch",

          px: {
            xs: 1,
            sm: 2,
            md: 3
          }
        }}
      >
        {/* ADD CATEGORY CARD */}

<Box onClick={() => { setSelectedCategory(null); setOpenForm(true); }} sx={{ p: { xs: 2, sm: 2.5, md: 2 }, minHeight: { xs: 180, sm: 190, md: 180, lg: 170, xl: 150 }, borderRadius: "20px", textAlign: "center", border: "2px dashed", borderColor: theme.palette.primary.main, color: theme.palette.primary.main, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "0.3s", "&:hover": { backgroundColor: theme.palette.action.hover } }} >          <Avatar
            sx={{
              mb: 1.5,

              width: {
                xs: 40,
                sm: 44,
                md: 48
              },

              height: { 
                xs: 40,
                sm: 44,
                md: 48,
              },

              bgcolor: "transparent",

              border: "2px dashed",

              borderColor: theme.palette.primary.main,

              color: theme.palette.primary.main
            }}
          >
            <AddIcon fontSize="small" />
          </Avatar>

          <Typography
            fontWeight={700}
            sx={{
              fontSize: {
                xs: 15,
                sm: 16,
                md: 16
              }
            }}
          >
            Add Category
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: 12,
                sm: 13,
                md: 13
              }
            }}
          >
            Create a new category
          </Typography>
        </Box>

        {/* CATEGORY CARDS */}

        {paginatedCategories.map((cat, index) => (
          <Card
            key={index}
            onClick={() => {
              setSelectedCategory(cat);

              setOpenForm(true);
            }}
            sx={{
              width: "100%",

              height: "100%",

              borderRadius: 3,

              boxShadow: 5,

              transition: "0.3s",

              cursor: "pointer",

              "&:hover": {
                transform: "translateY(-4px)",

                boxShadow: 8
              }
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2,
                  sm: 2.5,
                  md: 2
                },

                height: "100%"
              }}
            >
              <Box
                sx={{
                  position: "relative",

                  width: "100%",

                  height: "100%",

                  minHeight: {
                    xs: 180,
                    sm: 190,
                    md: 190
                  },

                  borderRadius: "20px",

                  textAlign: "center",

                  background: "#fff",

                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",

                  display: "flex",

                  flexDirection: "column",

                  justifyContent: "center",

                  alignItems: "center",

                  p: 2,

                  "&::before": {
                    content: '""',

                    position: "absolute",

                    inset: 0,

                    borderRadius: "20px",

                    padding: "2px",

                    background:
                      "linear-gradient(135deg, #81c784, #66bb6a)",

                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",

                    WebkitMaskComposite: "xor",

                    maskComposite: "exclude"
                  }
                }}
              >
                {/* DELETE ICON */}

                <DeleteOutlineIcon
                  sx={{
                    position: "absolute",

                    top: 8,

                    right: 8,

                    fontSize: {
                      xs: 20,
                      sm: 22,
                      md: 22
                    },

                    color: "error.main",

                    cursor: "pointer",

                    zIndex: 10
                  }}
                  onClick={(e) => {
                    e.stopPropagation();

                    handleDelete(cat.id);
                  }}
                />

                {/* ICON */}

                <Avatar
                  sx={{
                    mb: 1.5,

                    width: {
                      xs: 40,
                      sm: 44,
                      md: 48
                    },

                    height: {
                      xs: 40,
                      sm: 44,
                      md: 48
                    },

                    bgcolor: "#e8f5e9",

                    color: "#2e7d32"
                  }}
                >
                  {categoryIcons[cat.icon]}
                </Avatar>

                {/* NAME */}

                <Typography
                  fontWeight={700}
                  variant="h6"
                  sx={{
                    fontSize: {
                      xs: 15,
                      sm: 16,
                      md: 16
                    }
                  }}
                >
                  {cat.name}
                </Typography>

                {/* DESCRIPTION */}

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: "center",

                    fontSize: {
                      xs: 12,
                      sm: 13,
                      md: 13
                    }
                  }}
                >
                  Manage {cat.name.toLowerCase()} expenses
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* PAGINATION */}

      {totalItems > 0 && (
        <Box
          sx={{
            width: "100%",

            display: "flex",

            justifyContent: {
              xs: "center",
              md: "flex-end"
            },

            mt: {
              xs: 3,
              sm: 4
            },

            px: {
              xs: 1,
              sm: 2,
              md: 3
            }
          }}
        >
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));

              setPage(0);
            }}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        </Box>
      )}

      {/* CATEGORY FORM */}

      <CategoryForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        category={selectedCategory}
        categoryId={selectedCategory?.id}
        onSuccess={getAPI}
        usedIcons={categoriesList.map((c) => c.icon)}
      />

      {/* DELETE CONFIRMATION */}

      <DeleteNotification
        open={openConfirmDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        name={"category"}
      />
    </>
  );
}

export default CategoryList;