import { Box, Button, IconButton } from "@mui/material";
import SimpleCard from "../SimpleCard";
import { useTranslation } from "react-i18next";
import useTheme from "../../../../theme";
import wave_icon from "../../../../assets/static/wave.svg";
import FacebookIcon from "@mui/icons-material/Facebook";

const AboutUs = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        position: "relative",
        padding: "50px 0",

        "&::before": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "420px",
          backgroundImage: `url(${wave_icon})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top",
          zIndex: 0,
          transform: "rotate(180deg)",
        },
      }}
    >
      <Box
        zIndex={1}
        display="flex"
        gap={8}
        flexDirection="column"
        maxWidth={1650}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <SimpleCard
            key={index}
            subtitle={t("homepage.about_us.about_us_card.subtitle")}
            title={t("homepage.about_us.about_us_card.title")}
            text={t("homepage.about_us.about_us_card.text")}
          >
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box display="flex" gap={2}>
                <Button variant="contained">
                  {t("homepage.choose_volunteer_button")}
                </Button>
                <Button variant="outlined">
                  {t("homepage.choose_mentee_button")}
                </Button>
              </Box>
              <IconButton
                sx={{
                  color: theme.palette.text.primary,
                  padding: "10px",
                  width: "50px",
                  height: "50px",
                  backgroundColor: theme.palette.colors.accent,
                  borderRadius: "50%",
                }}
              >
                <FacebookIcon fontSize="large" />
              </IconButton>
            </Box>
          </SimpleCard>
        ))}
      </Box>
    </Box>
  );
};

export default AboutUs;
