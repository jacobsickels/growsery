import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback } from "react";
import { useActingGroups } from "~/components/ActingGroupProvider";
import { Page } from "~/components/Page";
import { api } from "~/utils/api";

export const Recipes = () => {
  const { data: session } = useSession();
  const { actingGroupId } = useActingGroups();
  const { data: recipes } = api.recipes.list.useQuery({
    groupId: actingGroupId,
  });
  const { data: selectedRecipes } =
    api.shoppingList.getSelectedRecipeIds.useQuery({ actingGroupId });

  const { mutate } = api.shoppingList.update.useMutation();

  const utils = api.useContext();

  const onCheckChanged = useCallback(
    (recipeId: string) => (checked: boolean) => {
      mutate(
        { adding: checked, recipeId, actingGroupId },
        {
          onSettled: () => {
            void utils.shoppingList.invalidate();
          },
        }
      );
    },
    []
  );

  return (
    <Page
      title="Recipes"
      actions={
        <Link href={"/recipes/create"}>
          <Button variant="secondary">Create New Recipe</Button>
        </Link>
      }
    >
      {recipes?.map((recipe) => (
        <Paper key={recipe.id}>
          <div className="flex flex-1 flex-row">
            <div className="items-top mt-1 flex space-x-4">
              <Checkbox
                id={"recipe-" + recipe.id}
                checked={!!selectedRecipes?.find((id) => id === recipe.id)}
                onCheckedChange={onCheckChanged(recipe.id)}
              />
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

      <div className="my-8 flex justify-center">
        <Link href="/shopping-list">
          <Button>View Shopping List</Button>
        </Link>
      </div>
    </Page>
  );
};

export default Recipes;
