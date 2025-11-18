# Quick Start Guide - CropSync Kiosk

Get your CropSync Kiosk application up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/villageboy09/cropsync-kiosk.git
cd cropsync-kiosk

# Install dependencies
pnpm install
# or
npm install
```

### 2. Set Up Supabase (2 minutes)

**Create a Supabase Project:**
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details and wait for setup to complete

**Run Database Setup:**
1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase-setup.sql` from this project
3. Paste and click "Run"

**Get Your Credentials:**
1. Go to Project Settings → API
2. Copy your Project URL
3. Copy your `anon` `public` key

### 3. Configure Environment (30 seconds)

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run the App (30 seconds)

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## 🎯 First Steps

### Create Your First Account

1. Click on the "Sign Up" tab
2. Enter your details:
   - Full Name
   - Email
   - Password
3. Click "Create Account"

### Explore the Dashboard

After signing in, you'll see:
- **Stats Cards**: Overview of your crops
- **Empty State**: Since you're new, you'll see a prompt to add your first crop
- **Language Toggle**: Switch between English (EN) and Telugu (తె)
- **Theme Toggle**: Try dark mode with the moon/sun icon

### Add Your First Crop

Currently, the UI is ready but you'll need to implement the add crop functionality. The Redux slice is already set up at `src/store/slices/cropSlice.js` with the `addCrop` action.

## 📱 Key Features to Try

### Language Switching
Click the language toggle in the header to switch between English and Telugu. Notice how:
- All UI text changes
- Font automatically switches (Poppins → Noto Sans Telugu)

### Dark Mode
Click the theme toggle to switch between light and dark modes. The entire app adapts instantly.

### Responsive Design
Resize your browser or open on mobile to see the responsive layout in action.

## 🛠️ Development Tips

### Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Main pages (Login, Dashboard)
├── store/         # Redux state management
├── lib/           # Utilities and configurations
```

### Adding New Features

**Add a new page:**
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navigation if needed

**Add new Redux state:**
1. Create slice in `src/store/slices/`
2. Add to store in `src/store/store.js`
3. Use with `useSelector` and `useDispatch`

**Add new UI component:**
```bash
pnpm dlx shadcn@latest add [component-name]
```

### Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run linter

# Shadcn UI
pnpm dlx shadcn@latest add button    # Add button component
pnpm dlx shadcn@latest add dialog    # Add dialog component
```

## 🎨 Customization

### Change Theme Colors

Edit `src/index.css` and modify the CSS variables:

```css
:root {
  --primary: oklch(0.45 0.15 145);  /* Green color */
  --accent: oklch(0.7 0.2 40);      /* Orange accent */
}
```

### Add More Languages

1. Update `src/store/slices/uiSlice.js` to add new language
2. Add language toggle option in Header
3. Import and configure new font in `index.html`

### Customize Fonts

Edit `index.html` to change Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font:wght@400;700&display=swap" rel="stylesheet">
```

Then update `src/index.css`:

```css
@theme inline {
  --font-family-sans: 'Your Font', sans-serif;
}
```

## 📚 Next Steps

1. **Read the Full Documentation**: Check out `README.md` for detailed information
2. **Deploy Your App**: Follow `DEPLOYMENT.md` for deployment guides
3. **Customize**: Make it your own by adding features and styling
4. **Add Crop Management**: Implement the full CRUD operations for crops

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Change port in vite.config.js or use:
pnpm dev -- --port 3000
```

**Build errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Supabase not connecting?**
- Double-check your `.env` file
- Ensure variables start with `VITE_`
- Restart the dev server after changing `.env`

## 💡 Pro Tips

1. **Use Redux DevTools**: Install the browser extension to debug state
2. **Check Network Tab**: Monitor Supabase API calls in browser DevTools
3. **Hot Reload**: Save files to see instant updates (no refresh needed)
4. **Component Preview**: Use Storybook or similar to develop components in isolation

## 🎓 Learning Resources

- **Redux Toolkit**: [redux-toolkit.js.org](https://redux-toolkit.js.org)
- **Shadcn UI**: [ui.shadcn.com](https://ui.shadcn.com)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **React Router**: [reactrouter.com](https://reactrouter.com)

## 🤝 Need Help?

- Check the `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for deployment help
- Open an issue on GitHub
- Check Supabase documentation for backend questions

---

**You're all set!** Start building your farm management system. 🌱
