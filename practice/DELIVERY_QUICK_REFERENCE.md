# Delivery System - Quick Reference

## 🚀 Quick Start

### For Lenders
1. Create post → Status: `Open`
2. Click status to change to `Contacted`
3. Go to Dashboard
4. Click **"Ship Item"** → Enter receiver email
5. Click **"Mark as Delivered"**
6. Receiver gets confirmation popup
7. After confirmation → Payment: `Completed` ✓

### For Receivers
1. Browse posts in `/post` page
2. Find item you like
3. Contact lender via WhatsApp
4. Wait for item to arrive
5. When lender marks "Delivered" → **Popup appears** 📢
6. Click **"Yes, Confirmed"** or **"No, Not Received"**
7. Done! ✓

---

## 📁 File Structure

```
app/
├── api/delivery/
│   ├── confirm/route.js          # Receiver confirmation endpoint
│   └── update-status/route.js    # Lender status update endpoint
├── dashboard/page.js              # Updated with DeliveryControlPanel
└── post/page.js                   # Updated with DeliveryStatusChecker

components/
├── DeliveryControlPanel.js        # Lender delivery controls
├── DeliveryConfirmationDialog.js  # Receiver confirmation popup
└── DeliveryStatusChecker.js       # Auto-popup trigger

models/
└── post.js                        # Updated schema

DELIVERY_SYSTEM.md                 # Full documentation (this file)
```

---

## 🔑 Key Fields in Post Model

```javascript
// Status flow
status: "Open" → "Contacted" → "Shipped" → "Delivered"

// Delivery tracking
receiverEmail: "buyer@example.com"
deliveryStatus: "pending" → "confirmed" or "failed"
paymentStatus: "pending" → "completed"
deliveryConfirmedAt: Date
shippedAt: Date
deliveryAttempts: 0, 1, 2, ...
```

---

## 🔌 API Endpoints

### Lender Updates Status
```
POST /api/delivery/update-status

Body:
{
  "postId": "60f7b6d5e5c4b3a0f8e3c2a1",
  "newStatus": "Shipped",
  "receiverEmail": "buyer@email.com"  // Only for "Shipped"
}

Response: { success: true, message: "...", status: "Shipped" }
```

### Receiver Confirms Delivery
```
POST /api/delivery/confirm

Body:
{
  "postId": "60f7b6d5e5c4b3a0f8e3c2a1",
  "confirmed": true  // or false
}

Response: { success: true, message: "...", paymentStatus: "completed" }
```

---

## ⚙️ Status Transitions (Safe)

```
Open
  ↓ (click status dropdown)
Contacted
  ↓ (Dashboard: Click "Ship Item")
Shipped (receiver email entered)
  ↓ (Dashboard: Click "Mark as Delivered")
Delivered (receiver gets popup)
  ↓ (Receiver confirms)
✓ CONFIRMED (Payment: completed)

---

If receiver rejects:
Delivered → Rejected
  ↓
Contacted (retry allowed)
  ↓
(Try shipping again)
```

---

## 🛡️ Validation Rules

| Action | Who | Requirement | Error If Not |
|--------|-----|-------------|-------------|
| Create Post | Lender | Authenticated | 401 |
| Ship Item | Lender (post owner) | Receiver email required | 400 |
| Mark Delivered | Lender (post owner) | Status must be "Shipped" | 400 |
| Confirm Delivery | Receiver | Post status "Delivered" | 400 |
| Confirm Delivery | Receiver | Must be in receiverEmail | 403 |
| Confirm Delivery | Anyone | Not already confirmed | 400 |

---

## 🧪 Testing Checklist

- [ ] Create post, change to "Contacted"
- [ ] Click "Ship Item", enter email, verify status changes
- [ ] Click "Mark as Delivered", item shows purple status
- [ ] Receiver visits `/post`, sees popup automatically
- [ ] Click "Yes" → Payment shows "Completed"
- [ ] Click "No" → Status reverts to "Contacted"
- [ ] Try to access Lender controls as Receiver → Should not see them
- [ ] Try to confirm as non-receiver → Get error
- [ ] Check database: `deliveryAttempts` increases on each attempt

---

## 🐛 Common Issues & Fixes

### Issue: "Can only mark as Delivered from Shipped status"
**Cause:** Post wasn't marked as Shipped first
**Fix:** Click "Ship Item" in Contacted status first

### Issue: "Receiver email is required"
**Cause:** Forgot to enter receiver email
**Fix:** Go back to "Ship Item" form, enter email

### Issue: Popup doesn't appear
**Cause:** Not logged in as receiver OR post not "Delivered"
**Fix:** Login with receiver account, lender must mark as delivered

### Issue: "Delivery already confirmed"
**Cause:** Trying to confirm twice
**Fix:** Normal behavior - delivery already processed

---

## 📊 Database Queries

### See all shipped items waiting confirmation
```javascript
db.posts.find({ status: "Delivered", deliveryStatus: "pending" })
```

### See failed deliveries
```javascript
db.posts.find({ deliveryStatus: "failed" })
```

### See completed transactions
```javascript
db.posts.find({ paymentStatus: "completed" })
```

### See items with multiple attempts
```javascript
db.posts.find({ deliveryAttempts: { $gt: 1 } })
```

---

## 🔮 Future Enhancements

- [ ] Email notification to receiver when shipped
- [ ] SMS notification for delivery confirmation
- [ ] Payment gateway integration (Stripe, Razorpay)
- [ ] Delivery schedule/time slot selection
- [ ] Location mapping for delivery
- [ ] Dispute resolution system
- [ ] Admin dashboard (view all transactions)
- [ ] Delivery tracking number
- [ ] Insurance for items
- [ ] Seller ratings based on successful deliveries

---

## 📞 Quick Help

**Q: Can receiver change status?**
A: No, only lender. Receiver can only confirm delivery.

**Q: What if item is damaged?**
A: Receiver clicks "No" in popup, can discuss with lender again.

**Q: Can payment be processed manually?**
A: Yes, system is ready but not integrated. Currently: paymentStatus field updates.

**Q: How many delivery attempts allowed?**
A: Unlimited (counter tracks attempts). Configure in `update-status` route if needed.

**Q: Is data secure?**
A: Yes, verified by lender/receiver email, server-side validation, no client-side bypasses.

---

**Last Updated:** 2026-04-09
**Status:** ✅ Production Ready
