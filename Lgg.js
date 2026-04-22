

// const API_KEY  = "41fb928cc56c7a35b85e617ea481898c";
// const LIST_ID  = "8646561";
// const BASE     = "https://api.themoviedb.org/3";
// const IMG_W500 = "https://image.tmdb.org/t/p/w500";
// const IMG_W185 = "https://image.tmdb.org/t/p/w185";

// const tmdbUrl = (id, mediaType) =>
//   `https://www.themoviedb.org/${mediaType === "tv" ? "tv" : "movie"}/${id}`;

// /* ── helpers ─────────────────────────────────── */
// const tmdb = async (path) => {
//   const res = await fetch(`${BASE}${path}?api_key=${API_KEY}`);
//   if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
//   return res.json();
// };

// const poster = (path, size = IMG_W500) =>
//   path ? `${size}${path}` : "AST/placeholder.jpg";

// /* ── fetch list ──────────────────────────────── */
// const getList = async () => {
//   try {
//     const data = await tmdb(`/list/${LIST_ID}`);
//     return data.items || [];
//   } catch (err) {
//     console.error("Failed to load list:", err);
//     return [];
//   }
// };

// /* ── genre map ───────────────────────────────── */
// const GENRE_MAP = {
//   28:"Action", 12:"Adventure", 16:"Animation", 35:"Comedy",
//   80:"Crime", 99:"Documentary", 18:"Drama", 10751:"Family",
//   14:"Fantasy", 36:"History", 27:"Horror", 10402:"Music",
//   9648:"Mystery", 10749:"Romance", 878:"Sci-Fi", 10770:"TV Movie",
//   53:"Thriller", 10752:"War", 37:"Western",
//   10759:"Action", 10762:"Kids", 10763:"News", 10764:"Reality",
//   10765:"Sci-Fi", 10766:"Soap", 10767:"Talk", 10768:"War",
// };

// const genreLabel = (ids = []) =>
//   ids.slice(0, 2).map(id => GENRE_MAP[id] || "").filter(Boolean).join(" · ") || "—";

// /* ═══════════════════════════════════════════════
//    RENDER: TRENDING  — each card = <a> link to TMDB
//    ═══════════════════════════════════════════════ */
// const renderTrending = (items) => {
//   const wrapper = document.querySelector(".sec:nth-of-type(1) .hscroll");
//   if (!wrapper) return;

//   wrapper.innerHTML = items.slice(0, 9).map((item, i) => {
//     const isHot = item.vote_average >= 8;
//     const isNew = item.vote_average < 7;
//     const tag   = isHot
//       ? `<span class="t-card-tag hot">HOT</span>`
//       : isNew ? `<span class="t-card-tag new">NEW</span>` : "";

//     return `
//       <a class="t-card"
//          href="${tmdbUrl(item.id, item.media_type)}"
//          target="_blank" rel="noopener noreferrer"
//          title="Open on TMDB">
//         <img src="${poster(item.poster_path)}" alt="${item.title || item.name}" loading="lazy"/>
//         <span class="t-rank">#${i + 1}</span>
//         ${tag}
//         <div class="t-card-overlay">
//           <div class="t-card-name">${item.title || item.name}</div>
//           <div class="t-card-sub">${genreLabel(item.genre_ids)} · ${item.media_type === "tv" ? "TV Show" : "Movie"}</div>
//         </div>
//       </a>`;
//   }).join("");
// };

// /* ═══════════════════════════════════════════════
//    RENDER: SERIES  — each card = <a> link to TMDB
//    ═══════════════════════════════════════════════ */
// const renderSeries = (items) => {
//   const wrapper = document.querySelector(".sec:nth-of-type(2) .hscroll");
//   if (!wrapper) return;

//   const tvItems = items.filter(i => i.media_type === "tv");

//   wrapper.innerHTML = tvItems.slice(0, 10).map((item) => {
//     const pct   = Math.round((item.vote_average / 10) * 100);
//     const isHot = item.vote_average >= 8;
//     const badge = isHot ? `<span class="s-new">HOT</span>` : "";

//     return `
//       <a class="s-card"
//          href="${tmdbUrl(item.id, item.media_type)}"
//          target="_blank" rel="noopener noreferrer"
//          title="Open on TMDB">
//         <img src="${poster(item.poster_path)}" alt="${item.name || item.title}" loading="lazy"/>
//         ${badge}
//         <div class="s-card-info">
//           <div class="s-card-title">${item.name || item.title}</div>
//           <div class="s-card-meta">★ ${item.vote_average.toFixed(1)} · ${genreLabel(item.genre_ids)}</div>
//         </div>
//         <div class="s-card-bar">
//           <div class="s-card-bar-fill" style="width:${pct}%"></div>
//         </div>
//       </a>`;
//   }).join("");
// };

// /* ═══════════════════════════════════════════════
//    RENDER: CHARACTERS  — each card links to TMDB person
//    ═══════════════════════════════════════════════ */
// const renderCharacters = async (items) => {
//   const wrapper = document.querySelector(".sec:nth-of-type(3) .hscroll");
//   if (!wrapper) return;

//   wrapper.innerHTML = Array(8).fill(`
//     <div class="ch-card" style="opacity:.3">
//       <div class="ch-ring" style="background:#1e2340">
//         <div class="ch-inner" style="background:#1e2340"></div>
//       </div>
//       <div class="ch-name">Loading…</div>
//     </div>`).join("");

//   const creditRequests = items.slice(0, 8).map(async (item) => {
//     try {
//       const type = item.media_type === "tv" ? "tv" : "movie";
//       const data = await tmdb(`/${type}/${item.id}/credits`);
//       const lead = (data.cast || []).find(a => a.profile_path) || data.cast?.[0];
//       return lead ? { actor: lead, show: item.title || item.name } : null;
//     } catch { return null; }
//   });

