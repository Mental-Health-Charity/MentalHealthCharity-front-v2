import {
    Autocomplete,
    Avatar,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUserQueryOptions } from "../../queries/searchUserQueryOptions";
import { Roles } from "../../constants";
import { User } from "../../../auth/types";
import useDebounce from "../../../shared/hooks/useDebounce";

interface Props {
    onChange: (user?: User) => void;
    onChangeSearchQuery?: (nickname: string) => void;
    value?: User;
    disabled?: boolean;
}

const SearchUser = ({
    onChange,
    value,
    onChangeSearchQuery,
    disabled,
}: Props) => {
    const [role, setRole] = useState<Roles | undefined>();
    const [username, setUsername] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    const debouncedValue = useDebounce(username, 500);

    const { data, refetch } = useQuery(
        searchUserQueryOptions({
            query: debouncedValue,
            role,
        })
    );

    useEffect(() => {
        if (onChangeSearchQuery) {
            onChangeSearchQuery(debouncedValue);
        }
    }, [debouncedValue]);

    useEffect(() => {
        if (debouncedValue) {
            setIsLoading(true);
            refetch()
                .then(() => setIsLoading(false))
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [debouncedValue, role]);

    const handleOptionChange = (selectedUser?: User) => {
        onChange(selectedUser || undefined);
    };

    return (
        <>
            <Autocomplete
                fullWidth
                freeSolo
                disabled={disabled}
                disablePortal
                options={data ? data.items : []}
                getOptionLabel={(option) =>
                    typeof option === "object" ? option.full_name : option
                }
                loading={isLoading}
                loadingText={<p>loading</p>}
                noOptionsText="Brak wyników"
                filterOptions={(options) => options}
                value={value || null}
                onChange={(_, user) =>
                    handleOptionChange(user as User | undefined)
                }
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.id}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Avatar
                                    variant="rounded"
                                    src={option.chat_avatar_url || ""}
                                />
                                <Box>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: "bold",
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        {option.full_name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: theme.palette.text.secondary,
                                        }}
                                    >
                                        {option.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </li>
                    );
                }}
                renderInput={(params) => (
                    <Box
                        sx={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <TextField
                            {...params}
                            label="Wyszukaj użytkownika"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                        <FormControl
                            sx={{
                                minWidth: "120px",
                            }}
                        >
                            <InputLabel id="Role">Role</InputLabel>
                            <Select
                                disabled={disabled}
                                labelId="Role"
                                value={role || ""}
                                onChange={(e) =>
                                    setRole(
                                        e.target.value === ""
                                            ? undefined
                                            : (e.target.value as Roles)
                                    )
                                }
                                variant="filled"
                            >
                                <MenuItem value={""}>Każda rola</MenuItem>
                                {Object.values(Roles).map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                )}
            />
        </>
    );
};

export default SearchUser;
