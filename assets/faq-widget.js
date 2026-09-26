/* AVAS FAQ bubble. Wired into build.py on inner pages (FAQ_WIDGET); it mounts only when the portal endpoint reports
   online (FAQ_BOT_ENABLED=1), so deploying the site before the bot is harmless. Include with:
     <script src="/assets/faq-widget.js" data-endpoint="https://portal.ayalavirtualassistance.site/api/public/faq" defer></script>
   Safety: every reply is rendered with textContent; only allowlisted links become <a> elements, so
   model output can never inject markup. History carries the server's signatures back unchanged. */
(function () {
  "use strict";
  var me = document.currentScript;
  var ENDPOINT = (me && me.getAttribute("data-endpoint")) || "https://portal.ayalavirtualassistance.site/api/public/faq";
  var ALLOW = [/^https:\/\/calendly\.com\/obmgwenayala\/30min([/?#]|$)/, /^https:\/\/(www\.)?ayalavirtualassistance\.site(\/|$)/, /^mailto:info@ayalavirtualassistance\.com$/];
  var LINK = /(https?:\/\/[^\s<>()"']+|mailto:[^\s<>()"']+)/g;
  var history = [];
  var busy = false;

  var css =
    ".avfaq{--bg:#F5F5F7;--ink:#1D1D1F;--accent:#8B4A2A;--line:rgba(29,29,31,.12);font:500 15px/1.45 ui-rounded,'SF Pro Rounded',system-ui,sans-serif;letter-spacing:-.01em;color:var(--ink);position:fixed;right:16px;bottom:16px;z-index:2147483000}" +
    ".avfaq button{font:inherit;cursor:pointer}" +
    ".avfaq-open{width:56px;height:56px;border-radius:50%;border:0;background:var(--accent);color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.18);font-size:24px}" +
    ".avfaq-panel{display:none;flex-direction:column;width:min(360px,calc(100vw - 32px));height:min(520px,calc(100vh - 96px));background:var(--bg);border:1px solid var(--line);border-radius:18px;box-shadow:0 16px 48px rgba(0,0,0,.2);overflow:hidden;margin-bottom:12px}" +
    ".avfaq.is-open .avfaq-panel{display:flex}.avfaq.is-open .avfaq-open{display:none}" +
    ".avfaq-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid var(--line);font-weight:600}" +
    ".avfaq-x{border:0;background:none;font-size:20px;color:var(--ink);min-width:44px;min-height:44px}" +
    ".avfaq-log{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px}" +
    ".avfaq-msg{max-width:85%;padding:10px 12px;border-radius:14px;white-space:pre-wrap;word-wrap:break-word}" +
    ".avfaq-bot{background:#fff;border:1px solid var(--line);align-self:flex-start}.avfaq-me{background:var(--accent);color:#fff;align-self:flex-end}" +
    ".avfaq-bot a{color:var(--accent);font-weight:600}" +
    ".avfaq-form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line)}" +
    ".avfaq-in{flex:1;min-height:44px;border:1px solid var(--line);border-radius:12px;padding:0 12px;font:inherit;font-size:16px;background:#fff;color:var(--ink)}" +
    ".avfaq-send{min-width:64px;min-height:44px;border:0;border-radius:12px;background:var(--ink);color:#fff;font-weight:600}" +
    ".avfaq-note{font-size:12px;opacity:.65;padding:0 16px 10px}" +
    "@media (prefers-reduced-motion:no-preference){.avfaq-panel{animation:avfaqUp .18s ease-out}}@keyframes avfaqUp{from{transform:translateY(12px);opacity:0}to{transform:none;opacity:1}}";

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderText(node, text) {
    var last = 0, m;
    LINK.lastIndex = 0;
    while ((m = LINK.exec(text))) {
      var url = m[0].replace(/[.,;:!?]+$/, "");
      node.appendChild(document.createTextNode(text.slice(last, m.index)));
      if (ALLOW.some(function (re) { return re.test(url); })) {
        var a = el("a", null, url.replace(/^mailto:/, ""));
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        node.appendChild(a);
      } else {
        node.appendChild(document.createTextNode(url));
      }
      last = m.index + url.length;
    }
    node.appendChild(document.createTextNode(text.slice(last)));
  }

  function mount() {
    var style = el("style");
    style.textContent = css;
    document.head.appendChild(style);
    var root = el("div", "avfaq");
    var panel = el("div", "avfaq-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Ask AVAS");
    var head = el("div", "avfaq-head", "Ask AVAS");
    var x = el("button", "avfaq-x", "×");
    x.setAttribute("aria-label", "Close");
    head.appendChild(x);
    var log = el("div", "avfaq-log");
    log.setAttribute("aria-live", "polite");
    var form = el("form", "avfaq-form");
    var input = el("input", "avfaq-in");
    input.maxLength = 800;
    input.placeholder = "Ask in any language";
    input.setAttribute("aria-label", "Your question");
    var send = el("button", "avfaq-send", "Send");
    send.type = "submit";
    form.appendChild(input);
    form.appendChild(send);
    var note = el("div", "avfaq-note", "An AI assistant that answers from our website. For anything personal, book a call.");
    panel.appendChild(head);
    panel.appendChild(log);
    panel.appendChild(form);
    panel.appendChild(note);
    var open = el("button", "avfaq-open", "✉");
    open.setAttribute("aria-label", "Ask AVAS a question");
    root.appendChild(panel);
    root.appendChild(open);
    document.body.appendChild(root);

    function add(text, who) {
      var b = el("div", "avfaq-msg " + (who === "me" ? "avfaq-me" : "avfaq-bot"));
      if (who === "me") b.textContent = text; else renderText(b, text);
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
      return b;
    }

    open.addEventListener("click", function () {
      root.classList.add("is-open");
      if (!log.childNodes.length) add("Hi! Ask me anything about AVAS: services, pricing, how we work. Tagalog is fine too.", "bot");
      input.focus();
    });
    x.addEventListener("click", function () { root.classList.remove("is-open"); open.focus(); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value.trim();
      if (!q || busy) return;
      busy = true;
      input.value = "";
      add(q, "me");
      history.push({ role: "user", content: q });
      var wait = add("…", "bot");
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.slice(-12) }) })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (j) {
          var reply = (j && j.reply) || "Sorry, I could not answer that. You can book a call: https://calendly.com/obmgwenayala/30min";
          wait.textContent = "";
          renderText(wait, reply);
          if (j && j.sig) history.push({ role: "assistant", content: j.reply, sig: j.sig });
        })
        .catch(function () {
          wait.textContent = "";
          renderText(wait, "I am offline right now. You can book a call: https://calendly.com/obmgwenayala/30min");
        })
        .then(function () { busy = false; });
    });
  }

  // Show the bubble only when the bot is live (GET reports FAQ_BOT_ENABLED), so a dark or broken
  // endpoint never puts a dead chat in front of a visitor.
  function start() {
    fetch(ENDPOINT, { method: "GET" })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { if (j && j.online === true) mount(); })
      .catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
