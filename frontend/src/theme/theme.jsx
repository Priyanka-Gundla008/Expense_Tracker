import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#FF6D00" },       
    secondary: { main: "#fb9c53ff" },     
    success: { main: "#00C853" },       
    error: { main: "#FF1744" },         
    edit: {main: "#0770f9ff"},
    background: {
      default: "linear-gradient(135deg, #fae5c6ff 0%, #FFF3E0 100%)",
      paper: "#ffffff",                
      // primary: "linear-gradient(135deg, #f9ebddff 0%, #fcf8f3ff 100%)"
      primary: "#fcf8f3ff"
    },
    text: {
      primary: "#1a1a1a",             
      // secondary: "#FF6D00"
      color: "#FF6D00",
      amount: "#3be72cff",

    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#2575FC" },
        secondary: { main: "#6A11CB" },
        success: { main: "#00C853" },
        error: { main: "#FF1744" },
        background: {
            default: "#282828ff",
            paper: "#1e1e1e",
        },
        text: {
            primary: "#ffffff",
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
    },
});
