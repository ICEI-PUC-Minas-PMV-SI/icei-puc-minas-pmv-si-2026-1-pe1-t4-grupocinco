const clearButton = document.getElementById("clearFilters");

clearButton.addEventListener("click", () => {
  const selects = document.querySelectorAll("select");
  const inputs = document.querySelectorAll("input");

  selects.forEach((select) => {
    select.selectedIndex = 0;
  });

  inputs.forEach((input) => {
    if (input.type !== "submit") {
      input.value = "";
    }
  });
});
