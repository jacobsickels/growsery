import { User } from "lucide-react";

export const Servings = ({ servings }: { servings: number | null }) => {
  return (
    <span className="ml-8 rounded-full bg-primary p-1 px-2 text-white">
      {servings}
      <User className="-mt-1 ml-1 inline-block" size={16} />
    </span>
  );
};
