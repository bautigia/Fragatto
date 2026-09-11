export const FAMILIA_COLOR = {
  amaderado: "#9c8355",
  ambarado: "#c9932f",
  afrutado: "#c1553a",
  floral: "#c46a89",
  oriental: "#8a5a8f",
  fresco: "#4e9a8f",
};

export function colorDeFamilia(familia) {
  return FAMILIA_COLOR[familia] ?? "#476498";
}
