"use client";
import { Form, Field } from "react-final-form";
import {
    Stack,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import {
    ReactDOM,
    ReactElement,
    Suspense,
    useEffect,
    useRef,
    useState,
    ChangeEvent,
} from "react";
import Result from "./components/Result";
import Loading from "./loading";
import { Box, ThemeProvider } from "@mui/system";
import { createTheme } from "@mui/material/styles";
const theme = createTheme({
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: "#1976d2", // Set outline color
                },
                root: {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2", // Outline color on hover
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2", // Outline color on focus
                    },
                    "&.Mui-error .MuiSelect-icon": {
                        color: "#d32f2f", // エラー時のアイコンの色を設定
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: "#1976d2", // Set label color
                    "&.Mui-focused": {
                        color: "#1976d2", // Label color on focus
                    },
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                icon: {
                    color: "#1976d2", // Set select icon color
                },
            },
        },
    },
});

// APIから取得したデータの型定義
export interface Hit {
    result: {
        id: number;
        full_title: string;
        title: string;
        artist_names: string;
        song_art_image_url: string;
        url: string;
        api_path: string;
    };
}

export interface Result {}

interface ApiResponse {
    response: {
        hits: Hit[];
    };
}

interface FormValues {
    name: string;
}

interface Language {
    value: string;
    label: string;
}

const languageList = [
    { value: "Japanese", label: "ja" },
    { value: "English", label: "en" },
    { value: "French", label: "fr" },
    { value: "German", label: "de" },
    { value: "Chinese", label: "sch" },
    { value: "Korean", label: "ko" },
];

export default function Home() {
    const [searchText, setSearchText] = useState<string>("");
    const [data, setData] = useState<Hit[]>([]);
    const isFirstRender = useRef<boolean>(true);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");

    useEffect(() => {
        if (isFirstRender.current || searchText === "") {
            isFirstRender.current = false;
            return;
        }
        const fetchData = async () => {
            const token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
            const res = await fetch(
                `https://api.genius.com/search?q=${searchText}&access_token=${token}`
            );
            const data: ApiResponse = await res.json();
            setData(data.response.hits);
        };
        fetchData();
    }, [searchText]);

    const onSubmit = (values: FormValues) => {
        setSearchText(values.name);
    };

    const validateLanguage = (value: string): string | undefined => {
        if (!value) {
            return "Please select a language";
        }
        return undefined;
    };

    const validateName = (value: string): string | undefined => {
        if (!value) {
            return "Please enter the name of the singer or song";
        }
        return undefined;
    };

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedLanguage(event.target.value as string);
    };

    return (
        <>
            <div className="w-full flex justify-center mt-20">
                <Form
                    onSubmit={onSubmit}
                    render={({ handleSubmit }) => (
                        <Stack
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            spacing={2}
                            sx={{ p: 2, width: "70%", maxWidth: "768px" }}
                        >
                            <ThemeProvider theme={theme}>
                                <Field
                                    name="name"
                                    validate={validateName}
                                    render={({ input, meta }) => (
                                        <TextField
                                            {...input}
                                            label="singer, song title"
                                            helperText={
                                                meta.touched && meta.error
                                                    ? meta.error
                                                    : ""
                                            }
                                            error={meta.touched && !!meta.error}
                                            InputProps={{
                                                className: "dark:text-white",
                                            }}
                                        />
                                    )}
                                />
                                <Box sx={{ minWidth: 120 }}>
                                    <Field
                                        name="language"
                                        validate={validateLanguage}
                                    >
                                        {({ input, meta }) => (
                                            <FormControl
                                                fullWidth
                                                error={
                                                    meta.touched && !!meta.error
                                                }
                                            >
                                                <InputLabel id="demo-simple-select-label">
                                                    select your language
                                                </InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    {...input}
                                                    value={input.value || ""}
                                                    label="select your language"
                                                    onChange={(
                                                        event: SelectChangeEvent
                                                    ) => {
                                                        handleChange(event);
                                                        input.onChange(event);
                                                    }}
                                                    className="dark:text-white"
                                                >
                                                    {languageList.map(
                                                        (
                                                            list: Language,
                                                            index
                                                        ) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={
                                                                    list.label
                                                                }
                                                            >
                                                                {list.value}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                                <FormHelperText>
                                                    {meta.touched && meta.error
                                                        ? meta.error
                                                        : ""}
                                                </FormHelperText>
                                            </FormControl>
                                        )}
                                    </Field>
                                </Box>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    sx={{ width: "90px", margin: "0 auto" }}
                                >
                                    search
                                </Button>
                            </ThemeProvider>
                        </Stack>
                    )}
                />
            </div>
            <Result data={data} language={selectedLanguage} />
        </>
    );
}
