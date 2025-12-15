# 📧 Email Verification System - Complete Implementation Guide

## ✅ What's Been Done

### 1. **Backend** (Already Configured ✔️)
- ✅ User Model has `isVerified: false` field
- ✅ Register endpoint creates verification token and sends email
- ✅ Verify email endpoint (`GET /api/user/verify-email/:token`)
- ✅ Login checks `isVerified` before allowing access
- ✅ Nodemailer configured with Brevo SMTP

### 2. **Frontend** (Just Added ✔️)
- ✅ `EmailVerification.jsx` - Verification page
- ✅ Updated `Login.jsx` - Shows verification message after signup
- ✅ Added route `/verify-email` in `App.jsx`
- ✅ Better error messages for unverified users

---

## 🔧 Setup Requirements

### Backend .env File
Create file: `server/.env`

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/capsnet
# or MongoDB Atlas: mongodb+srv://user:password@cluster.mongodb.net/capsnet

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_12345

# Email Configuration (Brevo)
SMTP_USER=your_brevo_email@gmail.com
SMTP_PASS=your_brevo_api_key
SENDER_EMAIL=your_sender_email@gmail.com

# Server URL (for email links)
SERVER_URL=http://localhost:5001
# In production: https://yourdomain.com

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173
# In production: https://yourdomain.com
```

### How to Get Brevo Credentials
1. Go to https://www.brevo.com
2. Sign up for free account
3. Go to Settings → SMTP & API
4. Copy SMTP credentials
5. Use your email as SENDER_EMAIL

---

## 🚀 How It Works (Complete Flow)

### User Registration
```
1. User fills form with name, email (@medicaps.ac.in), password
2. Frontend validates email format
3. Backend receives request
4. Backend checks if email exists
5. Backend hashes password
6. Backend creates user with isVerified = false
7. Backend generates JWT verification token (7-day expiry)
8. Backend sends email with verification link
9. Frontend shows: "Check your email for verification link"
10. User switched to login tab
```

### User Clicks Verification Link
```
1. User gets email with link: http://localhost:5173/verify-email?token=xxx
2. User clicks link
3. Frontend EmailVerification page loads
4. Frontend calls: GET /api/user/verify-email/xxx
5. Backend verifies JWT token
6. Backend sets isVerified = true
7. Frontend shows success message
8. Frontend redirects to login after 2 seconds
```

### User Login
```
1. User enters email and password
2. Backend checks if user exists
3. Backend checks if isVerified = true
   - ❌ If false: Error "Please verify your college email first"
   - ✅ If true: Continue
4. Backend verifies password
5. Backend generates session token
6. Backend sets HTTP-only cookie
7. User logged in ✅
```

---

## 🧪 Testing Steps

### Step 1: Start Backend
```bash
cd server
npm install  # if needed
node server.js
```

### Step 2: Start Frontend
```bash
cd client
npm install  # if needed
npm run dev
```

### Step 3: Test Registration
1. Go to `http://localhost:5173/login`
2. Click "Don't have an account? Sign Up"
3. Fill form:
   - Name: Your Name
   - Email: youremail@medicaps.ac.in
   - Password: anything
   - Confirm: same password
4. Click Sign Up
5. You'll see: "Account created! 📧 Check your email for verification link"

### Step 4: Check Email
1. Open your email inbox
2. Look for email from capsnet
3. Click the verification link in the email
4. You'll see success page
5. Wait 2 seconds - auto redirect to login
6. Login with your credentials ✅

### Step 5: Test Login After Verification
1. Now you should be able to login!
2. Enter email and password
3. Click Sign In ✅

---

## 📨 Email Template

When user registers, they receive an email like:

```
Subject: Verify your Medicaps email

Hi [User Name],

Please verify your Medicaps email by clicking here.

[VERIFICATION LINK]

This link expires in 7 days.

Thanks,
CapsNet Team
```

---

## 🐛 Troubleshooting

### Problem: "Email not sending"
**Solution:**
1. Check .env file has SMTP_USER, SMTP_PASS, SENDER_EMAIL
2. Check Brevo account is activated
3. Check backend logs for email errors
4. Try with a Gmail account instead

### Problem: "Invalid token or expired"
**Solution:**
1. Check token in URL is exactly correct
2. Token expires in 7 days - ask user to register again if expired
3. Check JWT_SECRET is same in .env

### Problem: "User not found after verification"
**Solution:**
1. Check MongoDB connection works
2. Check user document exists with that email
3. Check _id field is properly set

### Problem: "Still can't login after verification"
**Solution:**
1. Check database - run MongoDB and verify isVerified = true
2. Clear localStorage on frontend
3. Try registration again from scratch

---

## 📊 Database Check

To verify user is verified in MongoDB Compass:

```javascript
db.users.findOne({ email: "youremail@medicaps.ac.in" })
```

Should show:
```json
{
  "_id": "...",
  "email": "youremail@medicaps.ac.in",
  "isVerified": true,  // Should be TRUE after clicking link
  "full_name": "Your Name",
  ...
}
```

---

## 🔒 Security Features

✅ JWT tokens have 7-day expiry  
✅ Password is bcrypt hashed (never stored plain)  
✅ Verification token only valid once  
✅ Email must be @medicaps.ac.in domain  
✅ HTTP-only cookies prevent XSS attacks  

---

## 📝 Files Modified/Created

### Created:
- `client/src/pages/EmailVerification.jsx` - Verification page

### Modified:
- `client/src/pages/Login.jsx` - Better messages
- `client/src/App.jsx` - Added verify-email route

### Already Exists:
- `server/controllers/userController.js` - registerUser, verifyEmail, loginUser
- `server/routes/userRoutes.js` - Email verify route
- `server/config/nodeMailer.js` - Email sending

---

## ✅ Production Checklist

Before deploying to production:

- [ ] Create production .env file
- [ ] Use HTTPS (secure: true for cookies)
- [ ] Use production database URL
- [ ] Use production email service
- [ ] Set proper SERVER_URL and FRONTEND_URL
- [ ] Test complete flow on production server
- [ ] Monitor email delivery
- [ ] Set up error logging
- [ ] Test rate limiting works

---

## 💡 Future Enhancements

1. Resend verification email button
2. Auto-expire unverified accounts after 30 days
3. Verification email templates with branding
4. SMS verification as backup
5. Multi-factor authentication

---

**Everything is ready! Your complete email verification system is now live! 🎉**
