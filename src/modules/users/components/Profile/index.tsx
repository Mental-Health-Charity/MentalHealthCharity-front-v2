import { Avatar, Box, Typography } from "@mui/material";

const UserProfileHeading = () => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: "20px",
        }}
      >
        <Avatar
          sx={{
            width: "165px",
            height: "165px",
          }}
          variant="rounded"
          alt="A"
        />
        <Box>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: "24px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Jan Kowalski
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Wolontariusz
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfileHeading;
