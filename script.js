const pttInput = document.querySelector("#ptt");
const pttHint = document.querySelector("#pttHint");
const form = document.querySelector(".signup-form");
const nextUrl = document.querySelector("#nextUrl");
const statusBox = document.querySelector(".form-status");

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

const labels = {
  "选手名称": "选手名称",
  "真实PTT": "真实 PTT",
  "联系方式": "QQ / 联系方式",
  "Arcaea好友码": "Arcaea 好友码",
  "比赛设备": "比赛设备",
  "参赛画面": "参赛画面",
  "可参赛时间": "可参赛时间",
  "补充说明": "补充说明",
  "确认真实PTT": "确认真实 PTT",
  "确认设备条件": "确认设备条件",
};

const setStatus = (type, html) => {
  if (!statusBox) return;
  statusBox.className = `form-status show ${type}`;
  statusBox.innerHTML = html;
};

const buildMailBody = (formData) => {
  const lines = ["骤雨溯音杯参赛报名", "", "报名信息如下："];
  for (const [key, label] of Object.entries(labels)) {
    const value = formData.get(key);
    if (value) lines.push(`${label}：${value}`);
  }
  lines.push("", `提交页面：${window.location.href}`);
  return lines.join("\n");
};

const openMailFallback = (recipient, subject, body) => {
  const query = new URLSearchParams({
    to: recipient,
    su: subject,
    body,
  });
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&${query.toString()}`;
  window.open(gmailUrl, "_blank", "noopener,noreferrer");
};

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (nextUrl) {
      nextUrl.value = new URL("thanks.html", window.location.href).href;
    }

    const button = form.querySelector("button[type='submit']");
    const originalText = button?.textContent || "提交报名信息";
    const formData = new FormData(form);
    const recipient = form.dataset.recipient || "kitaresource@gmail.com";
    const subject = formData.get("_subject") || "骤雨溯音杯参赛报名";
    const body = buildMailBody(formData);

    if (button) {
      button.textContent = "正在提交...";
      button.disabled = true;
    }
    setStatus("", "正在发送报名信息，请稍候。");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus(
        "success",
        "报名信息已提交。若这是该邮箱第一次使用 FormSubmit，请到收件箱中点击确认邮件来启用转发。"
      );
      form.reset();
      if (pttHint) pttHint.textContent = rangeHint(Number.NaN);
    } catch (error) {
      openMailFallback(recipient, subject, body);
      const fallbackLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus(
        "error",
        `第三方表单服务暂时不可用，已为你打开 Gmail 写信窗口。若没有弹出，请 <a href="${fallbackLink}">点击这里发送同样的报名邮件</a>。`
      );
    } finally {
      if (button) {
        button.textContent = originalText;
        button.disabled = false;
      }
    }
  });
}
