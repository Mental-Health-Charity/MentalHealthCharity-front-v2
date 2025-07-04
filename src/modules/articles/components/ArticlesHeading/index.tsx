import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Button, Card, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Permissions } from "../../../shared/constants";
import usePermissions from "../../../shared/hooks/usePermissions";

interface Props {
    onSearch: (query: string) => void;
    search: string;
}

const ArticlesHeading = ({ onSearch, search }: Props) => {
    const { t } = useTranslation();
    const { hasPermissions } = usePermissions();

    return (
        <>
            <Card
                style={{
                    width: "100%",
                    margin: "0 auto 20px auto",
                    padding: "15px",
                }}
            >
                <Box sx={{ display: "flex", gap: "20px", flexWrap: { xs: "wrap", md: "nowrap" } }}>
                    <TextField
                        label={t("common.search")}
                        fullWidth
                        variant="filled"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    {hasPermissions(Permissions.CREATE_ARTICLE) && (
                        <Button
                            fullWidth
                            component={Link}
                            to="/articles/dashboard"
                            variant="contained"
                            sx={{ gap: "5px", width: "300px" }}
                        >
                            <AddCircleIcon fontSize="large" />
                            {t("articles.add_article")}
                        </Button>
                    )}
                </Box>
            </Card>
        </>
    );
};

export default ArticlesHeading;
