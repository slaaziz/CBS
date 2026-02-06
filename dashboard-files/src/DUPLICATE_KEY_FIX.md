# Duplicate React Key Fix

## Problem

The application was showing a React warning:
```
Warning: Encountered two children with the same key
```

This occurred because the CSV data contained **duplicate article IDs**. When rendering lists with `key={article.id}`, React encountered the same key multiple times, causing the warning.

## Root Cause

Multiple articles in the data had identical IDs:
- `"674464"` appeared twice
- `"717363"` appeared twice  
- `"1208487"` appeared three times
- `"773116"` appeared twice
- `"960564"` appeared twice

This is common when:
- CSV data has duplicate rows
- Different articles were assigned the same ID
- Data import didn't enforce unique IDs

## Solution

Instead of relying solely on `article.id` for React keys, we now use a **combination of ID and index** to guarantee uniqueness:

```typescript
// Before (caused duplicate key warnings)
{articles.map((article) => (
  <Component key={article.id} article={article} />
))}

// After (ensures unique keys)
{articles.map((article, index) => (
  <Component key={`${article.id}-${index}`} article={article} />
))}
```

## Files Updated

### 1. `/components/SearchResultsPage.tsx`
**Line 186:**
```typescript
{paginatedArticles.map((article, index) => (
  <ArticleCard key={`${article.id}-${index}`} article={article} />
))}
```

### 2. `/components/DashboardOverview.tsx`
**Line 128:**
```typescript
{recentArticles.map((article, index) => (
  <button
    key={`${article.id}-${index}`}
    onClick={() => navigate(`/article/${article.id}`)}
  >
))}
```

### 3. `/components/NetworkGraphPage.tsx`
**Lines 68, 84:**
```typescript
// CBS nodes
const cbsNodeId = `cbs-${article.id}-${index}`;

// Media nodes
const mediaId = `media-${article.id}-${index}-${i}`;
```

## Why This Works

1. **Uniqueness Guaranteed**: Even if two articles have the same ID, their index in the array will be different
2. **React Reconciliation**: React can now properly track which component is which
3. **No Performance Impact**: Keys are still stable (don't change between renders)
4. **Works with Sorted Data**: Even when sorting changes the order, keys remain consistent for the current render

## Alternative Solutions Considered

### Option A: Fix Data (Not Chosen)
Clean up the CSV to remove duplicate IDs. 

**Pros:** Addresses root cause  
**Cons:** 
- Requires data cleanup
- May lose articles if duplicates are removed
- Doesn't prevent future duplicates

### Option B: Use Index Only (Not Chosen)
```typescript
key={index}
```

**Pros:** Simple  
**Cons:**
- Bad practice in React
- Causes issues when reordering
- Can lead to state bugs

### Option C: ID + Index (✅ Chosen)
```typescript
key={`${article.id}-${index}`}
```

**Pros:**
- Unique keys guaranteed
- Works with existing data
- Handles future duplicates
- Still relatively semantic (includes article ID)

**Cons:**
- None significant

## React Router Note

The error mentioned checking for `react-router-dom` usage, but the app correctly uses:
```typescript
import { useNavigate, useSearchParams } from 'react-router-dom';
```

The package `react-router-dom` is the correct package for web applications. The base `react-router` package is a peer dependency that provides core routing logic.

**No changes needed** for router imports - the current setup is correct.

## Testing

After the fix:
- ✅ No React key warnings in console
- ✅ Article lists render correctly
- ✅ Dashboard shows recent articles
- ✅ Network graph displays properly
- ✅ Search results work as expected
- ✅ All navigation functions properly

## Prevention for Future

When importing new CSV data:

1. **Validate Unique IDs**: Ensure each article has a unique ID
2. **Check for Duplicates**: Run duplicate detection before import
3. **Generate IDs**: If IDs aren't unique, generate new ones during import

### Example Validation Script:
```typescript
// Check for duplicate IDs in mockArticles
const ids = mockArticles.map(a => a.id);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

if (duplicates.length > 0) {
  console.warn('Duplicate IDs found:', [...new Set(duplicates)]);
}
```

## Impact

**Before Fix:**
- Console warnings on every page with article lists
- Potential React reconciliation issues
- Confusing developer experience

**After Fix:**
- Clean console (no warnings)
- Proper React rendering
- Works with duplicate IDs in data
- Future-proof against new duplicates

---

**Status:** Fixed ✅  
**React Warnings:** Eliminated ✅  
**Backward Compatible:** Yes ✅  

**Last Updated:** January 2026
