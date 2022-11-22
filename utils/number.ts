export function formatNumber(value: string) {
  return value
    ? `${value}`.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : "";
}
export const formatCurrency = (value: any, decimal: number = 3) => {
  if (!value) {
    return "";
  }
  if (value && value?.indexOf(".") >= 0) {
    const decimal_pos = value.indexOf(".");

    let left_side = value.substring(0, decimal_pos);
    let right_side = value.substring(decimal_pos + 1);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // // validate right side
    // right_side = formatNumber(right_side);

    // Limit decimal to only decimal digits
    right_side = right_side.length > 0 ? right_side.substring(0, decimal) : 0;

    return right_side > 0 ? `${left_side}.${right_side}` : left_side;
  } else {
    return formatNumber(value);
  }
};
