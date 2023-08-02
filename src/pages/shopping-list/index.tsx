import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Paper } from "@/components/ui/paper";
import { UNITS } from "~/_shared/constants";
import { useActingGroups } from "~/components/ActingGroupProvider";
import { Page } from "~/components/Page";
import { api } from "~/utils/api";

export const Recipes = () => {
  const { actingGroupId } = useActingGroups();
  const { data: shoppingList = [] } = api.shoppingList.get.useQuery({
    actingGroupId,
  });

  const getUnitAbbreviation = (unit?: string) => {
    return UNITS.find((u) => u.value === unit)?.label;
  };

  return (
    <Page title="Shopping List" backLink="/recipes">
      {shoppingList.map((item, index) => (
        <Paper key={index} className="flex justify-between">
          <div className="items-top flex space-x-4">
            <Checkbox
              id={`item-${item[0]?.id || ""}`}
              // checked={!!selectedRecipes?.find((id) => id === recipe.id)}
              // onCheckedChange={onCheckChanged(recipe.id)}
            />
            <Label
              htmlFor={`item-${item[0]?.id || ""}`}
              className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item[0]?.produce?.name}
            </Label>
          </div>
          <div>
            {item.map((i) => (
              <span
                key={i.id}
                className="mx-1 rounded-full bg-primary px-2 py-1 text-primary-foreground"
              >
                {i.amount?.toString()} {getUnitAbbreviation(i.unit)}
              </span>
            ))}
          </div>
        </Paper>
      ))}
    </Page>
  );
};

export default Recipes;
