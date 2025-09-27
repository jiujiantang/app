import changeBg from "./components/ChangeBg"

document.getElementById("change-bg").addEventListener("click", async () => {
  await changeBg()
});