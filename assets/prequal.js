/* Pre-qualify: a few questions when someone lands, then "this one is for you": the role, the hours,
   the price, and a free launch session for booking inside 8 hours (Owner 2026-10-20: "pre questions
   lang to qualify ... may option den na i want to roam around the web first ... mag rerecommend ng
   eto para sayo"). Built into every staffing page by build.py prequal_inject(); the role data comes
   from staffing-roles.json at build time, never retyped here.

   Owner 2026-10-20, on the first preview: "andaming tanong malilito sila nyan ... pick the problem
   instead so parang consultation" and "kapag umabot sya sa dulo save mo na ung sagot then book na".
   So it asks three things, problem first (the problem picks the role), and the answers ride to the
   booking page as hidden router answers (prequal, need, tried, hours): with prequal=1 the AVAS router
   opens the calendar at once, so nobody answers twice, and the team sees the answers on the booking.

   Shown once per visitor, after the privacy card is answered. "Look around first" closes it and leaves
   a small pill to reopen it. The 8-hour window starts when the result shows, keeps its real end time,
   and rides to the booking form as utm_content, so the call can honour it. OFFER_ENDPOINT empty = the
   start time is kept on this device only (preview); set, the server records it, the earlier of the two
   ends wins (a late server start never extends the clock) and the server's now corrects a wrong device
   clock. The copy never says it cannot restart: a new browser is a new id (solo review r1). */
