"use client";
import React, { useEffect, useState } from "react";
import LightModeSharpIcon from "@mui/icons-material/LightModeSharp";
import DarkModeSharpIcon from "@mui/icons-material/DarkModeSharp";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "next-themes";
import Link from "next/link";

const Header = () => {
    const [initialTheme, setInitialTheme] = useState(null);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        setInitialTheme(savedTheme || theme);
    }, [theme]);

    const toggleDarkMode = () => {
        const newTheme = initialTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        setInitialTheme(newTheme);
    };

    return (
        <div>
            <div className="relative max-w-screen-lg mx-auto">
                <div className="text-center pt-5 dark:text-white text-2xl md:text-3xl">
                    <Link href="/">Lyric Translation</Link>
                </div>

                <div className="absolute right-9 top-4 sm:right-10 sm:top-7">
                    {initialTheme === "dark" ? (
                        <div>
                            <IconButton
                                sx={{ color: "white" }}
                                onClick={toggleDarkMode}
                            >
                                <LightModeSharpIcon
                                    sx={{ position: "fixed" }}
                                />
                            </IconButton>
                        </div>
                    ) : (
                        <div>
                            <IconButton
                                sx={{ color: "black" }}
                                onClick={toggleDarkMode}
                            >
                                <DarkModeSharpIcon sx={{ position: "fixed" }} />
                            </IconButton>
                        </div>
                    )}
                </div>
            </div>
            <hr className="mt-4"></hr>
        </div>
    );
};

export default Header;
