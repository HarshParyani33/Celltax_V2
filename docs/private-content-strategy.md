# Confidential Memory Content Injection & Privacy Strategy
### The Department of Extraordinary Things // Case No. 012

---

## 1. Threat Model & Privacy Disclosure

This repository is **publicly accessible**. Anyone with internet access can inspect git history, branches, committed files, public assets, and build outputs.

> [!CAUTION]
> **Vite & Client-Side Code Are Public**:
> - Any environment variable prefixed with `VITE_` is baked directly into client JavaScript bundles in plain text.
> - Hidden routes (e.g. `/secret-room`) are trivially discoverable by inspecting route tables or searching the bundle.
> - Client-side "passwords" or conditional checks embedded in source code provide zero cryptographic protection.
> - Files stored in `public/` or `dist/` can be downloaded directly.

**Under no circumstances should real personal photographs, private family letters, intimate memories, real birthdays, or personal messages be committed to this public git repository.**

---

## 2. Recommended Deployment Architectures for Private Memories

When real photographs, milestones, and personal letters are ready to be integrated, choose one of the following secure architectures:

### Strategy A: Client-Side Cryptographic Envelope (Zero-Knowledge Private Deployment)
**Best for:** Free static hosting (GitHub Pages, Vercel, Netlify) without a backend.

1. **Encrypted Payload Creation:**
   - Package the real `MemoryItem[]` array and private photos into an encrypted binary blob using AES-GCM-256 with PBKDF2 key derivation (SHA-256, 100,000+ iterations).
   - The encrypted payload is hosted as an inert static asset (`/assets/dossier.enc`).
2. **Runtime Decryption:**
   - The recipient enters a private passphrase in the Access Terminal (e.g. delivered in a physical sealed envelope).
   - The browser derives the cryptographic key in-memory via `window.crypto.subtle` and decrypts the payload.
   - Without the passphrase, the payload cannot be decrypted even by someone downloading the raw `.enc` file.
   - Decrypted memories and images exist only in temporary browser memory (Object URLs / Blob URLs) and are cleared on tab close.

### Strategy B: Private Repository Fork with Access Gate
**Best for:** Seamless development with unencrypted assets on private hosting.

1. **Private Fork:**
   - Fork or push this codebase to a private GitHub/GitLab repository.
   - Populate `src/data/memories.ts` and `public/images/` with actual high-resolution family photos and personal memories.
2. **Deployment Behind Access Control:**
   - Deploy to Cloudflare Pages with Cloudflare Zero Trust Access (PIN to email or single-user allowlist).
   - Or deploy to Vercel with Deployment Protection enabled.
   - Add `X-Robots-Tag: noindex, nofollow` headers to prevent search engine indexing.

### Strategy C: CI/CD Build-Time Injection
**Best for:** Maintaining open-source codebase while publishing a private build.

1. **Encrypted Asset in Repo:**
   - Store an encrypted tarball (`memories.tar.enc`) in the repo.
2. **Build-Time Secret:**
   - In GitHub Actions or Vercel build settings, store the decryption key in an encrypted environment secret.
   - At build time: decrypt the tarball, extract assets into `src/data/memories.ts` and `public/images/`, run `npm run build`, and deploy the build artifact directly to a private hosting target.

---

## 3. How to Populate Real Content (Developer Guide)

When ready to populate real content in a private environment:

1. **Types (`src/types/memory.ts`):**
   Use the established schema:
   ```ts
   export interface MemoryItem {
     id: string;
     title: string;
     shortDescription: string;
     fullNarrative: string;
     date: string;
     displayDate?: string;
     isApproximateDate?: boolean;
     location?: string;
     image: string;
     thumbnail?: string;
     category: 'milestone' | 'voyage' | 'curiosity' | 'relic' | 'personal';
     timelinePosition: number;
     caption?: string;
     personalNote?: string;
     displayOrder: number;
     visibility: 'sealed' | 'revealed';
   }
   ```
2. **Chronological Grouping:**
   - Group memories into eras using `timelinePosition` (e.g., 1985, 1995, 2010).
   - If multiple photos/memories occurred on the same date, set matching `date` strings; the timeline will preserve both and order them via `displayOrder`.
   - If an exact date is unknown, set `isApproximateDate: true` and specify `approximatePeriod` (e.g., `"Early Childhood"`).
3. **Gallery Photo Collections:**
   - Group photos into `GalleryCollection` objects in `src/data/memories.ts`.
   - The Master Gallery dynamically creates tab selectors for each collection.
