// Deployment: registration closed 2026-07-16
const pttInput = document.querySelector("#ptt");
const pttHint = document.querySelector("#pttHint");
const signupForm = document.querySelector("#signupForm");
const formStatus = document.querySelector(".form-status");
const registrationClosed = document.querySelector("#registrationClosed");

const isRegistrationClosed = true;

const setText = (selector, text) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
};

const setLink = (selector, text, href) => {
  const element = document.querySelector(selector);
  if (!element) return;
  element.textContent = text;
  element.href = href;
};

const applyRegistrationState = () => {
  document.body.dataset.registrationState = "closed";
  document.title = "骤雨溯音杯 | 报名已结束";

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content =
      "2026 年暑假会客窝第一届“骤雨溯音杯”Arcaea 比赛报名已结束，赛事信息与规则仍可查阅。";
  }

  setText("#registrationNav", "报名已结束");
  setText("#heroEyebrow", "2026 暑假会客窝 · 报名阶段已结束");
  setText("#heroTitle", "报名落定，静候开赛");
  setText(
    "#heroCopy",
    "第一届“骤雨溯音杯”报名通道现已关闭。感谢每一位选手留下名字，管理员正在核验信息并编排分组，请留意赛事群后续通知。",
  );
  setLink("#registrationPrimaryAction", "查看报名状态", "#signup");
  setLink("#registrationSecondaryAction", "浏览比赛规则", "#rules");
  setText("#aboutKicker", "报名状态");
  setText("#about-title", "本届报名已经结束");
  setText(
    "#aboutCopy",
    "报名资料已进入整理阶段，页面不再接收新的参赛申请。已报名选手无需重复提交，分组名单、赛程时间及 Arcaea Link 房间安排将通过赛事群公布。",
  );
  setText("#signupKicker", "Registration Closed");
  setText("#signup-title", "报名已结束");
  setText(
    "#signupCopyText",
    "参赛信息已封存并进入核验流程。赛事规则与曲池信息仍会保留，方便选手随时查阅。",
  );
  setText("#footerCopy", "2026 年暑假会客窝 · 第一届“骤雨溯音杯”赛事信息页");

  const signupNotice = document.querySelector("#signupNotice");
  if (signupNotice) signupNotice.hidden = true;

  if (signupForm) {
    signupForm.reset();
    signupForm.querySelectorAll("input, select, textarea, button").forEach((control) => {
      control.disabled = true;
    });
    signupForm.hidden = true;
    signupForm.setAttribute("aria-hidden", "true");
  }

  if (registrationClosed) registrationClosed.hidden = false;
};

applyRegistrationState();

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

    if (isRegistrationClosed) return;

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
