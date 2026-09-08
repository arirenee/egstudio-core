const INTAKE_OPEN = true;
const STRIPE = "https://buy.stripe.com/aFabIU9yVc6I9zl5ZX9EI06";
const QUEUE = "mailto:ops@egstudio.tech?subject=" + encodeURIComponent("EG Studio — next seat") + "&body=" + encodeURIComponent("Agency:\nMonthly video volume:\nWhen do you need the next seat:\n");
const ORDER = INTAKE_OPEN ? STRIPE : QUEUE;
const ORDER_LABEL = INTAKE_OPEN ? "Start the $1,500 sprint" : "Get the next open seat";

const FORMATS = [
  { id: "exec", n: "01", name: "Executive thought leadership", blurb: "Founder on camera. Cut, paced, captioned — ready for LinkedIn and Reels.", caption: "The founder talks. We cut.", src: "assets/samples/sample-executive.mp4", poster: "assets/samples/sample-executive.jpg" },
  { id: "saas", n: "02", name: "B2B SaaS cutdowns", blurb: "A feature the buyer understands in under 30 seconds. UI in. Fluff out.", caption: "The feature, in 30 seconds.", src: "", poster: "assets/samples/sample-executive.jpg" },
  { id: "podcast", n: "03", name: "Webinar & podcast", blurb: "Up to 90 minutes of talk mined into hook-led clips. Multi-speaker cuts included.", caption: "90 minutes in. 15 posts out.", src: "assets/samples/sample-podcast.mp4", poster: "assets/samples/sample-podcast.jpg" },
  { id: "proof", n: "04", name: "Case & proof hooks", blurb: "Metric, quote, next step. Built to move a prospect to the sales call.", caption: "The number. Then the next step.", src: "", poster: "assets/samples/sample-podcast.jpg" },
];

const OBJECTIONS = [
  { fear: "We're paying $1,500 before we've seen a cut.", answer: "Days 1–3 are one pilot — type, color, pacing, captions. Videos 2–15 do not start until you sign off in writing. That is the gate. It is not a refund." },
  { fear: "Our client will see a vendor name.", answer: "Unbranded Frame.io or Drive. Your file names — [Client]_Batch01_Video01.mp4. No EG chrome, no EG metadata. We never email your client." },
  { fear: "Thirty days is slow — or '2-day revisions' is bait.", answer: "The sprint is 15 videos across Days 10, 20, and 30. A revision turn is 2 business days after timestamped notes. The full set is not a 2-day job." },
];

const FAQS = [
  { q: "What if we pay and the first cut is wrong?", a: "Days 1–3 produce one pilot. The remaining 14 wait for written sign-off. Extra Five skips the pilot because the machine is already calibrated. This is not a refund promise." },
  { q: "Will our client see EG Studio?", a: "No. Deliverables go to an unbranded Frame.io link or a named folder. File names follow your convention. We do not contact your clients or attach EG Studio metadata." },
  { q: "What footage can we send?", a: "Each sprint covers up to 90 minutes of source: Zoom, podcast, iPhone, keynote, product capture. Work beyond 90 minutes is scoped separately through ops@egstudio.tech." },
  { q: "What actually arrives, and when?", a: "15 finished 9:16s in 30 days, in three batches on Days 10, 20, and 30. Two revision rounds per asset. After timestamped notes land, the revision turn is 2 business days. The full set is not a 2-day job." },
  { q: "Can we set our own resale price?", a: "Yes. What you bill the client is yours. Wholesale is $1,500 per sprint. The retainer math on this page is a model, not a promised outcome." },
  { q: "Is this a monthly contract?", a: "No. Buy a sprint when you close work. A partner seat is the same 15 / 30 deliverable, billed $1,500 each 30-day cycle, and occupies one of eight monthly seats. Cancel before the next cycle." },
  { q: "What if intake is closed?", a: "When a cycle is closed, checkout comes down and this page says so. Email ops@egstudio.tech for the next seat. Do not pay if the page says intake is closed." },
];

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

document.querySelectorAll(".js-order").forEach((a) => {
  a.href = ORDER;
  if (!a.classList.contains("nav-cta") && a.textContent.trim().startsWith("Start")) {
    a.textContent = a.textContent.includes("sprint") && a.textContent.length < 20 ? (INTAKE_OPEN ? "Start sprint" : "Next seat") : ORDER_LABEL;
  }
});

if (!INTAKE_OPEN) {
  document.querySelectorAll(".chip").forEach((el) => {
    el.innerHTML = '<span class="dot" style="background:var(--subtle)"></span> Intake closed · 8 seats / month';
  });
}

const list = document.getElementById("formatList");
if (list) {
  list.innerHTML = FORMATS.map((f, i) =>
    `<li><button type="button" data-i="${i}" aria-pressed="${i === 0}"><span class="n">${f.n}</span><span class="name">${f.name}</span><span class="blurb">${f.blurb}</span></button></li>`
  ).join("");
  const video = document.getElementById("proofVideo");
  const caption = document.getElementById("proofCaption");
  list.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const f = FORMATS[i];
    list.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    if (video) {
      video.poster = f.poster;
      const src = video.querySelector("source");
      if (f.src) {
        src.src = f.src;
        video.load();
        video.play().catch(() => {});
      } else {
        src.removeAttribute("src");
        video.load();
      }
    }
    if (caption) caption.textContent = f.caption;
  });
}

const obj = document.getElementById("objections");
if (obj) {
  obj.innerHTML = OBJECTIONS.map((o) => `<details><summary>${o.fear}</summary><p>${o.answer}</p></details>`).join("");
}

const faq = document.getElementById("faq");
if (faq) {
  faq.innerHTML = FAQS.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join("");
}

const slider = document.getElementById("retainer");
const out = document.getElementById("retainerOut");
const rows = document.getElementById("calcRows");
function renderCalc(v) {
  const keep = v - 1500;
  out.textContent = usd.format(v);
  rows.innerHTML = [
    ["In-house junior", v - 5500, 5500],
    ["Freelance bench", v - 2750, 2750],
    ["EG sprint", keep, 1500],
  ].map(([name, k, cost], i) =>
    `<div><p class="kicker">${name}</p><p class="figure" style="color:${i === 2 ? "var(--fg)" : "var(--muted)"}">${usd.format(k)}</p><p class="fine">modeled keep after this cost · ${usd.format(cost)}</p></div>`
  ).join("");
}
if (slider && out && rows) {
  renderCalc(Number(slider.value));
  slider.addEventListener("input", () => renderCalc(Number(slider.value)));
}

const hero = document.getElementById("hero");
const sticky = document.getElementById("sticky");
const heroVid = document.getElementById("heroVideo");
if (heroVid && window.matchMedia("(min-width: 768px)").matches) {
  heroVid.play().catch(() => {});
}
if (hero && sticky) {
  const io = new IntersectionObserver(([e]) => {
    sticky.hidden = e.isIntersecting;
  }, { threshold: 0.12 });
  io.observe(hero);
}
