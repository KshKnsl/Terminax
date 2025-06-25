import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle({ inDropdown = false }) {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    if (inDropdown) {
        return (
            <div 
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-black hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer flex items-center px-2 py-1.5 rounded-sm text-sm"
            >
                {theme === "dark" ? (
                    <>
                        <Sun className="w-4 h-4 mr-2" />
                        <span>Light Mode</span>
                    </>
                ) : (
                    <>
                        <Moon className="w-4 h-4 mr-2" />
                        <span>Dark Mode</span>
                    </>
                )}
                <span className="sr-only">Toggle theme</span>
            </div>
        );
    }

    return (
        <Button 
            variant="outline" 
            onClick={toggleTheme}
            className="bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-[#0A0A0A] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 flex items-center gap-2"
        >
            {theme === "dark" ? (
                <>
                    <Sun className="h-[1rem] w-[1rem]" />
                    <span>Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="h-[1rem] w-[1rem]" />
                    <span>Dark Mode</span>
                </>
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
