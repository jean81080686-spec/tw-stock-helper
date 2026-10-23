# 台股投資小幫手 — static site

Implementation of the Claude Design mockups for 首頁, 今日漲停股 and 我的持股.
Plain HTML/CSS/JS with no build step. Deploy on Vercel as-is (Framework preset: Other, no build command), open `index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000   # http://localhost:8000
```

| Page | File | Mockup |
| --- | --- | --- |
| 首頁 | `index.html` | `首頁.dc.html` |
| 今日漲停股 | `limit-up.html` | `今日漲停股.dc.html` |
| 我的持股 | `holdings.html` | `我的持股.dc.html` |

- `css/tokens.css`: design tokens, copied verbatim from the Stock Dashboard design system.
- `css/app.css`: layout and component styles (Button, Input, StatCard, ChangeText, Badge, SegmentedControl).
- `js/data.js`: sample quotes, market and 漲停 data, and the holdings store.
- `js/ui.js`: formatters, inline Lucide icons, the shared header and footer, and component builders.

Holdings are saved in `localStorage` under `twhelper.holdings.v1`. The first visit starts from 5 sample holdings.
The 我的持股摘要 section on the homepage is calculated from the same data.
All prices are sample data as of 2026/10/23. Only the codes listed in `QUOTES` are recognised.
