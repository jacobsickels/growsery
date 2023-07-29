import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Servings } from "@/components/ui/servings";
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
        <div
          key={recipe.id}
          className="my-2 flex border-l-8 border-blue-500 bg-blue-300 p-4"
        >
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

            <Servings servings={recipe.servings} />
          </div>

          <div className="flex">
            <div className="mx-2 my-1">
              <Link href={"/recipes/" + recipe.id}>
                <Pencil />
              </Link>
            </div>
            <div className="mx-2 mt-1">
              <button>
                <Trash2 />
              </button>
            </div>
          </div>
        </div>
      ))}
    </Page>
  );
};

export default Recipies;
