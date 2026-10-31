/* =========================================================
   CONFIGURAZIONE CENTRALE DEL SITO
   Tutti i valori "da produzione" (dominio, AdSense, Analytics,
   dati del titolare) stanno qui: il resto del codice li legge
   da questo file. Dopo aver modificato, rilanciare:
     node tools/build.mjs
   ========================================================= */

export const SITE = {
  name: "PartyGames",

  // Dominio definitivo, SENZA slash finale.
  // TODO produzione: sostituire con il dominio reale.
  url: "https://www.example.com",

  // Sottocartella di pubblicazione, SENZA slash finale.
  // "" con dominio personalizzato (consigliato). Per GitHub Pages
  // senza dominio (utente.github.io/PartyGames) usare
  // "/PartyGames".
  basePath: "",

  // Lingue disponibili. La prima è la lingua di default ed è
  // servita alla radice "/"; le altre sotto "/<codice>/".
  // Per aggiungere una lingua: creare src/i18n/<codice>.mjs,
  // src/content/<codice>/ e le voci nel registro giochi.
  languages: ["it", "en"],
  defaultLanguage: "it",

  themeColor: "#0a0e1a",

  // Data dell'ultimo aggiornamento dei documenti legali (YYYY-MM-DD)
  legalUpdated: "2026-10-17",

  // Dati del titolare del trattamento (obbligatori per il GDPR).
  // TODO produzione: compilare prima della pubblicazione.
  controller: {
    name: "[NOME E COGNOME / RAGIONE SOCIALE DEL TITOLARE]",
    address: "[INDIRIZZO DEL TITOLARE]",
    email: "[EMAIL DI CONTATTO]"
  },

  adsense: {
    // false = gli slot mostrano solo il segnaposto e nessuno script
    // Google viene caricato. Impostare true dopo l'approvazione.
    enabled: false,
    // Publisher ID AdSense, es. "ca-pub-1234567890123456"
    client: "ca-pub-XXXXXXXXXXXXXXXX",
    // Mostra un riquadro tratteggiato con le dimensioni dello slot
    // (utile in sviluppo). In produzione impostare false.
    showPlaceholders: true,
    // ID delle unità pubblicitarie create nel pannello AdSense
    slots: {
      top: "0000000001",      // banner orizzontale sotto l'header
      rail: "0000000002",     // sidebar laterali (solo desktop)
      bottom: "0000000003",   // fondo pagina
      results: "0000000004"   // schermata di fine gioco / risultati
    }
  },

  analytics: {
    // ID di misurazione Google Analytics 4, es. "G-XXXXXXXXXX".
    // Vuoto = Analytics disattivato.
    gaId: ""
  },

  // Versione del consenso: incrementarla quando cambiano le finalità
  // o i fornitori, così il banner viene richiesto di nuovo a tutti.
  consentVersion: 1,
  // Giorni dopo i quali la scelta sui cookie viene richiesta di nuovo
  consentMaxAgeDays: 180
};
