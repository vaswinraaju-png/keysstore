# KeyStore India - CD Key Store + CMS

## Deploy: GitHub + Vercel

### 1. Create GitHub repo at https://github.com/new (empty, no README)

### 2. Push via CMD (run in project folder)

```bash
git init
git add .
git commit -m "Initial commit - KeyStore India"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cdkeystore.git
git push -u origin main
```

### 3. Deploy on Vercel
1. Go to https://vercel.com/new → Import your GitHub repo
2. Framework: Vite (auto-detected)
3. Add env variable: `VITE_ADMIN_PASSWORD` = your secure password
4. Click Deploy

### 4. Access
- Store: https://your-project.vercel.app/
- Admin CMS: https://your-project.vercel.app/admin

## Local Dev
```bash
npm install
npm run dev
```
