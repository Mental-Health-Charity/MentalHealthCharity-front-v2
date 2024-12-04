import { t } from "i18next";

export enum Roles {
  ADMIN = "ADMIN",
  VOLUNTEER = "VOLUNTEER",
  USER = "USER",
  REDACTOR = "REDACTOR",
  VOLUNTEERSUPERVISOR = "VOLUNTEERSUPERVISOR",
}

export const translatedRoles = {
  [Roles.ADMIN]: t("common.roles.admin"),
  [Roles.VOLUNTEER]: t("common.roles.volunteer"),
  [Roles.USER]: t("common.roles.user"),
  [Roles.REDACTOR]: t("common.roles.redactor"),
  [Roles.VOLUNTEERSUPERVISOR]: t("common.roles.volunteer_supervisor"),
};
