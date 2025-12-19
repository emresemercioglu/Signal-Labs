# Vercel Migration Guide - Signal Labs Website

## ✅ Files Prepared (Already Complete)

All local files have been updated:
- ✅ `vercel.json` created with 301 redirects and SEO best practices
- ✅ Blog posts moved to `/blog/` directory
- ✅ `sitemap.xml` updated with new blog URLs
- ✅ All internal links updated to use absolute paths
- ✅ Canonical URLs and meta tags updated

## 📋 Migration Steps

### Phase 1: Create Vercel Project (10 minutes)

#### Step 1: Push Changes to GitHub
```bash
cd "/Users/emresemercioglu/Desktop/Signal Labs"
git status
git add .
git commit -m "Migrate to Vercel: add redirects, restructure blog URLs"
git push origin main
```

#### Step 2: Create New Vercel Project
1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Select your GitHub repository for the Signal Labs website
5. Configure project:
   - **Framework Preset**: Other (Static HTML)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: (leave empty - it's static HTML)
   - **Output Directory**: `./` (leave as default)
6. Click "Deploy"

#### Step 3: Wait for Initial Deployment
- Vercel will build and deploy your site
- You'll get a URL like `signal-labs-website.vercel.app`
- **DO NOT add custom domain yet**

---

### Phase 2: Test on Vercel Preview URL (15 minutes)

#### ✅ Testing Checklist

Open your preview URL (e.g., `signal-labs-website.vercel.app`) and test:

**1. Homepage**
- [ ] `https://your-project.vercel.app/` loads correctly
- [ ] All styles and images load
- [ ] Navigation links work

**2. Clean URLs (Test that .html redirects work)**
- [ ] Visit `https://your-project.vercel.app/contact.html`
  - Should redirect to `/contact`
- [ ] Visit `https://your-project.vercel.app/about.html`
  - Should redirect to `/about`
- [ ] Visit `https://your-project.vercel.app/services.html`
  - Should redirect to `/services`

**3. Blog Structure**
- [ ] Visit `https://your-project.vercel.app/blog`
  - Should show blog index page
- [ ] Visit `https://your-project.vercel.app/blog/the-ci-treadmill-is-broken-why-battlecards-age-in-days-not-quarters`
  - Should show blog post
  - Check that styles load correctly
  - Click "Back to Blog" link
- [ ] Visit old blog URL: `https://your-project.vercel.app/the-ci-treadmill-is-broken-why-battlecards-age-in-days-not-quarters`
  - Should redirect to `/blog/the-ci-treadmill...`

**4. Legacy Redirects**
- [ ] Visit `https://your-project.vercel.app/saas.html`
  - Should redirect to homepage `/`
- [ ] Visit `https://your-project.vercel.app/index.html`
  - Should redirect to `/`

**5. Trailing Slashes**
- [ ] Visit `https://your-project.vercel.app/contact/`
  - Should redirect to `/contact` (no trailing slash)

**6. Navigation**
- [ ] Click through all navigation links
- [ ] Click through footer links
- [ ] Test on mobile view

---

### Phase 3: Go Live with Custom Domain (10 minutes)

Once testing is complete and everything works:

#### Step 1: Add Custom Domain in Vercel
1. In your Vercel project, go to "Settings" → "Domains"
2. Click "Add Domain"
3. Enter: `usesignallabs.com`
4. Click "Add"

#### Step 2: Configure DNS
Vercel will show you DNS records to add. You'll need to add these in your domain registrar (where you bought usesignallabs.com):

**Option A: Using CNAME (Recommended)**
```
Type: CNAME
Name: @ (or usesignallabs.com)
Value: cname.vercel-dns.com
```

**Option B: Using A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

Also add for www redirect:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Step 3: Wait for DNS Propagation
- DNS changes take 5-30 minutes (sometimes up to 24 hours)
- Vercel will automatically provision SSL certificate
- You can check status in Vercel dashboard

#### Step 4: Verify Live Site
Once DNS propagates:
- [ ] Visit `https://usesignallabs.com` - should work
- [ ] Visit `https://www.usesignallabs.com` - should redirect to non-www
- [ ] Check that SSL (https) is working
- [ ] Test all the redirects from Phase 2 on the live domain

---

### Phase 4: Update Google Search Console (5 minutes)

#### Add New Property
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add a new property for `usesignallabs.com` (if not already there)
3. Verify ownership using the DNS TXT record method or HTML file method
4. Submit your sitemap: `https://usesignallabs.com/sitemap.xml`

#### Request Re-Indexing
1. Go to "URL Inspection" tool
2. Test these URLs:
   - `https://usesignallabs.com/contact`
   - `https://usesignallabs.com/blog/the-ci-treadmill-is-broken-why-battlecards-age-in-days-not-quarters`
   - `https://usesignallabs.com/blog/competing-in-real-time-a-ci-playbook-for-high-growth-teams`
3. Click "Request Indexing" for each

#### Validate Fixes
In Google Search Console:
1. Go to "Page Indexing" report
2. Check if the 3 issues are resolved:
   - ✅ "Alternate page with proper canonical tag" - Should show 0 issues
   - ✅ "Not found (404)" for saas.html - Should resolve (redirects to /)
   - ✅ "Duplicate without user-selected canonical" - Should resolve (proper redirects)

---

## 🎉 Benefits After Migration

### SEO Improvements
✅ **Proper 301 redirects** - Google will transfer ranking signals from old URLs to new ones
✅ **Clean URL structure** - `/blog/post-name` instead of `/post-name`
✅ **No duplicate content** - All .html URLs redirect properly
✅ **Better site hierarchy** - Clear content organization

### Performance
✅ **Edge CDN** - Faster page loads globally
✅ **Automatic optimization** - Image and asset optimization
✅ **Better caching** - Configured in vercel.json headers

### Developer Experience
✅ **Same platform as app** - Both on Vercel
✅ **Deploy previews** - Every git push gets a preview URL
✅ **Automatic deployments** - Push to git, auto-deploys
✅ **Analytics** - Built-in web analytics (enable in Vercel dashboard)

---

## 🔧 Troubleshooting

### Issue: Redirects not working
**Solution**: Check that `vercel.json` is in the root directory of your repo

### Issue: Styles not loading on blog pages
**Solution**: Verify all asset links use absolute paths (`/styles.css` not `styles.css`)

### Issue: DNS not propagating
**Solution**: 
- Check DNS settings in your domain registrar
- Use `nslookup usesignallabs.com` to verify
- Wait up to 24 hours for full propagation

### Issue: www not redirecting
**Solution**: Add www as a domain in Vercel settings, it will auto-redirect

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs in dashboard
2. Review the troubleshooting section
3. Verify all files were pushed to GitHub

---

## Next Steps After Migration

1. **Enable Vercel Analytics** (Settings → Analytics)
2. **Set up deployment notifications** (Settings → Git → Notifications)
3. **Configure environment variables** if needed later
4. **Monitor Google Search Console** for indexing improvements (takes 1-2 weeks)

---

**Ready to start? Begin with Phase 1: Push changes to GitHub!**

