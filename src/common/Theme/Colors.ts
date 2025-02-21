interface ColorTheme {
  background: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
  };
  accent: {
    green: {
      light: string;
      main: string;
      dark: string;
    };
    brown: {
      light: string;
      main: string;
      dark: string;
    };
    orange: {
      light: string;
      main: string;
      dark: string;
    };
  };
  palette: {
    sage: string;
    moss: string;
    clay: string;
    sand: string;
    bark: string;
    earth: string;
    stone: string;
    fog: string;
    dusk: string;
    berry: string;
    wine: string;
    rust: string;
  };
}

const baseTheme = {
  accent: {
    green: {
      light: "#8A9F71",
      main: "#5C7043",
      dark: "#3F4D2E",
    },
    brown: {
      light: "#7D6B5D",
      main: "#4A362B",
      dark: "#3D2A1E",
    },
    orange: {
      light: "#E3955A",
      main: "#C1742F",
      dark: "#9B5D24",
    },
  },
  palette: {
    sage: "#9CAF88",
    moss: "#5C7043",
    clay: "#C1742F",
    sand: "#D5B99F",
    bark: "#4A362B",
    earth: "#8B6F5C",
    stone: "#8F8578",
    fog: "#B7C4BC",
    dusk: "#7B8B93",
    berry: "#A76F6F",
    wine: "#854D4D",
    rust: "#B45B39",
  },
};

export const themes: { light: ColorTheme; dark: ColorTheme } = {
  light: {
    ...baseTheme,
    background: "#F5F2EA",
    text: {
      primary: "#3D2A1E",
      secondary: "#7D6B5D",
      accent: "#C1742F",
      highlight: "#5C7043",
    },
  },
  dark: {
    ...baseTheme,
    background: "#3D2A1E",
    text: {
      primary: "#F5F2EA",
      secondary: "#D5C9BE",
      accent: "#E3955A",
      highlight: "#8A9F71",
    },
  },
};

export type Theme = ColorTheme;
export const colors = themes.light;
