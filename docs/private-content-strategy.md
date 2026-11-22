# Confidential Memory Content Injection & Privacy Strategy
### The Department of Extraordinary Things // Case No. 012

---

## 1. Threat Model & Privacy Disclosure

This repository is **publicly accessible**. Anyone with internet access can inspect git history, branches, committed files, public assets, and build outputs.

> [!CAUTION]
> **Vite & Client-Side Bundles Are Inherently Public**:
> - Any environment variable prefixed with `VITE_` is baked directly into client JavaScript bundles in plain text at build time.
> - Hidden client-side routes (e.g. `/secret-room`) are trivially discoverable by inspecting route tables or searching the JavaScript bundle.
> - Client-side "passwords" or conditional checks embedded in source code provide zero cryptographic protection.
> - Any file placed in `public/` or `dist/` is unencrypted and publicly downloadable by anyone visiting the URL.

**Under no circumstances should real personal photographs, private family letters, intimate memories, real birthdays, or personal messages be committed to this public git repository.**

---

## 2. Recommended Deployment Architectures for Private Memories

When real photographs, milestones, and personal letters are ready to be integrated, choose one of the following secure architectures:

### Strategy A: Client-Side Cryptographic Envelope (Zero-Knowledge Private Deployment)
**Best for:** Static hosting (GitHub Pages, Cloudflare Pages, Vercel, Netlify) without a dedicated backend server.

#### Cryptographic Specification & Parameter Calibration:
1. **Key Derivation Function (KDF):**
   - **Algorithm:** PBKDF2 with HMAC-SHA-256.
   - **Iteration Count:** Calibrated to **600,000 iterations** (conforming to current OWASP Password Storage guidelines for PBKDF2-HMAC-SHA-256).
   - **Salt:** Exactly 16 bytes (128 bits) of cryptographically secure pseudo-random data generated per encryption operation via `window.crypto.getRandomValues(new Uint8Array(16))`. The salt must **never be static or hardcoded**.
   - *Note on Alternative KDFs:* Where WebAssembly is permitted, memory-hard Argon2id (`m=64 MiB`, `t=3`, `p=4`) provides even stronger ASIC/GPU resistance than PBKDF2. For native, dependency-free Web Crypto API (`window.crypto.subtle`), PBKDF2-HMAC-SHA-256 at 600,000 iterations is the standardized choice.
2. **Authenticated Symmetric Cipher & Web Crypto Tag Consistency:**
   - **Algorithm:** AES-GCM (Galois/Counter Mode) with 256-bit derived key.
   - **Initialization Vector (Nonce / IV):** Exactly 12 bytes (96 bits) generated per encryption operation via `window.crypto.getRandomValues(new Uint8Array(12))`. **A nonce must NEVER be reused with the same key under any circumstances**, as nonce reuse under AES-GCM destroys ciphertext authenticity and can reveal plaintext xor relationships.
   - **Authentication Tag & Internal Representation:** 128-bit integrity tag. Under the standardized Web Crypto API (`window.crypto.subtle`), `encrypt()` outputs an `ArrayBuffer` containing the raw ciphertext with the 128-bit authentication tag automatically appended to the end. The versioned envelope stores this composite buffer directly as a single base64 string in `ciphertext`. When decrypting, `decrypt()` expects this exact composite buffer directly. **Do not manually extract, re-append, or duplicate the authentication tag.**
3. **Versioned Authenticated Envelope Schema:**
   The encrypted archive is serialized as a versioned JSON metadata envelope (`dossier.enc.json`):
   ```json
   {
     "schemaVersion": 1,
     "format": "celltax-curatorial-envelope",
     "kdf": {
       "algorithm": "PBKDF2",
       "hash": "SHA-256",
       "iterations": 600000,
       "salt": "<base64-encoded-16-byte-salt>"
     },
     "cipher": {
       "algorithm": "AES-GCM",
       "keyLengthBits": 256,
       "iv": "<base64-encoded-12-byte-nonce>",
       "tagLengthBits": 128
     },
     "ciphertext": "<base64-encoded-ciphertext-with-128bit-auth-tag>"
   }
   ```
   *Versioning benefit:* The `schemaVersion` header ensures future migrations (e.g. upgrading KDF parameters or switching to post-quantum algorithms) can be safely identified and parsed without breaking historical archives.
