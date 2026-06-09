import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  InputAdornment,
  useTheme,
  MenuItem,
  Box,
  Stack,
  useMediaQuery
} from "@mui/material";

import {
  createCategory,
  updateCategory,
  getCategoryById
} from "../../services/categoryService";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import CategoryIcon from "@mui/icons-material/Category";

import { CATEGORY_ICON_MAP } from "./icons";

const NAME_REGEX = /^[a-zA-Z0-9 ]+$/;
const ICON_REGEX = /^[a-zA-Z0-9_-]+$/;

function CategoryForm({
  open,
  onClose,
  onSuccess,
  category,
  categoryId,
  usedIcons = []
}) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const usedIconSet = new Set(usedIcons);

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryIcon: ""
  });

  const [errors, setErrors] = useState({
    categoryName: "",
    categoryIcon: ""
  });

  const resetForm = () => {
    setFormData({
      categoryName: "",
      categoryIcon: ""
    });

    setErrors({
      categoryName: "",
      categoryIcon: ""
    });
  };

  const validate = () => {
    let valid = true;

    const newErrors = {
      categoryName: "",
      categoryIcon: ""
    };

    const { categoryName, categoryIcon } = formData;

    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
      valid = false;
    } else if (categoryName.length > 50) {
      newErrors.categoryName = "Max 50 characters allowed";
      valid = false;
    } else if (!NAME_REGEX.test(categoryName)) {
      newErrors.categoryName =
        "Only letters, numbers and spaces allowed";
      valid = false;
    }

    if (!categoryIcon.trim()) {
      newErrors.categoryIcon = "Icon is required";
      valid = false;
    } else if (categoryIcon.length > 50) {
      newErrors.categoryIcon = "Max 50 characters allowed";
      valid = false;
    } else if (!ICON_REGEX.test(categoryIcon)) {
      newErrors.categoryIcon =
        "Only letters, numbers, _ and - allowed";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  useEffect(() => {
    if (!categoryId || !open) {
      resetForm();
      return;
    }

    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(categoryId);

        setFormData({
          categoryName: response.data.name || "",
          categoryIcon: response.data.icon || ""
        });
      } catch (error) {
        console.error("Failed to fetch category", error);
      }
    };

    fetchCategory();
  }, [categoryId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const categoryData = {
        name: formData.categoryName,
        icon: formData.categoryIcon
      };

      if (categoryId) {
        await updateCategory(categoryId, categoryData);
      } else {
        await createCategory(categoryData);
      }

      onSuccess();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to save category", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
    >
      {/* TITLE */}

      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: { xs: 18, sm: 20 }
        }}
      >
        {category ? <EditIcon /> : <AddIcon />}
        {category ? "Edit Category" : "Add Category"}
      </DialogTitle>

      <Divider />

      {/* FORM */}

      <DialogContent
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 }
        }}
      >
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Category Name"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            helperText={errors.categoryName}
            FormHelperTextProps={{
              sx: { color: "error.main", ml: 0 }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryIcon />
                </InputAdornment>
              )
            }}
          />

          <TextField
            select
            fullWidth
            label="Select Icon"
            name="categoryIcon"
            value={formData.categoryIcon}
            onChange={handleChange}
            helperText={errors.categoryIcon}
            FormHelperTextProps={{
              sx: { color: "error.main", ml: 0 }
            }}
          >
            {Object.keys(CATEGORY_ICON_MAP).map((key) => {
              const isUsed =
                usedIconSet.has(key) && key !== category?.iconKey;

              return (
                <MenuItem key={key} value={key} disabled={isUsed}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: { xs: 14, sm: 16 }
                    }}
                  >
                    {CATEGORY_ICON_MAP[key]}
                    {key}
                    {isUsed && " (Used)"}
                  </Box>
                </MenuItem>
              );
            })}
          </TextField>
        </Stack>
      </DialogContent>

      <Divider />

      {/* ACTION BUTTONS */}

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1
        }}
      >
        <Button
          fullWidth={isMobile}
          onClick={() => {
            resetForm();
            onClose();
          }}
        >
          Cancel
        </Button>

        <Button
          fullWidth={isMobile}
          variant="contained"
          onClick={handleSave}
          sx={{
            borderRadius: "15px",
            background: `linear-gradient(135deg,
              ${theme.palette.primary.main},
              ${theme.palette.secondary.main})`
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryForm;