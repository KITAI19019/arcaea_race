const pttInput = document.querySelector("#ptt");
const pttHint = document.querySelector("#pttHint");

const rangeHint = (ptt) => {
  if (Number.isNaN(ptt)) return "填写后将显示大致分组提示。";
  if (ptt < 9) return "预计进入低 PTT 练习/体验范围，最终以管理分组为准。";
  if (ptt < 10) return "预计进入 9.00-9.99 附近范围，最终以管理分组为准。";
  if (ptt < 11) return "预计进入 10.00-10.99 附近范围，最终以管理分组为准。";
  if (ptt < 12) return "预计进入 11.00-11.99 附近范围，最终以管理分组为准。";
  if (ptt <= 12.25) return "文档示例范围：12.00-12.25；ban 曲与随机曲目参考附件定数图。";
  if (ptt <= 12.5) return "预计进入 12.25-12.50 附近范围，最终以管理分组为准。";
  if (ptt <= 12.75) return "预计进入 12.50-12.75 附近范围，最终以管理分组为准。";
  return "高 PTT 范围选手将由管理结合报名人数安排分组。";
};

if (pttInput && pttHint) {
  pttInput.addEventListener("input", () => {
    pttHint.textContent = rangeHint(Number.parseFloat(pttInput.value));
  });
}
