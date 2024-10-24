import { Box } from "@mui/material";
import { AdminSidebar } from "../modules/shared/components/AdminSidebar";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../modules/shared/components/Dashboard";

const AdminScreen = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#EBEBEB",
      }}
    >
      <AdminSidebar
        open={isSidebarOpen}
        handleToggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users/" element={<div>Users</div>} />
          <Route path="/forms/" element={<div>Users</div>} />
          <Route path="/reports/" element={<div>Users</div>} />
          <Route path="/chats/" element={<div>Users</div>} />
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminScreen;
