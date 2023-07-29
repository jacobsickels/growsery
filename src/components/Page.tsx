import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Typography } from "./Typography";

interface PageProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  backLink?: string;
}

export const Page = ({ title, children, actions, backLink }: PageProps) => {
  return (
    <div className="container mx-auto mt-8 content-center">
      {backLink && (
        <Link href={backLink}>
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="-ml-2 mr-2" /> Back
          </Button>
        </Link>
      )}

      <div className="mb-4 flex">
        <Typography.H1 className="flex-1">{title}</Typography.H1>
        <div>{actions}</div>
      </div>
      {children}
    </div>
  );
};