//   const credits = (await Promise.all(creditRequests)).filter(Boolean);

//   wrapper.innerHTML = credits.map(({ actor, show }) => `
//     <a class="ch-card"
//        href="https://www.themoviedb.org/person/${actor.id}"
//        target="_blank" rel="noopener noreferrer"
//        style="text-decoration:none"
//        title="View ${actor.name} on TMDB">
//       <div class="ch-ring">
//         <div class="ch-inner">
//           <img src="${poster(actor.profile_path, IMG_W185)}" alt="${actor.name}" loading="lazy"/>
//         </div>
//       </div>
//       <div class="ch-name">${actor.name}</div>
//       <div class="ch-bof">${show}</div>
//     </a>`).join("");
// };

// /* ═══════════════════════════════════════════════
//    RENDER: HERO  — Watch Now button links to TMDB
//    ═══════════════════════════════════════════════ */
// const renderHero = (items) => {
//   if (!items.length) return;
//   const top = items[0];

//   const heroImg = document.querySelector(".hero-img");
//   if (heroImg && top.backdrop_path)
//     heroImg.style.backgroundImage = `url('https://image.tmdb.org/t/p/original${top.backdrop_path}')`;

//   const h1 = document.querySelector(".hero h1");
//   if (h1) {
//     const words = (top.title || top.name || "").split(" ");
//     const last  = words.pop();
//     h1.innerHTML = `${words.join(" ")} <em>${last}</em><br/>Tells a Story`;
//   }

//   const rating = document.querySelector(".hero-meta span:nth-child(2)");
//   if (rating) rating.textContent = `${top.vote_average.toFixed(1)} / 10`;

//   const badges = document.querySelector(".hero-badge-row");
//   if (badges && top.genre_ids) {
//     const colors = ["action", "fantasy", "drama"];
//     badges.innerHTML = top.genre_ids.slice(0, 3).map((id, i) =>
//       `<span class="hbadge ${colors[i] || "action"}">${GENRE_MAP[id] || "—"}</span>`
//     ).join("");
//   }

//   // Watch Now → open TMDB page
//   const watchBtn = document.querySelector(".btn-primary");
//   if (watchBtn) {
//     watchBtn.style.cursor = "pointer";
//     watchBtn.onclick = () => window.open(tmdbUrl(top.id, top.media_type), "_blank", "noopener");
//   }

//   // Add to List → same TMDB page
//   const listBtn = document.querySelector(".btn-outline");
//   if (listBtn) {
//     listBtn.style.cursor = "pointer";
//     listBtn.onclick = () => window.open(tmdbUrl(top.id, top.media_type), "_blank", "noopener");
//   }
// };

// /* ═══════════════════════════════════════════════
//    NAV LINKS  — TV Shows / Movies → TMDB browse
//    ═══════════════════════════════════════════════ */
// const initNavLinks = () => {
//   document.querySelectorAll(".nav-links a").forEach(link => {
//     const text = link.textContent.trim().toLowerCase();
//     if (text === "tv shows") {
//       link.href   = "https://www.themoviedb.org/tv";
//       link.target = "_blank";
//       link.rel    = "noopener noreferrer";
//     } else if (text === "movies") {
//       link.href   = "https://www.themoviedb.org/movie";
//       link.target = "_blank";
//       link.rel    = "noopener noreferrer";
//     }
//   });
// };

// /* ═══════════════════════════════════════════════
//    GENRE PILLS FILTER
//    ═══════════════════════════════════════════════ */
// const initGenrePills = (items) => {
//   const pills   = document.querySelectorAll(".gpill");
//   const wrapper = document.querySelector(".sec:nth-of-type(1) .hscroll");
//   if (!pills.length || !wrapper) return;

//   const PILL_GENRE_MAP = {
//     "All": null, "Action": 28, "Sci-Fi": 878, "Fantasy": 14,
//     "Psychological": 9648, "Anime": 16, "Drama": 18,
//   };

//   pills.forEach(pill => {
//     pill.addEventListener("click", () => {
//       pills.forEach(p => p.classList.remove("active"));
//       pill.classList.add("active");
//       const genreId  = PILL_GENRE_MAP[pill.textContent.trim()];
//       const filtered = genreId ? items.filter(i => (i.genre_ids || []).includes(genreId)) : items;
//       renderTrending(filtered.length ? filtered : items);
//     });
//   });
// };

// /* ═══════════════════════════════════════════════
//    FAQ TOGGLE
//    ═══════════════════════════════════════════════ */
// function toggleFi(el) {
//   const fi    = el.closest(".fi");
//   document.querySelectorAll(".fi").forEach(f => {
//     if (f !== fi) {
//       f.classList.remove("open");
//       const icon = f.querySelector(".fi-icon");
//       if (icon) icon.textContent = "+";
//     }
//   });
//   fi.classList.toggle("open");
//   const icon = fi.querySelector(".fi-icon");
//   if (icon) icon.textContent = fi.classList.contains("open") ? "−" : "+";
// }
// window.toggleFi = toggleFi;

// /* ═══════════════════════════════════════════════
//    INIT
//    ═══════════════════════════════════════════════ */
// document.addEventListener("DOMContentLoaded", async () => {
//   initNavLinks();

//   const items = await getList();
//   if (!items.length) { console.warn("No items from TMDB list."); return; }

//   renderHero(items);
//   renderTrending(items);
//   renderSeries(items);
//   renderCharacters(items);
//   initGenrePills(items);
// });
