import React, { useEffect, useState } from "react";
import { createTheme, LinkProps, Theme } from "@mui/material";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import UbuntuRegular from "../public/fonts/Ubuntu/Ubuntu-Regular.ttf";

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

declare module "@mui/material/styles" {
  interface Theme {
    colors: {
      accent: string;
      danger: string;
      info: string;
      warning: string;
      success: string;
      dark: string;
    };

    gradients: {
      primary: string;
      dark: string;
    };

    shadows: {
      text: string;
      box: string;
    };
  }
  interface Palette {
    colors: {
      accent: string;
      danger: string;
      info: string;
      warning: string;
      success: string;
      dark: string;
    };

    gradients: {
      primary: string;
      dark: string;
    };

    shadows: {
      text: string;
      box: string;
    };
  }
  interface PaletteOptions {
    colors: {
      accent: string;
      danger: string;
      info: string;
      warning: string;
      success: string;
      dark: string;
    };

    gradients: {
      primary: string;
      dark: string;
    };

    shadows: {
      text: string;
      box: string;
    };
  }
}

const useTheme = () => {
  const customTheme = createTheme({
    typography: {
      fontFamily: "Ubuntu, sans-serif",
    },
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as LinkProps,
      },
      MuiListItemButton: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            color: "#153243",
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "filled",
        },
        styleOverrides: {
          root: {
            input: {
              color: "#153243",
            },
            textarea: {
              color: "#153243",
            },
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "#153243",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            backgroundColor: "#FFC05C",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: "#FFC05C",
          },
          containedPrimary: {
            backgroundColor: "#FFC05C",
            color: "#F5F9F9",
            padding: "10px 20px",
            borderRadius: "4px",
            fontSize: "20px",
            fontWeight: 700,
          },
          outlinedPrimary: {
            border: "4px solid #FFC05C",
            color: "#FFC05C",
            padding: "6px 20px",
            borderRadius: "4px",
            fontSize: "20px",
            fontWeight: 700,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          "@font-face": {
            fontFamily: "Ubuntu",
            src: `url(${UbuntuRegular}) format('truetype')`,
          },
          "::-webkit-scrollbar": { width: "8px" },
        },
      },
    },
    palette: {
      mode: "light",
      text: {
        primary: "#F5F9F9",
        secondary: "#153243",
      },
      primary: {
        main: "#00D8BD",
      },
      secondary: {
        main: "#06B7A7",
      },
      background: {
        default: "#F5F9F9",
        paper: "#FAFAFA",
      },
      colors: {
        accent: "#FFC05C",
        danger: "#F24E39",
        info: "#4AD9F2",
        warning: "#FFFF00",
        success: "#15FF54",
        dark: "#153243",
      },
      gradients: {
        primary: "linear-gradient(90deg, #00D8BD 100%, #00BDA5 100%)",
        dark: "rgba(0, 0, 0, 0.25)",
      },
      shadows: {
        text: "rgba(0, 0, 0, 0.25)",
        box: "rgba(0, 0, 0, 0.25)",
      },
    },
  });

  const [theme, setTheme] = useState<Theme>(customTheme);

  useEffect(() => {
    setTheme(customTheme);
  }, []);

  return theme;
};

export default useTheme;
