import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();

    const handleToggle = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return (
        <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleToggle}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
        >
            {resolvedTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    );
}
