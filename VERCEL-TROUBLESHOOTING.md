# Vercel Build Troubleshooting

## Quick Fix: Disable PWA Temporarily

If Vercel builds are failing, you can temporarily disable PWA to get builds working:

### Option 1: Environment Variable (Recommended)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add a new variable:
   - **Name**: `DISABLE_PWA`
   - **Value**: `1`
   - **Environment**: Production, Preview, Development
3. Redeploy

This will disable PWA generation while keeping all other features working.

### Option 2: Swap Config Files

Rename the config files temporarily:
```bash
mv next.config.js next.config.full.js
mv next.config.simple.js next.config.js
git add next.config.js
git commit -m "fix: Simplify PWA config for Vercel"
git push
```

The simple config has minimal PWA setup that's more likely to work.

## Common Vercel Build Issues

### 1. PWA Package Compatibility

**Symptom**: Build fails during PWA generation step

**Solution**:
- Set `DISABLE_PWA=1` environment variable
- Or use simplified config (next.config.simple.js)

### 2. Build Timeout

**Symptom**: "Build exceeded maximum time limit"

**Solution**: PWA generation can be slow. Options:
- Upgrade Vercel plan for longer build times
- Temporarily disable PWA
- Reduce `runtimeCaching` complexity

### 3. Memory Issues

**Symptom**: "JavaScript heap out of memory"

**Solution**: Add to vercel.json:
```json
{
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  }
}
```

### 4. Module Not Found

**Symptom**: "Cannot find module '@ducanh2912/next-pwa'"

**Solution**: Check that package is installed:
```bash
npm install
npm run build
```

If still failing, move PWA to dependencies:
```json
{
  "dependencies": {
    "@ducanh2912/next-pwa": "^10.2.9"
  }
}
```

## Vercel Configuration

The `vercel.json` file includes:
- Increased function memory (1024MB)
- Proper Next.js framework detection
- Telemetry disabled for faster builds

## Testing Locally

Before deploying, test the production build locally:

```bash
# With PWA enabled
npm run build
npm start

# With PWA disabled
DISABLE_PWA=1 npm run build
npm start
```

## Debugging Steps

1. **Check Vercel Build Logs**
   - Go to Deployments → Click failed deployment
   - Look for specific error in build logs
   - Common errors: module not found, timeout, memory

2. **Test Production Build Locally**
   ```bash
   NODE_ENV=production npm run build
   ```
   If this fails, the issue is not Vercel-specific.

3. **Check Environment Variables**
   - Ensure NEXT_PUBLIC_* variables are set
   - Check Supabase credentials are configured
   - Verify OpenAI API key is set

4. **Verify Dependencies**
   ```bash
   npm ci  # Clean install
   npm run build
   ```

## If All Else Fails

### Nuclear Option: Remove PWA Completely

1. Remove PWA package:
   ```bash
   npm uninstall @ducanh2912/next-pwa
   ```

2. Restore simple next.config.js:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: 'pgtjqgvmgvpqrdiuhtjd.supabase.co',
         },
       ],
     },
   }

   module.exports = nextConfig
   ```

3. Remove PWA files:
   ```bash
   rm public/manifest.json
   rm public/sw.js*
   rm public/workbox-*.js*
   ```

4. Update layout.tsx to remove manifest reference:
   ```typescript
   // Remove this line:
   manifest: '/manifest.json',
   ```

PWA can be added back later once core app is deployed.

## Getting Help

If issues persist:

1. **Check Vercel Status**: https://www.vercel-status.com/
2. **Vercel Discussions**: https://github.com/vercel/next.js/discussions
3. **Next PWA Issues**: https://github.com/DuCanhGH/next-pwa/issues

## Successful Build Indicators

When builds succeed, you'll see:
- ✓ Service worker generated
- ✓ 18 routes compiled
- ✓ Production build completed
- All green checkmarks in Vercel deployment

---

**Last Updated**: After PWA implementation
**Status**: Troubleshooting guide for Vercel deployment issues
