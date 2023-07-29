import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Page } from "~/components/Page";
import { api } from "~/utils/api";

export const Recipies = () => {
  const { data } = api.recipes.list.useQuery();

  return (
    <Page
      title="Recipes"
      actions={
        <Link href={"/recipes/create"}>
          <Button variant="secondary">Create New Recipe</Button>
        </Link>
      }
    >
      {data?.map((recipe) => (
        <Paper key={recipe.id}>
          <div className="flex flex-1 flex-row">
            <div className="items-top mt-1 flex space-x-4">
              <Checkbox id={"recipe-" + recipe.id} />
              <Label
                htmlFor={"recipe-" + recipe.id}
                className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {recipe.name}
              </Label>
            </div>
          </div>

          <div className="flex">
            <div className="mx-2 my-1">
              <Link href={"/recipes/" + recipe.id}>
                <Pencil className="hover:text-primary" />
              </Link>
            </div>
            <div className="mx-2 mt-1">
              <button>
                <Trash2 className="hover:text-primary" />
              </button>
            </div>
          </div>
        </Paper>
      ))}
    </Page>
  );
};

export default Recipies;
