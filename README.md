# CropSync Kiosk - Farm Management System

A modern, production-ready farm management system built with React, Redux, Shadcn UI, and Supabase.

## ✨ Features

- **🔐 Authentication**: Secure user authentication with Supabase
- **📊 Redux State Management**: Centralized state with Redux Toolkit
- **🎨 Modern UI**: Beautiful components with Shadcn UI
- **⚡ Skeleton Loading**: Smooth loading states throughout the app
- **🌍 Bilingual Support**: English and Telugu language support
- **🎯 Large Icons**: Enhanced visual experience with prominent icons
- **📱 Responsive Design**: Works seamlessly on all devices
- **🌙 Dark Mode**: Built-in theme switching
- **🔄 Real-time Updates**: Live data synchronization with Supabase

## 🚀 Tech Stack

- **Frontend Framework**: React 19
- **State Management**: Redux Toolkit
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase
- **Icons**: Lucide React
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Fonts**: Poppins (English), Noto Sans Telugu (Telugu)

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/villageboy09/cropsync-kiosk.git
   cd cropsync-kiosk
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**

   Create a `crops` table in your Supabase project:
   ```sql
   create table crops (
     id uuid default uuid_generate_v4() primary key,
     user_id uuid references auth.users not null,
     name text not null,
     name_te text,
     category text,
     category_te text,
     description text,
     description_te text,
     season text,
     season_te text,
     status text default 'active',
     status_te text,
     location text,
     yield_estimate text,
     image_url text,
     harvest_date date,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Enable Row Level Security
   alter table crops enable row level security;

   -- Create policies
   create policy "Users can view their own crops"
     on crops for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own crops"
     on crops for insert
     with check (auth.uid() = user_id);

   create policy "Users can update their own crops"
     on crops for update
     using (auth.uid() = user_id);

   create policy "Users can delete their own crops"
     on crops for delete
     using (auth.uid() = user_id);
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
cropsync-kiosk/
├── src/
│   ├── components/
│   │   ├── auth/          # Authentication components
│   │   ├── common/        # Reusable components (Skeletons, EmptyState)
│   │   ├── crop/          # Crop-related components
│   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   └── ui/            # Shadcn UI components
│   ├── lib/
│   │   ├── supabase.js    # Supabase client configuration
│   │   ├── utils.js       # Utility functions
│   │   └── icons.js       # Icon configurations
│   ├── pages/
│   │   ├── Dashboard.jsx  # Main dashboard page
│   │   └── Login.jsx      # Authentication page
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.js   # Authentication state
│   │   │   ├── cropSlice.js   # Crop management state
│   │   │   └── uiSlice.js     # UI state (theme, language)
│   │   └── store.js       # Redux store configuration
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # App entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── components.json        # Shadcn UI configuration
├── jsconfig.json          # JavaScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Key Features Explained

### Redux State Management

The app uses Redux Toolkit for state management with three main slices:

- **authSlice**: Handles user authentication, session management
- **cropSlice**: Manages crop data, CRUD operations
- **uiSlice**: Controls theme, language, modals, notifications

### Skeleton Loading

All data-fetching components include skeleton loading states for better UX:
- `CropListSkeleton`: Grid of crop card skeletons
- `DashboardSkeleton`: Full dashboard loading state
- `TableSkeleton`: Table data loading state

### Bilingual Support

Toggle between English and Telugu:
- Poppins font for English text
- Noto Sans Telugu font for Telugu text
- Language toggle in header
- All UI text supports both languages

### Large Icons

Enhanced visual hierarchy with prominent icons:
- Dashboard stats: 32px (8 units)
- Empty states: 96px (24 units)
- Login page: 64px (16 units)
- Card headers: 32px (8 units)

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Build the project: `pnpm build`
2. Deploy the `dist` folder
3. Configure environment variables in Netlify dashboard

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for farmers using modern web technologies.