4. **Additional Authenticated Data (AAD) Specification:**
   - **Integrity Requirement for Decryption Metadata:** Metadata affecting key derivation and decryption interpretation must be authenticated using AES-GCM Additional Authenticated Data (`additionalData`). Without authentication, cleartext envelope metadata can be tampered with in transit or on public storage (for instance, an attacker could maliciously lower `iterations` to degrade KDF work factor, alter algorithm identifiers, or swap IVs/salts to induce cryptographic downgrade or parameter confusion attacks).
   - **Authentication vs. Encryption:** **AAD authenticates metadata but does NOT encrypt or hide it.** The metadata fields remain openly readable in plaintext in the JSON envelope so that the client runtime can read parameters required to initialize the KDF and cipher. Passing these metadata bytes as AAD cryptographically binds them into the Galois MAC tag calculation during encryption.
   - **Deterministic Canonical Serialization:** Both the encryption tool and client-side decryption implementation must construct **byte-for-byte identical AAD byte sequences**. Because standard JSON serialization can vary across runtimes due to arbitrary property ordering, optional whitespace, or number representations, the AAD payload must be constructed using a strict, deterministic canonical serialization before passing to Web Crypto.

     *Canonical Delimited String Representation (Recommended):*
     ```
     celltax-aad:v1|schemaVersion=1|format=celltax-curatorial-envelope|kdfAlgorithm=PBKDF2|kdfHash=SHA-256|kdfIterations=600000|salt=<salt-base64>|cipherAlgorithm=AES-GCM|keyLengthBits=256|iv=<iv-base64>|tagLengthBits=128
     ```
     *Or Canonical Key-Sorted JSON (Strictly without whitespace, keys sorted lexicographically by ASCII codepoint):*
     ```json
     {"cipherAlgorithm":"AES-GCM","format":"celltax-curatorial-envelope","iv":"<iv-base64>","kdfAlgorithm":"PBKDF2","kdfHash":"SHA-256","kdfIterations":600000,"keyLengthBits":256,"salt":"<salt-base64>","schemaVersion":1,"tagLengthBits":128}
     ```
     *Mandatory Fields in the Canonical AAD Payload (at minimum):*
     - `schemaVersion` (integer): Envelope schema version (`1`)
     - `format` (string): Envelope format identifier (`"celltax-curatorial-envelope"`)
     - `kdfAlgorithm` (string): KDF algorithm (`"PBKDF2"`)
     - `kdfHash` (string): KDF digest hash (`"SHA-256"`)
     - `kdfIterations` (integer): Calibrated iteration count (`600000`)
     - `salt` (string): Base64-encoded 16-byte random salt
     - `cipherAlgorithm` (string): Symmetric cipher algorithm (`"AES-GCM"`)
     - `keyLengthBits` (integer): Derived key length in bits (`256`)
     - `iv` (string): Base64-encoded 12-byte initialization vector
     - `tagLengthBits` (integer): Authentication tag length in bits (`128`)

     The canonical string is converted to binary using UTF-8:
     ```ts
     const aadBytes = new TextEncoder().encode(canonicalAadString);
     ```

   - **Web Crypto Parameter Passing (`additionalData`):**
     During **encryption**, pass `aadBytes` into `additionalData`:
     ```ts
     const ciphertextWithTagBuffer = await window.crypto.subtle.encrypt(
       {
         name: 'AES-GCM',
         iv: ivBytes,             // 12-byte Uint8Array
         additionalData: aadBytes,// Exactly constructed canonical AAD bytes
         tagLength: 128           // Tag length in bits
       },
       derivedKey,
       plaintextBytes
     );
     // Web Crypto automatically appends the 128-bit authentication tag to the ciphertext buffer.
     // Store directly as base64 in envelope.ciphertext.
     ```
     During **decryption**, reconstruct the exact same canonical `aadBytes` from the envelope metadata and pass them to `decrypt()`:
     ```ts
     const decryptedBuffer = await window.crypto.subtle.decrypt(
       {
         name: 'AES-GCM',
         iv: ivBytes,             // 12-byte Uint8Array decoded from envelope.cipher.iv
         additionalData: aadBytes,// Exactly identical canonical AAD bytes reconstructed from envelope
         tagLength: 128
       },
       derivedKey,
       ciphertextWithTagBuffer  // ArrayBuffer from base64 envelope.ciphertext (contains appended tag)
     );
     ```

   - **Authentication Failure Guarantee:** If any authenticated metadata value (e.g. `schemaVersion`, `format`, `kdfIterations`, `salt`, or `iv`) is modified or corrupted by even a single bit, the GMAC authentication check in `window.crypto.subtle.decrypt()` will fail, causing the promise to immediately reject with an `OperationError`. Decryption will abort, and no plaintext will be released.

