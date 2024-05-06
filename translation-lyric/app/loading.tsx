import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loading() {
    return (
      
        <div className="flex w-screen h-screen items-center justify-center">
            <Box>
                <CircularProgress />
            </Box>
        </div>
    );
}
