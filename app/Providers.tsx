"use client";

import { ThemeProvider } from "next-themes";
import { useState, useEffect, ReactNode } from "react";

const Providers = ({children}: {children: ReactNode}) => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return <ThemeProvider attribute={"class"} defaultTheme="system" enableSystem>
        {children}
    </ThemeProvider>
}

export default Providers;