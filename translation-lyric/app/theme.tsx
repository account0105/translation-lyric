"use client";
import { createTheme } from "@mui/material/styles";

// MUI テーマの作成
const theme = createTheme({
    typography: {
        fontFamily: "",
        fontWeightLight: 100,
        fontWeightBold: 700,
        subtitle1: {
            fontWeight: 100,
        },
        h5: {
            fontWeight: 100,
        },
    },
});

export default theme;
