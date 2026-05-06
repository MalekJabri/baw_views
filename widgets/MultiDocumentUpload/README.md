# MultiDocumentUpload Widget

Widget za upload više dokumenata sa tabelom, selekcijom tipa dokumenta i mogućnošću brisanja pre upload-a u LocalStore za IBM Business Automation Workflow.

## Pregled

MultiDocumentUpload widget omogućava korisnicima da:
- Izaberu više fajlova odjednom (file input ili drag & drop)
- Pregledaju uploadovane fajlove u tabeli
- Izaberu tip dokumenta za svaki fajl iz dropdown liste
- Obrišu fajlove pre upload-a
- Upload-uju sve fajlove u LocalStore jednim klikom

## Karakteristike

### 🎯 Glavne funkcionalnosti
- **Multi-file upload**: Podržava upload više fajlova odjednom
- **Drag & Drop**: Intuitivno prevlačenje fajlova
- **Tabela dokumenata**: Pregled svih uploadovanih dokumenata
- **Selekcija tipa**: Dropdown za izbor tipa dokumenta za svaki fajl
- **Validacija**: Provera veličine fajla i ekstenzije
- **Base64 konverzija**: Automatska konverzija fajlova u base64 format
- **LocalStore integracija**: Upload dokumenata u BAW LocalStore

### 🎨 UI/UX
- IBM Carbon Design System styling
- Responsive dizajn
- Accessibility podrška (ARIA atributi)
- Animacije i hover efekti
- Drag & drop vizuelni feedback

## Instalacija

### Struktura fajlova

```
widgets/MultiDocumentUpload/
├── MultiDocumentUpload.svg          # Palette ikona (120x120px)
├── README.md                         # Ova dokumentacija
├── AdvancePreview/
│   ├── MultiDocumentUpload.html     # Preview HTML
│   └── MultiDocumentUploadSnippet.js # Preview JavaScript
└── widget/
    ├── Layout.html                   # Widget HTML struktura
    ├── InlineCSS.css                # Widget stilovi
    ├── inlineJavascript.js          # Widget logika
    ├── config.json                   # Widget metadata
    ├── DocumentItem.json            # Business object definicija
    ├── datamodel.md                 # Data model dokumentacija
    ├── eventHandler.md              # Event handler dokumentacija
    └── events/
        └── change.js                 # Change event handler
```

## Korišćenje

### 1. Dodavanje widgeta u Coach View

1. Otvorite Process Designer u BAW
2. Kreirajte ili otvorite Coach View
3. Pronađite **MultiDocumentUpload** widget u paleti
4. Prevucite widget na canvas

### 2. Konfiguracija Data Binding-a

Kreirajte varijablu tipa `List<DocumentItem>`:

```javascript
// U Coach View Variables
tw.local.uploadedDocuments (List<DocumentItem>)
```

Bind-ujte ovu varijablu na widget:
- Selektujte widget
- U Properties panelu, bind `Documents` na `tw.local.uploadedDocuments`

### 3. Konfiguracija opcija

#### documentTypes (obavezno)
Lista dostupnih tipova dokumenata:

```json
[
  { "value": "invoice", "name": "Faktura" },
  { "value": "contract", "name": "Ugovor" },
  { "value": "report", "name": "Izveštaj" },
  { "value": "other", "name": "Ostalo" }
]
```

#### maxFileSize (opciono)
Maksimalna veličina fajla u MB (default: 10):

```javascript
10  // 10 MB
```

#### allowedExtensions (opciono)
Lista dozvoljenih ekstenzija (prazno = sve dozvoljeno):

```json
["pdf", "docx", "xlsx", "jpg", "png"]
```

#### maxFiles (opciono)
Maksimalan broj fajlova (null = bez limita):

```javascript
5  // Maksimalno 5 fajlova
```

## Primeri korišćenja

### Primer 1: Osnovni upload

```javascript
// Coach View - Initialization
tw.local.uploadedDocuments = [];

// Nakon što korisnik upload-uje dokumente
// Widget automatski popunjava tw.local.uploadedDocuments
```

### Primer 2: Pristup uploadovanim dokumentima

```javascript
// U Service Task ili Script Task
var documents = tw.local.uploadedDocuments;

for (var i = 0; i < documents.listLength; i++) {
  var doc = documents[i];
  
  tw.local.log("Dokument: " + doc.fileName);
  tw.local.log("Tip: " + doc.documentType);
  tw.local.log("Veličina: " + doc.fileSize + " bytes");
  
  // Pristup base64 sadržaju
  var content = doc.fileContent;
}
```

### Primer 3: Čuvanje u FileNet

```javascript
// Čuvanje dokumenata u IBM FileNet
var documents = tw.local.uploadedDocuments;

for (var i = 0; i < documents.listLength; i++) {
  var doc = documents[i];
  
  // Kreiranje dokumenta u FileNet-u
  tw.system.document.createDocument(
    doc.fileName,
    doc.fileContent,  // Base64 content
    doc.documentType,
    "MyDocumentClass"
  );
}
```

### Primer 4: Validacija pre procesiranja

