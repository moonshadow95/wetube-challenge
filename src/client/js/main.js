import "regenerator-runtime";
import "../scss/styles.scss";
import { displayedAt } from "./createdAtFormat";

const createdAts = document.querySelectorAll(".createdAt");

createdAts.forEach((item) => {
  const createdAt = item.innerText;
  const span = item;
  span.innerText = displayedAt(createdAt);
});
