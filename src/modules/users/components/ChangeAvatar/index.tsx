import {
  Avatar,
  Box,
  Button,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { ChangeAvatarButton } from "./styles";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Modal from "../../../shared/components/Modal";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

interface Props {
  avatar?: string;
  username: string;
  disabled?: boolean;
  onSubmit: (values: { avatar: string }) => void;
}

const ChangeAvatar = ({ avatar, username, disabled, onSubmit }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [showModal, setShowModal] = useState(false);

  const validationSchema = Yup.object({
    avatar: Yup.string()
      .url(t("validation.invalid_url"))
      .required(t("validation.required")),
  });

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Avatar
        sx={{
          width: "165px",
          height: "165px",
        }}
        src={avatar}
        variant="rounded"
        alt={username}
      />
      <ChangeAvatarButton
        onClick={() => setShowModal(true)}
        disabled={disabled}
      >
        <CameraAltIcon
          fontSize="large"
          sx={{
            color: theme.palette.text.primary,
          }}
        />
      </ChangeAvatarButton>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={t("profile.change_avatar_title")}
      >
        <Box>
          <Typography
            sx={{
              maxWidth: "400px",
              margin: "10px 0 20px 0",
            }}
            color="text.secondary"
          >
            {t("profile.change_avatar_tutorial")}
          </Typography>
          <Formik
            initialValues={{
              avatar: "",
            }}
            onSubmit={(val) => {
              onSubmit(val);
              setShowModal(false);
            }}
            validationSchema={validationSchema}
          >
            <Form>
              <Field
                as={TextField}
                name="avatar"
                type="text"
                label={t("profile.change_avatar_label")}
                fullWidth
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                sx={{
                  padding: "3px 0",
                  marginTop: "20px",
                }}
                variant="contained"
              >
                {t("common.submit")}
              </Button>
            </Form>
          </Formik>
        </Box>
      </Modal>
    </Box>
  );
};

export default ChangeAvatar;