> [!NOTE]
> **Specification vs. Implementation Notice**:
> This section is an architectural and cryptographic specification for future private deployments when real personal memories are introduced. There is no active client-side encryption implementation in the current public repository.

#### Offline Password-Guessing Risks:
> [!WARNING]
> **Adversarial Threat Model for Publicly Hosted Encrypted Payloads**:
> If the versioned encrypted file (`dossier.enc.json`) is hosted on a publicly accessible web server or CDN, an adversary can download the file and execute high-speed **offline dictionary and brute-force attacks** using dedicated GPU/ASIC clusters (e.g. hashcat).
> Because PBKDF2 is compute-bound rather than memory-hard, specialized hardware can evaluate millions of password guesses per second against weak human passphrases.
> - **Entropy Requirement:** Any passphrase used to encrypt public payloads MUST have high entropy (at least 60–80 bits of entropy, such as a 5-to-6 word random Diceware passphrase or a 20+ character random alphanumeric string).
> - Short, dictionary-based, or easily guessed passphrases (e.g. names, single dates, common words) will fail against offline dictionary attacks.

#### Runtime Decryption Flow:
1. The recipient enters the high-entropy passphrase into the Access Terminal.
2. The browser invokes `window.crypto.subtle.deriveKey()` using PBKDF2-HMAC-SHA-256 with 600,000 iterations and the unique envelope salt.
3. The browser reconstructs the canonical AAD bytes from the envelope metadata (`schemaVersion`, `format`, KDF parameters, cipher parameters, salt, IV, tag length).
4. The browser invokes `window.crypto.subtle.decrypt()` passing `iv`, `additionalData: aadBytes`, `tagLength: 128`, and the base64-decoded `ciphertext` (which includes the appended 128-bit authentication tag).
5. If the passphrase is incorrect OR if any authenticated metadata or ciphertext was tampered with, Web Crypto API rejects with an `OperationError` (aborting decryption).
6. Upon successful verification, decrypted memory objects and images exist **only in ephemeral JavaScript memory** (Blob / Object URLs) and are automatically destroyed upon tab dismissal.

---

### Strategy B: Private Repository Fork with Access Control
**Best for:** Fast development with unencrypted assets hosted on private infrastructure.

1. **Private Fork:**
   - Fork or push this codebase to a private GitHub/GitLab repository.
   - Populate `src/data/memories.ts` and `public/images/` with real high-resolution photographs, personal letters, and private dates.
2. **Deployment Behind Authenticated Access Gate:**
   - Deploy to Cloudflare Pages integrated with Cloudflare Zero Trust (access granted only via email OTP or single-user PIN).
   - Alternatively, deploy to Vercel with Deployment Protection enabled.
   - Ensure the server serves `X-Robots-Tag: noindex, nofollow` headers to prevent search engine crawler discovery.

