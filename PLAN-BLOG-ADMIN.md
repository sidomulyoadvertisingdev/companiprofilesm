# Plan: Blog Posting + Admin UI Improvements

## Context

The admin panel (`AdminDashboard.jsx`) currently has 8 tabs (services, products, portfolio, partners, testimonials, marketplace codes, redeem rules, site config). There is **no blog functionality** at all — no database tables, no API routes, no admin UI, and no public-facing blog pages. The user wants:

1. A blog posting system in admin for publishing project updates
2. A rich text editor (Word-like WYSIWYG) for writing blog content
3. SEO fields (meta title, meta description, tags)
4. A more professional and friendly admin UI

---

## Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `src/pages/api/posts.js` | GET (list) + POST (create) blog posts |
| `src/pages/api/posts/[id].js` | GET/PUT/DELETE single post |

### Modified Files
| File | Purpose |
|------|---------|
| `src/lib/schema.js` | Add `posts` table |
| `src/lib/queries.js` | Add `getPosts()` / `getPost()` |
| `src/lib/api.js` | Add client-side `getPosts()` / `getPost()` |
| `src/lib/content.js` | Add SSR/browser content layer for posts |
| `src/react-pages/AdminDashboard.jsx` | Add "Blog" tab, BlogEditor component, redesign sidebar/topbar |
| `src/layouts/AdminLayout.astro` | Add font imports (Inter) for modern feel |
| `package.json` | Add `@tiptap/react` + extensions for rich text editor |

---

## Step 1: Install TipTap Rich Text Editor

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-character-count @tiptap/pm
```

TipTap is chosen because:
- Works great with React 19
- Modular (only bundle what you use)
- Headless (style with Tailwind)
- Word-like editing experience with toolbar

---

## Step 2: Database Schema — `posts` Table

Add to `src/lib/schema.js`:

```sql
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE,
  excerpt TEXT,
  content LONGTEXT,
  featured_image VARCHAR(500),
  tags_json TEXT DEFAULT '[]',
  meta_title VARCHAR(255),
  meta_description TEXT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  author VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
```

Fields:
- `title` — post title
- `slug` — URL slug (auto-generated from title)
- `excerpt` — short summary for previews/SEO
- `content` — HTML content from rich text editor
- `featured_image` — hero/banner image
- `tags_json` — JSON array of tags `["project", "printing"]`
- `meta_title` — SEO title override
- `meta_description` — SEO meta description
- `status` — `draft` or `published`
- `author` — author name

---

## Step 3: API Routes

### `src/pages/api/posts.js`
- **GET**: List all posts (with optional `?status=published` filter)
- **POST**: Create a new post (auto-generate slug from title if empty)

### `src/pages/api/posts/[id].js`
- **GET**: Get single post by ID
- **PUT**: Update a post
- **DELETE**: Delete a post

Follow the exact same pattern as `services.js` / `services/[id].js`.

---

## Step 4: Content Layer Updates

### `src/lib/queries.js` — Add:
```js
export async function getPosts() { ... }
export async function getPost(id) { ... }
export async function getPublishedPosts() { ... }
```

### `src/lib/api.js` — Add:
```js
export const getPosts = () => getJSON("/api/posts");
export const getPost = (id) => getJSON(`/api/posts/${id}`);
```

### `src/lib/content.js` — Add:
```js
export async function getPosts() { ... }
export async function getPost(id) { ... }
```

---

## Step 5: Admin UI — Blog Tab with Rich Text Editor

### BlogManager component
A list view of all posts with:
- Status badges (Draft / Published)
- Created/updated dates
- Edit / Delete / View actions
- "Tulis Artikel Baru" (New Post) button

### BlogEditor component (the rich text editor page)
When user clicks "Tulis Artikel Baru" or "Edit":

**Layout (split into sections):**

1. **Main Content Area (left/top)**
   - Title input (large, prominent)
   - TipTap rich text editor with toolbar:
     - Bold, Italic, Strikethrough, Code
     - Heading 1/2/3
     - Bullet list, Ordered list
     - Blockquote
     - Link insert
     - Image insert (via upload)
     - Undo/Redo
   - Word/character count display

2. **Sidebar (right/bottom on mobile)**
   - **Status**: Draft / Published toggle
   - **Featured Image**: Upload field
   - **Excerpt**: Textarea for short summary
   - **Tags**: Tag input (type + enter to add, click x to remove)
   - **SEO Section**:
     - Meta Title input (with character counter: max 60)
     - Meta Description textarea (with character counter: max 160)
     - SEO preview (Google SERP preview)

3. **Action buttons**: Simpan Draft / Publish

---

## Step 6: Admin UI Redesign (Professional & Friendly)

### Sidebar improvements:
- Add logo/brand section with a small icon
- Add section dividers (Konten / Marketplace / Pengaturan)
- Add subtle hover animations
- Active tab gets a left border accent + bg color
- Better typography with Inter font

### Topbar improvements:
- Breadcrumb-style title
- Clean notification bell
- User avatar with initials (already exists, refine styling)

### General:
- Add Inter font via Google Fonts in AdminLayout.astro
- Consistent border radius (rounded-2xl for cards)
- Subtle shadow refinements
- Status badges with proper color coding
- Better empty states with icons
- Loading states

---

## Implementation Order

1. **Install TipTap** — `npm install` the packages
2. **Database schema** — Add `posts` table to schema.js
3. **API routes** — Create `posts.js` and `posts/[id].js`
4. **Content layer** — Update queries.js, api.js, content.js
5. **Admin UI** — Update AdminDashboard.jsx:
   a. Add Blog tab to TABS array
   b. Build BlogManager component (list view)
   c. Build BlogEditor component (with TipTap)
   d. Improve sidebar/topbar styling
6. **Layout** — Add Inter font to AdminLayout.astro
7. **Test** — Run `npm run build` to verify

---

## Verification

1. `npm run build` — Ensure no build errors
2. `npm run dev` — Manual test:
   - Login to admin
   - Click "Blog" tab
   - Create a new post with rich text editor
   - Add tags, SEO fields
   - Save as draft, then publish
   - Edit an existing post
   - Delete a post
3. Check that the blog tab integrates smoothly with existing tabs