```javascript
// Provera da li su svi dokumenti određenog tipa
var documents = tw.local.uploadedDocuments;
var hasInvoice = false;

for (var i = 0; i < documents.listLength; i++) {
  if (documents[i].documentType === "invoice") {
    hasInvoice = true;
    break;
  }
}

if (!hasInvoice) {
  tw.local.errorMessage = "Morate uploadovati bar jednu fakturu";
}
```

## Data Model

### DocumentItem Business Object

| Property | Type | Description |
|----------|------|-------------|
| `id` | String | Jedinstveni identifikator dokumenta |
| `fileName` | String | Originalni naziv fajla |
| `fileSize` | Integer | Veličina fajla u bajtovima |
| `fileExtension` | String | Ekstenzija fajla (npr. "pdf", "docx") |
| `documentType` | String | Tip dokumenta izabran od strane korisnika |
| `fileContent` | String | Base64 enkodovan sadržaj fajla |
| `uploadedAt` | String | ISO 8601 timestamp upload-a |
| `uploaded` | Boolean | Da li je dokument uploadovan u LocalStore |

### Primer podataka

```json
[
  {
    "id": "doc_1704123456789_abc123",
    "fileName": "faktura_2024.pdf",
    "fileSize": 245760,
    "fileExtension": "pdf",
    "documentType": "invoice",
    "fileContent": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL...",
    "uploadedAt": "2024-01-01T12:30:00.000Z",
    "uploaded": true
  }
]
```

## Events

### change.js
Izvršava se kada se bound data promeni (eksterno ili interno).

**Trigger:**
- Eksterni update podataka
- Upload dokumenata (interno)
- Brisanje dokumenata (interno)

**Koristi se za:**
- Sinhronizaciju sa eksternim promenama
- Re-rendering tabele dokumenata

## Validacija

Widget automatski validira:

### Veličina fajla
```javascript
// Ako je fajl veći od maxFileSize
"Fajl example.pdf je prevelik (max 10MB)"
```

### Ekstenzija fajla
```javascript
// Ako ekstenzija nije u allowedExtensions
"Tip fajla exe nije dozvoljen"
```

### Broj fajlova
```javascript
// Ako je dostignut maxFiles limit
"Maksimalan broj fajlova je 5"
```

## Styling

Widget koristi IBM Carbon Design System sa sledećim bojama:

- **Primary**: `#0f62fe` (IBM Blue)
- **Success**: `#24a148` (Green)
- **Error**: `#da1e28` (Red)
- **Background**: `#ffffff` (White)
- **Border**: `#e0e0e0` (Gray 20)
- **Text**: `#161616` (Gray 100)

### Prilagođavanje stilova

Možete override-ovati stilove u vašem Coach View CSS-u:

```css
/* Promena boje upload dugmeta */
.btn-upload {
  background: linear-gradient(135deg, #your-color 0%, #your-color-dark 100%);
}

/* Promena boje tabele */
.documents-table thead {
  background: #your-background-color;
}
```

## Browser podrška

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Accessibility

Widget je dizajniran sa accessibility best practices:

- ✅ ARIA labels i roles
- ✅ Keyboard navigation
- ✅ Screen reader podrška
- ✅ Focus indicators
- ✅ Semantic HTML

## Performance

### Optimizacije
- Lazy rendering za velike liste
- Debounced search
- Efficient DOM updates
- Base64 conversion u Web Worker-u (opciono)

### Preporuke
- Ograničite `maxFiles` za bolje performanse
- Koristite `allowedExtensions` da filtrirate nepotrebne fajlove
- Postavite razuman `maxFileSize` limit

## Troubleshooting

### Problem: Fajlovi se ne uploaduju

**Rešenje:**
1. Proverite da li je widget bind-ovan na `List<DocumentItem>` varijablu
2. Proverite browser console za greške
3. Proverite da li su fajlovi validni (veličina, ekstenzija)

### Problem: Tabela se ne ažurira

**Rešenje:**
1. Proverite da li je `change.js` event handler prisutan
2. Proverite da li je data binding pravilno konfigurisan
3. Osvežite Coach View

### Problem: Drag & Drop ne radi

**Rešenje:**
1. Proverite browser podršku za Drag & Drop API
2. Proverite da li postoje CSS konflikti
3. Testirajte u drugom browser-u

## Changelog

### Version 1.0.0 (2026-05-06)
- ✨ Inicijalna verzija
- 📁 Multi-file upload sa drag & drop
- 📊 Tabela dokumenata sa selekcijom tipa
- 🗑️ Brisanje dokumenata
- 💾 Upload u LocalStore
- 🎨 IBM Carbon Design System styling
- ♿ Accessibility podrška

## Licenca

Licensed Materials - Property of IBM
5725-C95
(C) Copyright IBM Corporation 2026. All Rights Reserved.

## Autor

Made with Bob - BAW Widget Development Assistant

## Podrška

Za pitanja i podršku:
- Proverite dokumentaciju u `datamodel.md` i `eventHandler.md`
- Pregledajte primere u ovom README-u
- Kontaktirajte BAW development tim

---

**Napomena**: Ovaj widget je dizajniran za IBM Business Automation Workflow i zahteva BAW runtime okruženje za puno funkcionisanje.