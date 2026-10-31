# PartyGames

Raccolta di giochi di gruppo e party game gratuiti da fare in casa, in italiano e inglese.
Sito statico generato da un piccolo script Node.js senza dipendenze, pubblicabile su
GitHub Pages o Cloudflare Pages.

## Comandi

| Comando | Cosa fa |
|---|---|
| `node tools/build.mjs` | Genera il sito in `dist/` (pagine, `sitemap.xml`, `robots.txt`, `ads.txt`, manifest, `404.html`) |
| `node tools/serve.mjs` | Serve `dist/` su http://localhost:8080 con lo stesso comportamento di GitHub Pages |
| `node tools/audit.mjs` | Controlla che non ci siano riferimenti personali, domini esterni, immagini di terzi o contenuti non adatti ad AdSense |
| `node tools/render-images.mjs` | Rigenera icone e immagini Open Graph (serve Chrome o Edge installato) |

Richiede Node.js 18 o superiore.

## Struttura

```
src/
  config.mjs              dominio, AdSense, Analytics, dati del titolare  ← da compilare
  i18n/<lingua>.mjs       testi dell'interfaccia, percorsi URL, SEO della homepage
  games/registry.mjs      elenco dei giochi (unica fonte per home, sitemap, OG)
  games/<id>/             markup e articolo SEO di ogni gioco (dalla Fase 3)
  content/<lingua>/       testi di privacy, cookie, chi siamo, contatti
  templates/              layout comune e template delle pagine
public/                   copiato così com'è in dist/
  assets/css/base.css     design system (token, componenti, ads, cookie banner)
  assets/js/core/         consent · ads · analytics · ui · teams · home
  assets/js/games/        logica dei singoli giochi
  assets/data/            domande e contenuti dei giochi, per lingua
  assets/fonts/           Inter e Poppins (SIL OFL 1.1, licenze incluse)
  assets/img/             icone e immagini OG generate da tools/render-images.mjs
tools/                    build, server, audit, generatore immagini
_legacy/                  copia di lavoro dei giochi originali — esclusa da git e dal deploy
```

## URL

| Pagina | Italiano | English |
|---|---|---|
| Home | `/` | `/en/` |
| Gioco | `/giochi/<slug>/` | `/en/games/<slug>/` |
| Privacy | `/privacy/` | `/en/privacy/` |
| Cookie | `/cookie-policy/` | `/en/cookie-policy/` |
| Chi siamo | `/chi-siamo/` | `/en/about/` |
| Contatti | `/contatti/` | `/en/contact/` |

Ogni pagina è una cartella con `index.html`, quindi gli URL puliti funzionano su
qualsiasi hosting statico. Gli URL inesistenti ricevono `404.html`, che mostra la
lingua corretta in base al percorso.

## Aggiungere un gioco

Ogni gioco è composto da quattro parti:

| File | Contenuto |
|---|---|
| `src/games/<id>/stage.html` | Markup dell'area di gioco, unico per tutte le lingue: i testi sono segnaposto `{{ui.chiave}}` |
| `src/games/<id>/<lingua>.content.html` | Articolo SEO sotto il gioco: regole, giocatori, consigli e FAQ (le FAQ diventano dati strutturati `FAQPage`) |
| `public/assets/data/<id>.<lingua>.mjs` | Modulo ES con `ui` (testi dell'interfaccia) e i contenuti (domande, penitenze…) |
| `public/assets/js/games/<id>.js` | Logica del gioco (modulo ES), che usa `assets/js/core/game-kit.mjs` |

Passi:

1. Aggiungere o aggiornare la voce in `src/games/registry.mjs` (testi e slug per lingua; `teams: true` se il gioco usa le squadre globali).
2. Creare i quattro file. La logica carica i dati con `loadGameData()` e chiama `PG.ads.reveal("results")` quando mostra la schermata finale.
3. Per le squadre usare `PG.teams` (o `mountScoreboard` del game kit); per salvare dati usare `PG.ui.storage` con chiavi che iniziano per `pg_`.
4. Impostare `status: "live"`, poi lanciare `node tools/render-images.mjs` (se sono cambiati titoli) e `node tools/build.mjs`.

Il formato delle FAQ nell'articolo è:
`<details class="faq__item"><summary><h3>Domanda</h3></summary><p>Risposta</p></details>`

La corrispondenza tra id e file originali è in `_legacy/MAPPING.md` (solo locale).

## Aggiungere una lingua

1. Aggiungere il codice in `SITE.languages` (`src/config.mjs`).
2. Copiare `src/i18n/en.mjs` in `src/i18n/<codice>.mjs` e tradurre i valori.
3. Creare `src/content/<codice>/` con le quattro pagine.
4. Aggiungere `i18n.<codice>` a ogni gioco del registro.

## Pubblicità e consenso

- Gli slot sono generati da `adSlot()` in `src/templates/util.mjs` e marcati nel codice con
  `<!-- GOOGLE ADSENSE CODE HERE -->`. Le posizioni sono: `top` (sotto l'header), `rail`
  (sidebar, solo da 1280px in su), `bottom` (fondo pagina) e `results` (fine gioco).
- Lo spazio di ogni slot è riservato via CSS, così il layout non si sposta.
- `consent.js` imposta Google Consent Mode v2 su "denied" prima di qualsiasi tag. AdSense e
  Analytics vengono caricati solo dopo una scelta dell'utente; senza consenso gli annunci
  sono non personalizzati.

## Checklist prima della pubblicazione

- [ ] `src/config.mjs`: `url` con il dominio reale, `controller` con i dati del titolare.
- [ ] Testi legali verificati da un professionista (sono modelli generici).
- [ ] Dopo l'approvazione AdSense: `adsense.enabled: true`, `client`, ID degli `slots`, `showPlaceholders: false`.
- [ ] **CMP certificata:** per annunci personalizzati in SEE, Regno Unito e Svizzera Google
      richiede una CMP certificata IAB TCF v2.2. Opzione più semplice: attivare
      "Privacy e messaggi" nel pannello AdSense e disattivare il banner interno
      (rimuovere `renderConsentBanner` dal layout e collegare `PG.consent` alla CMP).
- [ ] Facoltativo: `analytics.gaId` per Google Analytics 4.
- [ ] `node tools/build.mjs && node tools/audit.mjs` senza errori.

## Deploy

- **GitHub Pages:** in Settings → Pages scegliere *GitHub Actions* come sorgente.
  `.github/workflows/deploy.yml` esegue build e audit a ogni push su `main`. L'indirizzo
  (`utente.github.io/<repo>` oppure il dominio personalizzato) viene letto da `actions/configure-pages`
  e passato alla build come `SITE_URL` e `BASE_PATH`: non serve modificare `src/config.mjs`.
- **Cloudflare Pages:** comando di build `node tools/build.mjs`, cartella di output `dist`,
  variabile d'ambiente `SITE_URL` con il dominio (oppure `url` in `src/config.mjs`).
