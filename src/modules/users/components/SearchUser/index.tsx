import {
  Autocomplete,
  Avatar,
  Box,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { searchUserQueryOptions } from "../../queries/searchUserQueryOptions";
import { Roles } from "../../constants";
import { useState, useCallback, useMemo } from "react";
import { User } from "../../../auth/types";
import debounce from "lodash.debounce";

const SearchUser = () => {
  const [role, setRole] = useState<Roles | undefined>();
  const [username, setUsername] = useState<string>("");
  const theme = useTheme();
  const [selectedUser, setSelectedUser] = useState<User | undefined | null>();

  const debouncedSetUsername = useMemo(
    () => debounce((value: string) => setUsername(value), 500),
    []
  );

  const { data } = useQuery(
    searchUserQueryOptions(
      {
        query: username,
        role: role,
      },
      {
        enabled: !!username,
      }
    )
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSetUsername(event.target.value);
    },
    [debouncedSetUsername]
  );

  return (
    <Autocomplete
      fullWidth
      renderOption={(props, option) => (
        <ListItem
          sx={{
            gap: "10px",
          }}
          {...props}
        >
          <Avatar variant="rounded" />
          <Box>
            <ListItemText
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: "bold",
                margin: 0,
                padding: 0,
              }}
            >
              {option.full_name}
            </ListItemText>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: "12px !important",
              }}
            >
              {option.email}
            </Typography>
          </Box>
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          label="Wyszukaj użytkownika"
          onChange={handleChange}
          value={username}
          {...params}
        />
      )}
      options={data ? data.items : []}
      value={selectedUser}
      onChange={(_, user) => setSelectedUser(user)}
    />
  );
};

export default SearchUser;
