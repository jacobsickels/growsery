import Link from "next/link";
import { Typography } from "~/components/Typography";
import { api } from "~/utils/api";

export const Recipies = () => {
  const { data } = api.recipes.list.useQuery();

  return (
    <>
      <Typography.H1>Recipes</Typography.H1>

      <Link href={"/recipes/create"}>Create New Recipe</Link>

      {data?.map((recipe) => (
        <div
          key={recipe.id}
          className="my-2 flex border-l-8 border-blue-500 bg-blue-300 p-2"
        >
          <div className="flex-1">
            <input type="checkbox" id={"recipe-" + recipe.id} />
            <label htmlFor={"recipe-" + recipe.id} className="mx-2">
              {recipe.name}
            </label>

            <span className="mx-4 rounded-full bg-blue-800 p-1 px-2 text-white">
              Serves {recipe.servings} people
            </span>
          </div>

          <div>
            <Link href={"/recipes/" + recipe.id}>Edit</Link>
            <button>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default Recipies;
