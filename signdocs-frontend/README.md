# SignDocs Frontend

A React + Tailwind CSS frontend for a PDF document signing app, styled in
the spirit of iLovePDF's "Sign PDF" workflow. Built to wire directly into a
Spring Boot backend.

## Setup

```bash
npm install
npm run dev
```

The app runs on http://localhost:5173 by default.

## Backend connection

Set the backend base URL in `.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

The Spring Boot app must allow CORS from the frontend origin
(`http://localhost:5173`) and accept `Authorization: Bearer <token>` headers
on all protected endpoints.

## API contract

All requests go through `src/api/axiosClient.js`, which:
- Sets the base URL from `VITE_API_BASE_URL`
- Attaches `Authorization: Bearer <token>` from `localStorage` automatically
- Redirects to `/login` on a 401 response

Endpoint modules under `src/api/`:

| Module | Endpoints |
| --- | --- |
| `authApi.js` | `POST /api/auth/register`, `POST /api/auth/login` |
| `documentsApi.js` | `POST /api/documents/upload`, `GET /api/documents`, `GET /api/documents/{id}`, `GET /api/documents/download/{id}` |
| `signaturesApi.js` | `POST /api/signatures` (multipart: signatureName, type, image), `GET /api/signatures`, `GET /api/signatures/{id}` |
| `placementsApi.js` | `POST /api/placements`, `GET /api/placements/document/{documentId}` |
| `pdfApi.js` | `POST /api/pdf/sign/{documentId}`, `GET /api/pdf/download/{signedDocumentId}` |
| `signingRequestsApi.js` | `POST /api/signing-requests`, `GET /api/signing-requests`, `GET /api/signing-requests/token/{token}` (public), `POST /api/signing-requests/complete/{token}` (public) |
| `auditApi.js` | `GET /api/audit-logs` (optional) |

## Pages

| Route | Description |
| --- | --- |
| `/login`, `/register` | Auth pages, store `{ token, userId, name, email, role }` in `localStorage` |
| `/dashboard` | Stats + recent documents |
| `/documents` | Document list, download original PDF |
| `/documents/upload` | Drag-and-drop PDF upload |
| `/documents/:id` | Document detail, generate/download signed PDF, send for signing |
| `/documents/:id/place` | Drag-and-drop signature field placement on the PDF (renders pages with pdf.js) |
| `/signatures`, `/signatures/create` | Manage reusable signature/initials templates (drawn on canvas, uploaded as PNG) |
| `/signing-requests` | Send a document to a signer's email, view sent requests |
| `/sign/:token` | Public page for an external signer (no auth) |

## Coordinate system for placements

`src/utils/pdfUtils.js` renders PDF pages with pdf.js and returns the page
size in PDF points. `src/pages/PlacementEditor.jsx` converts on-screen click
positions to PDF point coordinates with a **bottom-left origin** (the
PDFBox/iText default):

```
yCoordinate = pageHeightPt - yFromTopPt - height
```

If your backend expects a top-left origin instead, remove the
`pageHeightPt -` part in `pointToPlacement` and `placementToBox`.

## Notes / things to confirm with your backend

- `POST /api/documents/upload` and `GET /api/documents` are expected to
  return objects with an `id` (or `documentId`) field and ideally
  `fileName`/`name`, `status`, `uploadedAt`, `pageCount`.
- `POST /api/pdf/sign/{documentId}` is expected to return an object
  containing the new signed document's id (`id`, `signedDocumentId`, or
  `signedId`) -- adjust `DocumentDetail.jsx` if your DTO differs.
- `POST /api/signing-requests/complete/{token}` currently sends
  `{ signatureImage: "<base64 PNG data URL>" }`. Adjust the payload shape in
  `PublicSign.jsx` to match your DTO.
