import combos from "@/data/combos.json";
import { getComboOverrides } from "@/lib/overrides";

export async function getAllCombos() {
  const overrides = await getComboOverrides();
  return combos.map((combo) => {
    const override = overrides.get(combo.id);
    return {
      ...combo,
      precio: override?.precio ?? combo.precio,
      disponible: override?.disponible ?? true,
    };
  });
}
