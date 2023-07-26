"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { Typography } from "~/components/Typography";
import { api } from "~/utils/api";

type FormState = {
  name: string;
  description?: string;
  servings: string;
};

export const ViewRecipe = () => {
  const router = useRouter();

  const recipeId = router.query.id as string;

  const { data: recipe, isLoading } = api.recipes.get.useQuery({
    id: recipeId,
  });

  if (isLoading || !recipe) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex">
        <Typography.H1>{recipe.name}</Typography.H1>
        <Typography.Span>Serves {recipe?.servings} people</Typography.Span>
        <Link href={"/recipes/edit/" + recipe.id} className="text-blue-600">
          Edit Recipe
        </Link>
      </div>
      <Typography.P>{recipe?.description}</Typography.P>
    </>
  );
};

export default ViewRecipe;
