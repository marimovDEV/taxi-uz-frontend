# 🚀 Vercel Deployment Guide

## 📋 Muammo tahlili

Vercel ga deploy qilgandan so'ng "Tarmoq xatoligi. Server bilan bog'lanishda muammo" xatoligi kelib chiqadi.

## 🔧 Yechimlar

### 1. Environment Variables sozlash

Vercel Dashboard da quyidagi environment variable qo'shing:

```bash
NEXT_PUBLIC_API_URL=https://your-django-server.com/api
```

**Qayerda:**
- `your-django-server.com` - sizning Django server manzili
- HTTPS ishlatish kerak (Vercel HTTP ni qo'llab-quvvatlamaydi)

### 2. Django Server sozlamalari

Django server da quyidagi sozlamalarni tekshiring:

#### CORS sozlamalari (`settings.py`):
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-vercel-app.vercel.app",
    "https://your-vercel-app.vercel.app/",
    "http://localhost:3000",  # Development uchun
]

CORS_ALLOW_CREDENTIALS = True
```

#### ALLOWED_HOSTS:
```python
ALLOWED_HOSTS = [
    'your-django-server.com',
    'localhost',
    '127.0.0.1',
]
```

### 3. Server accessibility tekshirish

Django server ishlayotganini tekshiring:

```bash
# Server ishlayotganini tekshirish
curl https://your-django-server.com/api/health/

# Yoki browser da ochish
https://your-django-server.com/api/health/
```

### 4. Vercel Environment Variables qo'shish

1. Vercel Dashboard ga kiring
2. Project ni tanlang
3. Settings → Environment Variables
4. Quyidagi variable qo'shing:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-django-server.com/api` | Production, Preview, Development |

### 5. Debug uchun

Settings → Debug tab da API Debugger komponenti mavjud. U orqali:
- API server bilan bog'lanishni tekshirish
- Xatolik xabarlarini ko'rish
- Server holatini bilib olish

## 🚨 Keng tarqalgan muammolar

### 1. HTTP vs HTTPS
**Muammo:** Django server HTTP da ishlayapti
**Yechim:** HTTPS ga o'tkazish yoki proxy server ishlatish

### 2. CORS xatoligi
**Muammo:** Browser CORS xatoligi beradi
**Yechim:** Django CORS sozlamalarini to'g'rilash

### 3. Firewall
**Muammo:** Server port ochiq emas
**Yechim:** Firewall sozlamalarini tekshirish

### 4. DNS
**Muammo:** Domain to'g'ri ishlamayapti
**Yechim:** DNS sozlamalarini tekshirish

## 🔍 Tekshirish ro'yxati

- [ ] Django server ishlayapti
- [ ] Environment variable to'g'ri sozlangan
- [ ] CORS sozlamalari to'g'ri
- [ ] HTTPS ishlatilmoqda
- [ ] Firewall port ochiq
- [ ] DNS to'g'ri ishlayapti

## 📞 Yordam

Agar muammo davom etsa:
1. API Debugger dan foydalaning
2. Browser Console da xatoliklarni tekshiring
3. Django server loglarini tekshiring
4. Vercel deployment loglarini tekshiring 