(function () {
  "use strict";
  var DATA = {"hours":{"pt":{"label":"Part-time","line":"About 4 hours a day, weekdays"},"ft":{"label":"Full-time","line":"About 8 hours a day, weekdays"}},"levels":{"core":"Core","skilled":"Skilled","specialist":"Specialist","senior":"Senior"},"families":[{"id":"admin","name":"Admin and Operations","jtl":false,"jtl_line":"","roles":[{"id":"general-va","name":"General VA","level":"core","does":"Inbox, calendar, data entry, research and admin","pt":899,"ft":1499},{"id":"executive-assistant","name":"Executive Assistant","level":"senior","does":"Runs your day: calendar, travel, priorities and gatekeeping","pt":1299,"ft":2199},{"id":"project-manager","name":"Project Manager","level":"senior","does":"Timelines, task boards and follow-through across a team","pt":1299,"ft":2199},{"id":"data-entry-specialist","name":"Data Entry Specialist","level":"core","does":"Spreadsheets, CRM records and cleanup","pt":899,"ft":1499},{"id":"research-assistant","name":"Research Assistant","level":"core","does":"Market, competitor, lead and product research","pt":899,"ft":1499},{"id":"operations-manager","name":"OBM / Operations Manager","level":"senior","does":"Runs the team and SOPs, tracks projects","pt":1299,"ft":2199},{"id":"recruitment-hr-assistant","name":"Recruitment / HR Assistant","level":"skilled","does":"Job posts, screening and onboarding paperwork","pt":1099,"ft":1799}]},{"id":"customer","name":"Customer and Sales","jtl":false,"jtl_line":"","roles":[{"id":"customer-support-va","name":"Customer Support VA","level":"core","does":"Email, tickets and follow-ups","pt":899,"ft":1499},{"id":"appointment-setter","name":"Appointment Setter","level":"skilled","does":"Books calls from leads, confirms and reminds","pt":1099,"ft":1799},{"id":"lead-generation-researcher","name":"Lead Generation Researcher","level":"core","does":"Builds and cleans lead lists","pt":899,"ft":1499},{"id":"live-chat-agent","name":"Live Chat Agent","level":"core","does":"Website and Messenger chat, FAQ answers","pt":899,"ft":1499},{"id":"cold-caller-sdr","name":"Cold Caller / SDR","level":"skilled","does":"Outbound calls and messages to a list","pt":1099,"ft":1799},{"id":"community-moderator","name":"Community Moderator","level":"core","does":"Groups, comments and DMs, removes spam","pt":899,"ft":1499}]},{"id":"creative","name":"Creative","jtl":false,"jtl_line":"","roles":[{"id":"graphic-designer","name":"Graphic Designer","level":"skilled","does":"Social graphics, ads, brochures and decks, in Canva and Adobe","pt":1099,"ft":1799},{"id":"video-editor","name":"Video Editor","level":"skilled","does":"Reels, TikToks, YouTube edits and captions","pt":1099,"ft":1799},{"id":"thumbnail-designer","name":"Thumbnail Designer","level":"skilled","does":"YouTube and course thumbnails","pt":1099,"ft":1799},{"id":"presentation-designer","name":"Presentation Designer","level":"skilled","does":"Pitch decks and webinar slides","pt":1099,"ft":1799},{"id":"photo-editor","name":"Photo Editor","level":"core","does":"Retouching, background removal and product photos","pt":899,"ft":1499},{"id":"motion-graphics-designer","name":"Motion Graphics Designer","level":"specialist","does":"Animated titles, explainers and logo animations","pt":1299,"ft":2199},{"id":"podcast-audio-editor","name":"Podcast / Audio Editor","level":"skilled","does":"Cleanup, cuts and show notes","pt":1099,"ft":1799},{"id":"brand-designer","name":"Brand Designer","level":"senior","does":"Logo, identity and brand guide","pt":1299,"ft":2199}]},{"id":"content","name":"Content and Marketing","jtl":false,"jtl_line":"","roles":[{"id":"social-media-va","name":"Social Media VA","level":"core","does":"Posting, scheduling and replies","pt":899,"ft":1499},{"id":"social-media-manager","name":"Social Media Manager","level":"skilled","does":"Plans and runs the calendar you approve","pt":1099,"ft":1799},{"id":"copywriter","name":"Copywriter","level":"skilled","does":"Captions, emails, sales pages and ads","pt":1099,"ft":1799},{"id":"content-writer-blogger","name":"Content Writer / Blogger","level":"skilled","does":"Blog posts, newsletters and long form","pt":1099,"ft":1799},{"id":"email-marketing-specialist","name":"Email Marketing Specialist","level":"skilled","does":"Campaigns, sequences and list hygiene","pt":1099,"ft":1799},{"id":"seo-specialist","name":"SEO Specialist","level":"specialist","does":"On-page work, keywords and reporting","pt":1299,"ft":2199},{"id":"paid-ads-specialist","name":"Paid Ads Specialist","level":"specialist","does":"Meta and Google ads setup and daily management","pt":1299,"ft":2199},{"id":"influencer-pr-outreach","name":"Influencer / PR Outreach","level":"skilled","does":"Finds and pitches creators and media","pt":1099,"ft":1799}]},{"id":"ecommerce","name":"E-commerce","jtl":false,"jtl_line":"","roles":[{"id":"ecommerce-va","name":"E-commerce VA","level":"core","does":"Orders, listings and inventory updates","pt":899,"ft":1499},{"id":"product-listing-specialist","name":"Product Listing Specialist","level":"skilled","does":"Shopify, Amazon, Shopee and Lazada listings","pt":1099,"ft":1799},{"id":"marketplace-account-manager","name":"Marketplace Account Manager","level":"specialist","does":"Store health, promos, reviews and reports","pt":1299,"ft":2199}]},{"id":"finance","name":"Finance","jtl":false,"jtl_line":"","roles":[{"id":"bookkeeping-va","name":"Bookkeeping VA","level":"skilled","does":"Receipts, invoices and reconciling, in QuickBooks and Xero","pt":1099,"ft":1799},{"id":"accounts-payable-receivable","name":"Accounts Payable / Receivable","level":"core","does":"Bills, collections and reminders","pt":899,"ft":1499},{"id":"payroll-assistant","name":"Payroll Assistant","level":"skilled","does":"Timesheets and payroll prep","pt":1099,"ft":1799}]},{"id":"tech","name":"Tech","jtl":true,"jtl_line":"GHL and tech roles are handled by our sister company, JTL Growth. You book them here, the same way.","roles":[{"id":"ghl-specialist-va","name":"GHL Specialist VA","level":"specialist","does":"CRM upkeep, pipelines, workflows, forms, calendars and funnel edits","pt":1299,"ft":2199},{"id":"automation-specialist","name":"Automation Specialist","level":"specialist","does":"Zapier, Make and n8n, connecting your tools","pt":1299,"ft":2199},{"id":"web-developer","name":"Web Developer","level":"specialist","does":"WordPress, Webflow and Shopify site edits and builds","pt":1299,"ft":2199},{"id":"ai-chatbot-specialist","name":"AI / Chatbot Specialist","level":"specialist","does":"Chatbots, AI assistants and prompt setup","pt":1299,"ft":2199},{"id":"it-support-va","name":"IT Support VA","level":"skilled","does":"Accounts, email setup and tool admin","pt":1099,"ft":1799},{"id":"qa-tester","name":"QA Tester","level":"skilled","does":"Tests sites, funnels and apps before launch","pt":1099,"ft":1799}]}]};
  var OFFER_ENDPOINT = "https://portal.ayalavirtualassistance.site/api/public/offer-window";
  if (!DATA || !document.body) { return; }

  var KEY = "avas-prequal-3";
  var WINDOW_MS = 8 * 3600 * 1000;
  var GIFT = "a free 1-hour launch session and a written first-week task list";
  var store = {
    get: function () { try { return JSON.parse(localStorage.getItem(KEY) || "null") || {}; } catch (e) { return {}; } },
    set: function (v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* private mode: shows again next visit */ } }
  };

  // the problem the visitor feels picks the role; the values are the AVAS router's `need` options.
  // Answers are square tiles with an icon and a few words (Owner 2026-10-20: "lagyan mo ng mga icon ...
  // parang square instead na pahaba ... hndi sya mukang binabasa")
  var NEED = [
    ["admin", "Inbox and calendar", "general-va"],
    ["support", "Slow customer replies", "customer-support-va"],
    ["content", "No time for content", "social-media-va"],
    ["leads", "Leads going cold", "appointment-setter"],
    ["books", "Books are behind", "bookkeeping-va"],
    ["team", "I need a whole team", null]
  ];
  var HOURS = [
    ["pt", "Under 20 hrs a week", "Part-time"],
    ["ft", "20 to 40 hrs a week", "Full-time"],
    ["team", "More than one person", null]
  ];
  var TRIED = [
    ["alone", "No, just me", "You have been doing it all yourself. Here is who takes it off your plate."],
    ["burned", "Yes, it didn't work", "Last time you had to manage them. This time we do."],
    ["stretched", "Yes, my team is stretched", "Your team gets its hours back. Here is who joins them."]
  ];
  // answer value -> Lucide icon; build.py inlines each one from library/icons/lucide into SVG
  var ICON = {"admin": "inbox", "support": "message-square-warning", "content": "clapperboard", "leads": "phone-missed", "books": "receipt-text", "team": "users", "pt": "clock-3", "ft": "briefcase", "alone": "user", "burned": "thumbs-down", "stretched": "battery-low"};
  var SVG = {"battery-low": "<path d=\"M22 14v-4\" /> <path d=\"M6 14v-4\" /> <rect x=\"2\" y=\"6\" width=\"16\" height=\"12\" rx=\"2\" />", "briefcase": "<path d=\"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16\" /> <rect width=\"20\" height=\"14\" x=\"2\" y=\"6\" rx=\"2\" />", "clapperboard": "<path d=\"m12.296 3.464 3.02 3.956\" /> <path d=\"M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z\" /> <path d=\"M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" /> <path d=\"m6.18 5.276 3.1 3.899\" />", "clock-3": "<circle cx=\"12\" cy=\"12\" r=\"10\" /> <path d=\"M12 6v6h4\" />", "inbox": "<polyline points=\"22 12 16 12 14 15 10 15 8 12 2 12\" /> <path d=\"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z\" />", "message-square-warning": "<path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\" /> <path d=\"M12 15h.01\" /> <path d=\"M12 7v4\" />", "phone-missed": "<path d=\"m16 2 6 6\" /> <path d=\"m22 2-6 6\" /> <path d=\"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384\" />", "receipt-text": "<path d=\"M13 16H8\" /> <path d=\"M14 8H8\" /> <path d=\"M16 12H8\" /> <path d=\"M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z\" />", "thumbs-down": "<path d=\"M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z\" /> <path d=\"M17 14V2\" />", "user": "<path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\" /> <circle cx=\"12\" cy=\"7\" r=\"4\" />", "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /> <path d=\"M16 3.128a4 4 0 0 1 0 7.744\" /> <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /> <circle cx=\"9\" cy=\"7\" r=\"4\" />"};
  function icon(v) {
    var inner = SVG && SVG[ICON[v]];
    return inner ? '<svg class="pqp__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>' : "";
  }
  var TASKS = {
    "general-va": ["Clears your inbox and keeps your calendar", "Handles data entry, research and follow-ups", "Sends you an end-of-day list of what got done"],
    "customer-support-va": ["Answers every email and ticket within the day", "Follows up so no customer waits", "Logs what customers ask, so you see the patterns"],
    "social-media-va": ["Posts on the calendar you approve", "Replies to comments and DMs in your voice", "Sends a weekly list of what went out"],
    "graphic-designer": ["Makes your social graphics and ads", "Builds decks and brochures in Canva and Adobe", "Delivers files ready for your yes"],
    "video-editor": ["Cuts your reels, TikToks and YouTube edits", "Adds captions and thumbnails", "Turns raw footage around for your review"],
    "appointment-setter": ["Books calls from your leads", "Confirms and reminds every booking", "Keeps your pipeline notes current"],
    "bookkeeping-va": ["Logs receipts and sends invoices", "Reconciles in QuickBooks or Xero", "Hands you a clean month-end"],
    "ghl-specialist-va": ["Keeps pipelines, forms and calendars working", "Edits funnels and workflows the week you ask", "Cleans and tags your contacts"]
  };

  var roles = {};
  (DATA.families || []).forEach(function (f) {
    (f.roles || []).forEach(function (r) { roles[r.id] = { r: r, fam: f }; });
  });
  function money(n) { return "$" + Number(n).toLocaleString("en-US"); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var ans = {}, step = 0, root, box, pill, lastFocus, tick, busy = false;
  // calm mode (the site's CALM button) and reduced motion: no movement, and no wait after a tap
  function still() {
    return document.documentElement.getAttribute("data-motion") === "calm" ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  // which way the content slides in: forward after an answer, back after Back
  function go(dir) { box.setAttribute("data-dir", dir); }
  var QS = [
    { k: "need", q: "What's eating your week right now?", sub: "Tap the one that costs you the most time.", o: NEED },
    { k: "hours", q: "How many hours a week does it take?", sub: "A rough guess is fine.", o: HOURS },
    { k: "tried", q: "Have you had help with it before?", sub: "So we know where to start.", o: TRIED }
  ];
  // the answers as the booking page reads them (hidden choice questions on the AVAS router)
  function carry(path) {
    var q = "path=" + path + "&prequal=1&need=" + encodeURIComponent(ans.need || "");
    if (ans.hours === "pt" || ans.hours === "ft") { q += "&hours=" + (ans.hours === "ft" ? "full" : "part"); }
    if (ans.tried) { q += "&tried=" + encodeURIComponent(ans.tried); }
    return q;
  }

  function build() {
    root = document.createElement("div");
    root.className = "pqp";
    root.setAttribute("hidden", "");
    root.innerHTML = '<div class="pqp__dim" data-pq-close></div><div class="pqp__box" role="dialog" aria-modal="true" aria-labelledby="pq-h" tabindex="-1"></div>';
    document.body.appendChild(root);
    box = root.querySelector(".pqp__box");
    pill = document.createElement("button");
    pill.type = "button";
    pill.className = "pqp-pill";
    pill.textContent = "Find your specialist";
    pill.setAttribute("hidden", "");
    pill.addEventListener("click", function () { open(true); });
    document.body.appendChild(pill);
    root.addEventListener("click", function (e) { if (e.target.hasAttribute("data-pq-close")) { skip(); } });
    document.addEventListener("keydown", function (e) {
      if (root.hasAttribute("hidden")) { return; }
      if (e.key === "Escape") { skip(); }
      if (e.key === "Tab") { trap(e); }
    });
  }
  function trap(e) {
    var f = box.querySelectorAll("button, a[href]");
    if (!f.length) { return; }
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function head(label) {
    var pct = Math.round(Math.min(step, QS.length) / QS.length * 100);
    return '<div class="pqp__top"><span>' + label + '</span><span>' + (step < QS.length ? (step + 1) + " of " + QS.length : "Your match") +
      '</span></div><div class="pqp__bar"><i style="width:' + pct + '%"></i></div>';
  }
  function render() {
    clearInterval(tick);
    if (step < QS.length) {
      var q = QS[step];
      box.innerHTML = head("Quick consult") +
        '<h2 class="pqp__h" id="pq-h">' + q.q + '</h2>' + (q.sub ? '<p class="pqp__sub">' + q.sub + '</p>' : "") +
        '<div class="pqp__opts pqp__opts--' + q.o.length + '">' + q.o.map(function (o, i) { return '<button type="button" class="pqp__opt" style="--i:' + i + '" data-v="' + o[0] + '">' + icon(o[0]) + '<span>' + esc(o[1]) + '</span></button>'; }).join("") + '</div>' +
        '<div class="pqp__foot">' + (step ? '<button type="button" class="pqp__link" data-pq-back>Back</button>' : '<span></span>') +
        '<button type="button" class="pqp__link" data-pq-skip>I\'d rather look around first</button></div>';
      box.querySelectorAll(".pqp__opt").forEach(function (b) {
        b.addEventListener("click", function (e) {
          if (busy) { return; }
          busy = true;
          ans[q.k] = b.getAttribute("data-v");
          // the tap: the tile sinks, fills and ripples from the finger, then the next question slides in
          var r = b.getBoundingClientRect(), rip = document.createElement("i");
          rip.className = "pqp__rip";
          b.style.setProperty("--x", (e.clientX ? e.clientX - r.left : r.width / 2) + "px");
          b.style.setProperty("--y", (e.clientY ? e.clientY - r.top : r.height / 2) + "px");
          b.classList.add("is-picked");
          if (!still()) { b.appendChild(rip); }
          function next() {
            busy = false;
            go("fwd");
            if ((q.k === "need" || q.k === "hours") && ans[q.k] === "team") { step = QS.length; result(); return; }
            step++; render();
          }
          if (still()) { next(); } else { setTimeout(next, 240); }
        });
      });
      var bk = box.querySelector("[data-pq-back]");
      if (bk) { bk.addEventListener("click", function () { go("back"); step--; render(); }); }
      box.querySelector("[data-pq-skip]").addEventListener("click", skip);
      var first = box.querySelector(".pqp__opt");
      if (first) { first.focus({ preventScroll: true }); }
      return;
    }
    result();
  }
  function result() {
    var s = store.get();
    s.state = "done"; s.ans = ans; store.set(s);
    if (ans.need === "team" || ans.hours === "team") {
      box.innerHTML = head("Quick consult") +
        '<h2 class="pqp__h" id="pq-h">You need a team, not one person.</h2>' +
        '<p class="pqp__sub">More than one person\'s worth of work is what our full execution team does, as a partnership with our sister company, JTL Growth.</p>' +
        '<div class="pqp__card"><p class="pqp__role">Grow with us</p><p class="pqp__price">Strategy plus a named crew, from $2,500 a month</p>' +
        '<ul><li>Content made and channels run</li><li>A calendar you can see before the month starts</li><li>The same people every month</li></ul></div>' +
        '<a class="pqp__cta" href="/book/?' + esc(carry("team")) + '&amp;utm_campaign=prequal">Book a call about a team</a>' +
        '<p class="pqp__fine">Your answers are saved. You just pick a time.</p>' +
        '<div class="pqp__foot"><button type="button" class="pqp__link" data-pq-again>Start over</button><button type="button" class="pqp__link" data-pq-skip>Keep looking around</button></div>';
      wire(); return;
    }
    var pick = NEED.filter(function (n) { return n[0] === ans.need; })[0] || NEED[0];
    var hit = roles[pick[2]];
    if (!hit) { skip(); return; }
    var r = hit.r, h = ans.hours === "ft" ? "ft" : "pt";
    var hoursLine = (DATA.hours && DATA.hours[h] ? DATA.hours[h].label + ", " + DATA.hours[h].line.toLowerCase() : "");
    var price = typeof r[h] === "number" ? money(r[h]) + " a month" : "priced on the call";
    var pain = TRIED.filter(function (p) { return p[0] === ans.tried; })[0];
    var other = h === "pt" ? "ft" : "pt";
    var otherLine = typeof r[other] === "number" ? (other === "ft" ? "Full-time" : "Part-time") + " is " + money(r[other]) + " a month." : "";
    var tasks = TASKS[r.id] || [r.does];
    box.innerHTML = head("Quick consult") +
      '<h2 class="pqp__h" id="pq-h">' + esc(pain ? pain[2] : "Here is who takes it off your plate.") + '</h2>' +
      '<p class="pqp__sub">One consistent specialist on your account. You set the goals, we run the work, and we replace them if they are not the fit.</p>' +
      '<div class="pqp__card"><p class="pqp__role">' + esc(r.name) + '</p><p class="pqp__price">' + esc(hoursLine) + ' · ' + price + '</p>' +
      '<ul>' + tasks.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul>' +
      (otherLine ? '<p class="pqp__alt">' + esc(otherLine) + ' Monthly, no long contract.</p>' : "") + '</div>' +
      '<div class="pqp__offer" id="pq-offer"></div>' +
      '<a class="pqp__cta" id="pq-book" href="#">Pick a time for a free call</a>' +
      '<p class="pqp__fine">Your answers are saved. You just pick a time, and the call starts where this left off.</p>' +
      '<div class="pqp__foot"><button type="button" class="pqp__link" data-pq-again>Start over</button><a class="pqp__link" href="/staffing/">See all roles</a><button type="button" class="pqp__link" data-pq-skip>Keep looking around</button></div>';
    offer(function (o) {
      var book = document.getElementById("pq-book");
      if (!book) { return; } // the visitor left the result before the server answered
      var link = "/book/?" + carry("staffing") + "&family=" + encodeURIComponent(hit.fam.id) + "&role=" + encodeURIComponent(r.id) +
        "&utm_campaign=prequal";
      // only a server-recorded start is something the team can look up; a device-only clock says so
      if (o.live) { link += "&utm_content=launch8h-" + (o.server ? o.id : "device"); }
      book.setAttribute("href", link);
      paint(o);
    });
    wire();
  }
  function offer(cb) {
    var s = store.get();
    if (!s.offer) {
      s.offer = { id: Math.random().toString(36).slice(2, 10), start: Date.now() };
      store.set(s);
    }
    var local = { id: s.offer.id, end: s.offer.start + WINDOW_MS, skew: 0, server: false };
    // paint the device clock and a working booking link at once; a server answer repaints them (the button
    // must never sit on href="#" while the request is out)
    done(local);
    if (!OFFER_ENDPOINT) { return; }
    var x = new XMLHttpRequest();
    x.open("POST", OFFER_ENDPOINT);
    x.setRequestHeader("Content-Type", "application/json");
    x.timeout = 4000;
    x.onload = function () {
      try {
        var j = JSON.parse(x.responseText), end = j && Number(j.end);
        if (x.status === 200 && end > 0) {
          if (Number(j.now) > 0) { local.skew = Number(j.now) - Date.now(); }
          // both ends on the server clock (the device start moved by the skew), then the earlier wins
          local.end = Math.min(s.offer.start + local.skew + WINDOW_MS, end);
          local.server = true;
          done(local);
        }
      } catch (e) { /* keep the device clock */ }
    };
    x.send(JSON.stringify({ id: s.offer.id }));
    function done(o) { o.live = Date.now() + o.skew < o.end; cb(o); }
  }
  function paint(o) {
    clearInterval(tick);
    var el = document.getElementById("pq-offer");
    if (!el) { return; }
    if (!o.live) {
      el.innerHTML = '<p>The 8-hour launch offer for this device has ended. The call is still free.</p>';
      return;
    }
    var endTxt = new Date(o.end).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    el.innerHTML = '<p>Book your call in the next 8 hours and get ' + GIFT + '.</p><p class="pqp__clock" id="pq-clock" aria-hidden="true"></p>' +
      '<p class="pqp__fine">Until ' + endTxt + ' your time. One per business.</p>';
    var c = document.getElementById("pq-clock");
    function draw() {
      var left = Math.max(0, Math.round((o.end - (Date.now() + o.skew)) / 1000));
      if (!document.getElementById("pq-clock")) { clearInterval(tick); return; }
      c.textContent = Math.floor(left / 3600) + ":" + String(Math.floor(left % 3600 / 60)).padStart(2, "0") + ":" + String(left % 60).padStart(2, "0");
      if (!left) { clearInterval(tick); o.live = false; paint(o); }
    }
    draw();
    tick = setInterval(draw, 1000);
  }
  function wire() {
    var a = box.querySelector("[data-pq-again]");
    if (a) { a.addEventListener("click", function () { go("back"); ans = {}; step = 0; render(); }); }
    box.querySelectorAll("[data-pq-skip]").forEach(function (b) { b.addEventListener("click", skip); });
    var cta = box.querySelector(".pqp__cta");
    if (cta) { cta.focus({ preventScroll: true }); }
  }
  function open(fromPill) {
    lastFocus = document.activeElement;
    pill.setAttribute("hidden", "");
    busy = false;
    root.classList.remove("is-out");
    box.removeAttribute("data-dir");
    root.removeAttribute("hidden");
    document.documentElement.classList.add("pqp-on");
    var s = store.get();
    if (fromPill && s.state === "done" && s.ans) { ans = s.ans; step = QS.length; result(); }
    else { ans = {}; step = 0; render(); }
  }
  function skip() {
    clearInterval(tick);
    // a short fade down before it goes; the page is usable again at once
    document.documentElement.classList.remove("pqp-on");
    if (still()) { root.setAttribute("hidden", ""); }
    else {
      root.classList.add("is-out");
      setTimeout(function () { if (root.classList.contains("is-out")) { root.setAttribute("hidden", ""); root.classList.remove("is-out"); } }, 180);
    }
    var s = store.get();
    if (!s.state) { s.state = "skipped"; store.set(s); }
    pill.removeAttribute("hidden");
    if (lastFocus && lastFocus.focus) { lastFocus.focus({ preventScroll: true }); }
  }
  function ready() {
    // wait for the home preloader (it leaves the DOM when done) and for an answer on the privacy card
    // (consent.js stores it under avas-consent), so nothing stacks on top of either. Both are fixed
    // elements, so offsetParent cannot tell whether they are showing.
    var boot = document.getElementById("boot");
    var booting = boot && !boot.classList.contains("off");
    var consent = document.getElementById("consent"), answered = false;
    try { answered = !!localStorage.getItem("avas-consent"); } catch (e) { answered = true; }
    var asking = consent && !consent.hidden && !answered;
    return !booting && !asking;
  }
  function start() {
    build();
    var s = store.get();
    if (s.state) { pill.removeAttribute("hidden"); return; }
    var waited = 0;
    var t = setInterval(function () {
      waited += 400;
      if (ready() && waited >= 1200) { clearInterval(t); if (!store.get().state) { open(false); } }
      if (waited > 60000) { clearInterval(t); pill.removeAttribute("hidden"); }
    }, 400);
  }
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", start); } else { start(); }
})();
