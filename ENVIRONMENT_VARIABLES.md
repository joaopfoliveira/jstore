# 🔐 Environment Variables Configuration

## Required Environment Variables

Para configurar as passwords do site, crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

### 🚪 Site Access Password
```bash
NEXT_PUBLIC_SITE_PASSWORD=your_site_password_here
```
**Default:** `jplus2024`  
**Description:** Password required to access the entire website

### 👨‍💼 Admin Panel Password
```bash
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password_here
```
**Default:** `jstore2024`  
**Description:** Password required to access the admin dashboard

### 🗄️ Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```
**Description:** Supabase database connection settings

### 📧 Email Service (Optional)
```bash
RESEND_API_KEY=your_resend_api_key_here
```
**Description:** For sending order confirmation emails via Supabase Edge Function

## 📄 Complete .env.local Template

Create a `.env.local` file in your project root:

```bash
# Site Access Password
NEXT_PUBLIC_SITE_PASSWORD=your_custom_site_password

# Admin Panel Password  
NEXT_PUBLIC_ADMIN_PASSWORD=your_custom_admin_password

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Email Service (for Supabase Edge Function)
RESEND_API_KEY=your_resend_api_key_here
```

## 🔒 Security Notes

- **Never commit `.env.local` to version control**
- **Use strong passwords** (minimum 12 characters)
- **Change default passwords** in production
- **Rotate passwords regularly**

## 🚀 Usage

### Site Password
- Users need this password to access any page of the website
- Shown on the login screen when visiting the site

### Admin Password  
- Required to access `/admin` dashboard
- Separate from site password for additional security

## 🔄 Fallback Behavior

If environment variables are not set, the system will use default passwords:
- **Site Password:** `jplus2024`
- **Admin Password:** `jstore2024`

**⚠️ Warning:** Always set custom passwords in production!

## 🛠️ How to Update

1. Create or edit `.env.local` file
2. Set your custom passwords
3. Restart the development server: `npm run dev`
4. Passwords are immediately active

## 📋 Verification

To verify your environment variables are loaded:
1. Check browser console (passwords won't be visible for security)
2. Test login with your custom passwords
3. Fallback passwords should no longer work

---

**🔐 Your passwords are now securely managed via environment variables!**
