import { useTranslation } from "react-i18next";
import SimpleCard from "../../../shared/components/SimpleCard";
import Markdown from "../../../shared/components/Markdown";

interface Props {
  content: string;
}

const UserProfileDescription = ({ content }: Props) => {
  const { t } = useTranslation();
  return (
    <SimpleCard
      subtitleProps={{
        fontSize: "20px",
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",

        "& div": {
          padding: "0",
          fontSize: "18px",
        },
      }}
      subtitle={t("profile.description_subtitle")}
    >
      <Markdown readOnly content={content} />
    </SimpleCard>
  );
};

export default UserProfileDescription;
