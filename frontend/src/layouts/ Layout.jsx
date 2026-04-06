// import { Box } from "@mui/material";
// import Sidebar from "../components/ Sidebar";
// import Header from "../components/Header";
// import { Outlet } from "react-router-dom";

// function Layout({ darkMode, toggleDarkMode }) {
//   return (
//     <Box sx={{ display: "flex" }}>
//       <Sidebar />

//       <Box sx={{ flexGrow: 1 }}>
//         <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }

// export default Layout;

import { useState } from "react";
import Sidebar from "../components/ Sidebar";
import Header from "../components/Header";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />

      <Box sx={{ flexGrow: 1 }}>
        <Header toggleSidebar={handleDrawerToggle} />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;