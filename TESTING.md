# Quick Testing Guide

## 🧪 How to Test the Fixes

### ✅ Test 1: Default Groups (For New Users)

**Option A - Create New Account:**
1. Go to http://localhost:5174
2. Click "Sign Up" 
3. Enter a NEW email and password
4. After signup, you should see 3 groups automatically:
   - 📁 Salesforce
   - 📁 Git  
   - 📁 NPM

**Option B - Clear Existing Data:**
1. Log in with existing account
2. Delete ALL your groups manually
3. Refresh the page (F5)
4. Default groups should appear

---

### ✅ Test 2: Drag & Drop Commands

**Setup:**
1. Make sure you have at least 2 groups
2. Add a command to one of the groups (click the + icon)
3. Example command:
   - Title: `Deploy to Org`
   - Command: `sf project deploy start -o <org>`

**Test Dragging:**
1. Find the command card in the group
2. Look for the **☰** (grip) icon on the left side
3. Click and HOLD the grip icon
4. Drag the command card over a different group
5. You should see:
   - The card follows your mouse
   - A **purple border** appears on the target group
6. Release the mouse button to DROP
7. The command should now be in the new group!

**Verify It Persisted:**
1. Refresh the page (F5)
2. The command should still be in the new group
3. This confirms it saved to the database ✅

---

### 🐛 Troubleshooting

**Default Groups Don't Appear:**
- Are you using a NEW account or do you have existing groups?
- Default groups only create when you have **ZERO** groups
- Try deleting all groups and refreshing

**Drag & Drop Doesn't Work:**
- Make sure you're clicking the **☰ grip icon** (far left of command card)
- Don't click the command title or buttons - those aren't draggable
- Try a different browser if issues persist

**Console Errors:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Most common: Supabase connection issues (check .env file)

---

### 📊 Expected Behavior

#### ✅ Working Drag & Drop:
```
Before:
Group: Salesforce
  └─ Command: "Deploy to Org"
Group: Git
  └─ (empty)

After Dragging:
Group: Salesforce
  └─ (empty)
Group: Git
  └─ Command: "Deploy to Org"  ← Moved!
```

#### ✅ Default Groups (New User):
```
Login Screen → Sign Up → Email/Password → Submit

Dashboard appears with:
┌─────────────────────┐
│ 📁 Salesforce       │
│ (No commands yet)   │
└─────────────────────┘
┌─────────────────────┐
│ 📁 Git              │
│ (No commands yet)   │
└─────────────────────┘
┌─────────────────────┐
│ 📁 NPM              │
│ (No commands yet)   │
└─────────────────────┘
```

---

### 🎯 Quick Test Checklist

- [ ] Default groups appear for new users
- [ ] Can drag command between groups
- [ ] Purple border shows on hover while dragging
- [ ] Command persists in new group after refresh
- [ ] Can still edit/delete commands after moving
- [ ] Can delete default groups (they're not locked)
- [ ] Segment copying still works (click parts of command)
- [ ] "Copy All" button still works

---

### 🚀 All Features Working:

1. ✅ **Dark Theme** - Gray background with purple accents
2. ✅ **Modal Inputs** - No browser alerts/prompts
3. ✅ **Drag & Drop** - Move commands between groups (FIXED!)
4. ✅ **Segment Copying** - Click individual parts to copy
5. ✅ **Default Groups** - Auto-created for new users (VERIFIED!)
6. ✅ **Cursor Pointer** - All buttons show pointer on hover

Ready for production! 🎉
