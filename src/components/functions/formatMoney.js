import numeral from "numeral";

export default function formatMoney(value) {
  return numeral(value).format("0.[0]a");
}