---

### Strategy C: CI/CD Build-Time Secret Injection
**Best for:** Maintaining open-source application code while deploying private content to a restricted environment.

> [!CAUTION]
> **Build-Time Decryption is NOT Private on Public Hosting**:
> Decrypting private assets during a CI/CD build process into `dist/` does **not** protect privacy if the resulting `dist/` directory is deployed to a publicly accessible web host, CDN, GitHub Pages site, or public S3 bucket.
> In that scenario, all decrypted assets are served in plain text to anyone on the web; the build-time step only hid the files from the git repository, not from the internet.
> **Build-time injection is ONLY private when the deployment host itself enforces authenticated access control** (e.g. behind HTTP Basic Authentication, Cloudflare Access, or a private corporate VPN).

---

## 3. How to Populate Real Content (Developer Guide)

When ready to populate real content in a private environment, use the exact schemas defined in [`src/types/memory.ts`](../src/types/memory.ts):

### Reusable Content Types & Enums
```ts
export type MemoryCategory = 'milestone' | 'voyage' | 'curiosity' | 'relic' | 'personal' | 'celebration';

export type MemoryVisibility = 'sealed' | 'revealed' | 'archived';

export interface MemoryItem {
  /** Unique identifier for the memory (e.g. 'MEM-1978-01', 'ITEM-012-A') */
  id: string;
  /** Memory title */
  title: string;
  /** Short summary / brief description */
  shortDescription: string;
  /** Full narrative exploration or memory recollection */
  fullNarrative: string;
  /** Exact or normalized date (ISO string or YYYY-MM-DD) */
  date: string;
  /** Human-readable display date (e.g. "Summer 1978", "October 14, 1988") */
  displayDate?: string;
  /** True if the exact date is unknown or represents an approximate era */
  isApproximateDate?: boolean;
  /** Optional approximate period descriptor (e.g. "Late 1970s", "Early Autumn") */
  approximatePeriod?: string;
  /** Geographic or contextual location */
  location?: string;
  /** Primary image asset URL */
  image: string;
  /** Optional alternate image asset URL (e.g. reverse side or high-res scan) */
  alternateImage?: string;
  /** WebP optimized image URL */
  webpImage?: string;
  /** Small thumbnail preview URL */
  thumbnail?: string;
  /** Curatorial category classification */
  category: MemoryCategory;
  /** Numeric position or year index for chronological timeline sorting */
  timelinePosition: number;
  /** Optional photo or exhibit caption */
  caption?: string;
  /** Optional private or personal reflection note */
  personalNote?: string;
  /** Explicit display order within the same timeline position or era */
  displayOrder: number;
  /** Visibility state governing locked/unlocked rendering */
  visibility: MemoryVisibility;
  /** Optional tags for filtering */
  tags?: string[];
  /** Optional cross-reference to an evidence catalog ID (e.g. 'ITEM-012-A') */
  evidenceIdRef?: string;
}

export interface GalleryPhotoItem {
  id: string;
  title: string;
  caption?: string;
  date?: string;
  imageUrl: string;
  webpUrl?: string;
  thumbnailUrl?: string;
  collectionId: string;
  curatorialNote?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
}

export interface GalleryCollection {
  id: string;
  title: string;
  description: string;
  curatorialEra?: string;
  photos: GalleryPhotoItem[];
}
```

### Chronological Mapping Rules:
1. **Multi-Memory Support:** The timeline accommodates multiple memories sharing the exact same `date` value. They are sorted predictably using `timelinePosition` followed by `displayOrder`.
2. **Approximate Eras:** For milestones where an exact day is not recorded, set `isApproximateDate: true` and provide a descriptive string in `approximatePeriod` (e.g., `"Late 1970s"`). The UI renders an archival `APPROXIMATE ERA` badge automatically.
3. **Curatorial Photograph Series:** Group photos into `GalleryCollection` records. The Master Gallery automatically provisions responsive category tabs and optical zoom inspection for each series.
