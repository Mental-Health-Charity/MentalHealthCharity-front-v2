import { Box, Typography } from "@mui/material";
import { Roles } from "../../constants";
import ChangeAvatar from "../ChangeAvatar";
import { useState } from "react";

interface Props {
  username: string;
  role: Roles;
  avatar_url?: string;
  isOwner: boolean;
  onSubmit: (values: { avatar: string }) => void;
}

const UserProfileHeading = ({
  role,
  username,
  avatar_url,
  isOwner,
  onSubmit,
}: Props) => {
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
        <ChangeAvatar
          disabled={!isOwner}
          avatar={avatar_url}
          username={username}
          onSubmit={onSubmit}
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
            {username}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfileHeading;
