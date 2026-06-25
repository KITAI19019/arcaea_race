const pttInput = document.querySelector("#ptt");
const pttHint = document.querySelector("#pttHint");
const signupForm = document.querySelector("#signupForm");
const formStatus = document.querySelector(".form-status");

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

const csvEscape = (value) => {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const buildCsv = (form) => {
  const submittedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  const fields = [
    ["提交时间", submittedAt],
    ["选手名称", form.elements.playerName.value.trim()],
    ["真实PTT", form.elements.ptt.value.trim()],
    ["联系方式", form.elements.qq.value.trim()],
    ["Arcaea好友码", form.elements.friendCode.value.trim()],
    ["比赛设备", form.elements.device.value.trim()],
    ["参赛画面", form.elements.capture.value],
    ["可参赛时间", form.elements.availability.value.trim()],
    ["补充说明", form.elements.message.value.trim()],
    ["确认真实PTT", form.elements["确认真实PTT"].checked ? "是" : "否"],
    ["确认设备条件", form.elements["确认设备条件"].checked ? "是" : "否"],
  ];

  return [
    fields.map(([label]) => csvEscape(label)).join(","),
    fields.map(([, value]) => csvEscape(value)).join(","),
  ].join("\r\n");
};

const safeFileName = (value) =>
  value
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 40) || "未命名选手";

const downloadCsv = (csv, playerName) => {
  const date = new Date().toISOString().slice(0, 10);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `骤雨溯音杯报名表_${safeFileName(playerName)}_${date}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!signupForm.reportValidity()) return;

    const playerName = signupForm.elements.playerName.value.trim();
    const csv = buildCsv(signupForm);
    downloadCsv(csv, playerName);

    if (formStatus) {
      formStatus.classList.add("show", "success");
      formStatus.classList.remove("error");
      formStatus.textContent =
        "报名表 CSV 已下载。请将下载的文件上传至赛事群“群应用->文件->报名申请表”文件夹中。";
    }
  });
}
