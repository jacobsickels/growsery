import { cn } from "@/lib/utils";

interface PaperProps {
  children: React.ReactNode;
  className?: string;
}

export const Paper = ({ children, className }: PaperProps) => {
  return (
    <div
      className={cn("my-2 flex rounded-md bg-white p-4 shadow-md", className)}
    >
      {children}
    </div>
  );
};
