export const getLocale = () => localStorage.getItem("locale") || "pl";
export const setLocale = (locale: string) => {
  localStorage.setItem("locale", locale);
};
