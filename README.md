# Uplands Spelmansförbund – hemsida

Statisk webbplats för [Uplands Spelmansförbund](https://github.com/kredor/USF). Källkod ligger på GitHub; publicering sker automatiskt via Netlify när ändringar pushas till `main`.

**Produktion (ny design):** Netlify (URL finns i Netlify-kontot)  
**Gammal sajt:** [uplandsspel.se](https://www.uplandsspel.se/) (WordPress, tills DNS byts)

---

## Kom igång (ny redaktör)

### 1. Konto och åtkomst

1. Skapa konto på [github.com](https://github.com).
2. Be repo-ägaren bjuda in dig som **collaborator** med **Write**-behörighet till `kredor/USF`.

### 2. Installera program (Windows)

| Program | Ladda ner |
|---------|-----------|
| Git | https://git-scm.com/download/win |
| Node.js (LTS) | https://nodejs.org/ |
| Cursor (rekommenderas) | https://cursor.com/ |

Kontrollera i PowerShell:

```powershell
git --version
node --version
npm --version
```

### 3. Hämta projektet

```powershell
cd C:\Projekt
git clone https://github.com/kredor/USF.git USF
cd USF
npm install
```

### 4. Förhandsgranska lokalt

**Öppna inte HTML-filer direkt i webbläsaren** (`file:///`). Använd alltid den lokala servern:

```powershell
node serve.mjs
```

Öppna [http://localhost:3000](http://localhost:3000).

Öppna projektmappen i Cursor: **File → Open Folder** → välj `USF`.

---

## Publicera ändringar

När du är nöjd med ändringarna i webbläsaren:

```powershell
git pull
git add .
git commit -m "Kort beskrivning av vad du ändrat"
git push
```

Netlify bygger om sajten automatiskt (ofta inom 1–2 minuter).

**Tips:** Kör `git pull` först om någon annan också jobbat i repot, så du inte skriver över deras ändringar.

### Första gången du pushar

GitHub kan be om inloggning. Använd ditt GitHub-konto och en **Personal Access Token** som lösenord (inte vanligt lösenord), eller installera [GitHub Desktop](https://desktop.github.com/) om du föredrar grafiskt gränssnitt.

---

## Vilka filer ska jag redigera?

| Fil | Innehåll |
|-----|----------|
| `index.html` | Startsida, nyheter |
| `kalendarium.html` | Evenemang och kalender |
| `forbundet.html` | Om förbundet, styrelse, dokument |
| `medlem.html` | Medlemskap |
| `forsaljning.html` | Noter och försäljning |
| `instrumentforsakring.html` | Instrumentförsäkring |
| `oktoberstamman.html` | Oktoberstämman |
| `spelman.html` | Spelmän och grupper |
| `uplandsspelmannen.html` | Tidningen Uplandsspelmannen |
| `style.css` | Färger, typsnitt, layout |
| `script.js` | Meny, kalenderfilter m.m. |
| `dokument/` | PDF-filer (stadgar, noter, protokoll) |
| `images/` | Bilder |
| `Brand_assets/` | Logotyp |

`noter.html` omdirigerar till `forsaljning.html` (gammal länk).

### Viktigt om menyn

Sidhuvud och navigering finns **i varje HTML-fil**. Om du ändrar menyn på en sida måste samma ändring göras på alla sidor – eller be Cursor: *"Uppdatera navigeringen på alla sidor"*.

---

## Hjälp i Cursor

Exempel på vad du kan skriva i chatten:

- *"Uppdatera kalendarium med spelträff 3 juni 2026"*
- *"Lägg till en nyhetsruta på startsidan om …"*
- *"Ändra styrelseledamot X till Y på forbundet.html"*

Starta alltid `node serve.mjs` och kolla resultatet i webbläsaren innan du pushar.

---

## Felsökning

| Problem | Lösning |
|---------|---------|
| Sidan ser konstig ut lokalt | Kör `node serve.mjs`, använd http://localhost:3000 |
| `git push` nekas | Kontrollera att du är inbjuden till repot; logga in på GitHub |
| Konflikt vid `git pull` | Be repo-ägaren eller Cursor om hjälp att lösa merge |
| PDF-länkar fungerar inte | Kontrollera att filen finns under `dokument/` |
| Ändringar syns inte online | Vänta på Netlify-deploy; kolla att `git push` lyckades |

---

## Teknisk översikt (för den som är nyfiken)

- **Typ:** Statisk HTML/CSS/JavaScript (inget WordPress, inget build-steg)
- **Repo:** https://github.com/kredor/USF
- **Hosting:** Netlify (`netlify.toml` i projektroten)
- **Lokal server:** `serve.mjs` (port 3000)
- **Valfritt:** `npm install` + `screenshot.mjs` för skärmdumpar (behövs inte för vanlig redigering)

---

## Kontakt

Förbundets e-post: ordf@uplandsspel.se, kassor@uplandsspel.se  
Tekniska frågor om repot/Netlify: kontakta repo-ägaren.
