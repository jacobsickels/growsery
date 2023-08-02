import { type Unit } from "@prisma/client";

export const UNITS: Array<{ label: string; value: Unit }> = [
  { label: "None", value: "NONE" },
  { label: "oz", value: "OUNCE" },
  { label: "lb", value: "POUND" },
  { label: "tbsp.", value: "TABLE_SPOON" },
  { label: "tsp.", value: "TEA_SPOON" },
  { label: "cup", value: "CUP" },
  { label: "fl oz", value: "FLUID_OUNCE" },
  { label: "pint", value: "PINT" },
  { label: "quart", value: "QUART" },
  { label: "gallon", value: "GALLON" },
];
