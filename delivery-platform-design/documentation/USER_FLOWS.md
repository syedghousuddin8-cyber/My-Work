# User Flows - Multi-Vendor Delivery Platform

## Customer User Flows

### 1. Food Ordering Flow
```
1. Launch App
   ↓
2. View Home Screen
   - See location
   - View category grid
   - See promotions
   ↓
3. Select "Food Delivery" Category
   ↓
4. Browse Restaurants
   - Filter by cuisine, price, delivery time
   - Sort by relevance, distance, rating
   - View restaurant cards with ratings and delivery info
   ↓
5. Select Restaurant
   ↓
6. View Restaurant Detail
   - See hero image, rating, delivery info
   - Browse menu categories
   - Search menu items
   ↓
7. Add Items to Cart
   - Customize items (modifiers, special instructions)
   - Adjust quantity
   - View running total
   ↓
8. View Cart
   - Review all items
   - Apply promo code
   - See delivery fee and taxes
   ↓
9. Checkout
   - Confirm delivery address
   - Select payment method
   - Add delivery instructions
   - Place order
   ↓
10. Order Confirmation
   - View order number
   - See estimated delivery time
   ↓
11. Track Order (Real-time)
   - See order status timeline
   - View live map with driver location
   - See ETA updates
   - Contact driver or restaurant
   ↓
12. Receive Order
   - Confirm delivery
   - Rate order and driver
   - Provide feedback
```

### 2. Grocery Shopping Flow
```
1. Home Screen → Select "Grocery"
   ↓
2. Browse Grocery Stores
   - Filter by delivery time, minimum order
   - View store cards
   ↓
3. Select Store
   ↓
4. Shop for Items
   - Browse by category
   - Use barcode scanner
   - Search products
   - Add items to cart
   ↓
5. Review Cart
   - Set substitution preferences
   - Select delivery time window
   ↓
6. Checkout
   - Confirm address and payment
   - Place order
   ↓
7. Personal Shopper Assigned
   - Receive notifications about out-of-stock items
   - Approve/reject substitutions
   - Chat with shopper
   ↓
8. Track Delivery
   - See shopping progress
   - View delivery status
   ↓
9. Receive Delivery
   - Confirm receipt
   - Rate experience
```

### 3. Pharmacy Order Flow
```
1. Home Screen → Select "Pharmacy"
   ↓
2. Browse Pharmacies
   ↓
3. Select Pharmacy
   ↓
4. Upload Prescription (if needed)
   - Take photo or upload file
   - OCR extraction
   - Pharmacist verification
   ↓
5. Browse Medications/Health Products
   - Age verification for restricted items
   ↓
6. Add to Cart
   - View drug interaction warnings
   - See cold chain requirements
   ↓
7. Checkout
   - Insurance coordination (if applicable)
   - Verify delivery address
   ↓
8. Track Order
   - See pharmacist preparation status
   - View temperature monitoring (cold chain)
   ↓
9. Receive Delivery
   - ID verification at door
   - Signature capture
   - Confirm receipt
```

## Vendor User Flows

### 1. Vendor Onboarding Flow
```
1. Download Vendor App
   ↓
2. Sign Up
   - Business information
   - Category selection
   - Document upload (licenses, permits)
   ↓
3. Verification Pending
   - Admin review
   - Background checks
   ↓
4. Account Approved
   ↓
5. Complete Profile
   - Add business hours
   - Upload logo and photos
   - Set delivery zones
   ↓
6. Set Up Menu/Catalog
   - Add items with photos
   - Set prices
   - Configure categories
   ↓
7. Configure Settings
   - Commission rates (view only)
   - Payment preferences
   - Notification settings
   ↓
8. Go Online
   - Toggle online status
   - Start receiving orders
```

### 2. Order Management Flow
```
1. Receive Order Notification
   - Sound + visual alert
   - View order details
   ↓
2. Review Order
   - Check items
   - See customer instructions
   - View delivery time estimate
   ↓
3. Accept or Reject Order
   - Accept within time limit (30-60 seconds)
   - Or reject with reason
   ↓
4. [If Accepted] Prepare Order
   - Mark items as unavailable if needed
   - Update preparation time if delayed
   ↓
5. Mark Order Ready
   - Trigger driver notification
   - Package order
   ↓
6. Driver Pickup
   - Verify order details
   - Hand off to driver
   ↓
7. Order Completed
   - Automatic status update
   - View in order history
```

### 3. Menu Management Flow
```
1. Access Menu Section
   ↓
2. View Current Menu
   - See all categories and items
   ↓
3. Edit Items
   - Update prices
   - Change descriptions
   - Upload new photos
   - Mark items as unavailable
   ↓
4. Add New Items
   - Enter details
   - Set modifiers/options
   - Upload photos
   ↓
5. Organize Categories
   - Create new categories
   - Drag-and-drop reorder
   ↓
6. Save Changes
   - Instant sync to customer app
```

## Driver/Rider User Flows

### 1. Driver Onboarding Flow
```
1. Download Rider App
   ↓
2. Sign Up
   - Personal information
   - Vehicle details
   - Upload documents (license, insurance, vehicle registration)
   ↓
3. Background Check
   - Admin verification
   ↓
4. Account Approved
   ↓
5. Complete Profile
   - Add bank account for payouts
   - Set preferences
   - Upload profile photo
   ↓
6. Training/Orientation
   - Review policies
   - Watch tutorial videos
   ↓
7. Go Online
   - Toggle availability
   - Start receiving delivery requests
```

### 2. Delivery Execution Flow
```
1. Driver is Online
   ↓
2. Receive Delivery Request
   - View pickup and dropoff locations
   - See estimated earning
   - View distance and time
   ↓
3. Accept or Decline
   - Accept within time limit
   - Or decline (with limits)
   ↓
4. [If Accepted] Navigate to Pickup
   - Use integrated navigation
   - See ETA
   ↓
5. Arrive at Pickup Location
   - Mark arrival
   - Contact vendor if needed
   ↓
6. Pick Up Order
   - Verify order details
   - Check items
   - Mark as picked up
   ↓
7. Navigate to Customer
   - Follow optimized route
   - Update ETA
   ↓
8. Arrive at Delivery Location
   - Mark arrival
   - Contact customer if needed
   ↓
9. Complete Delivery
   - Hand off order
   - Capture proof of delivery:
     * Photo
     * Signature (high-value/age-restricted)
     * OTP verification (pharmacy)
   ↓
10. Mark as Delivered
   - Automatic earnings update
   - Customer can now rate
   ↓
11. Ready for Next Delivery
   - Return to available status
```

### 3. Batch Delivery Flow
```
1. Receive Multiple Compatible Orders
   - System identifies orders in same area
   - Optimized route calculated
   ↓
2. Accept Batch
   - View all pickups and dropoffs
   - See total earning
   ↓
3. Navigate to First Pickup
   ↓
4. Pick Up Order 1
   ↓
5. Navigate to Second Pickup (if needed)
   ↓
6. Pick Up Order 2
   ↓
7. Navigate to Optimal Delivery Sequence
   - System orders deliveries by:
     * Delivery time windows
     * Food temperature requirements
     * Route efficiency
   ↓
8. Complete Each Delivery
   - Mark individually
   - Capture proof for each
   ↓
9. All Deliveries Completed
   - Batch earnings added
```

## Admin User Flows

### 1. Vendor Approval Flow
```
1. New Vendor Application Received
   ↓
2. Review Application
   - Check business information
   - Verify documents
   - Review business licenses
   ↓
3. Conduct Background Check
   - Third-party verification
   ↓
4. Approve or Reject
   - Send notification to vendor
   - If rejected, provide reason
   ↓
5. [If Approved] Set Commission Rate
   - Configure vendor-specific settings
   ↓
6. Activate Account
   - Vendor can now go online
```

### 2. Order Issue Resolution Flow
```
1. Receive Customer Complaint
   - View order details
   - Read complaint description
   ↓
2. Investigate Issue
   - Check order timeline
   - Review driver GPS data
   - Contact parties involved
   ↓
3. Determine Resolution
   - Full refund
   - Partial refund
   - Store credit
   - No action needed
   ↓
4. Process Resolution
   - Issue refund if applicable
   - Update order status
   - Send notifications
   ↓
5. Document Case
   - Add notes
   - Flag for pattern analysis
```

### 3. Promotion Creation Flow
```
1. Access Promotions Panel
   ↓
2. Create New Promotion
   - Select type (percentage, fixed amount, free delivery)
   - Set discount value
   ↓
3. Define Targeting
   - All users or specific segments
   - Category-specific
   - Vendor-specific
   - Geographic zones
   ↓
4. Set Conditions
   - Minimum order value
   - Maximum discount cap
   - Usage limits per user
   ↓
5. Schedule Promotion
   - Start and end dates
   - Active time windows
   ↓
6. Set Budget
   - Total budget cap
   - Per-user budget
   ↓
7. Preview and Publish
   - Review all settings
   - Activate promotion
   ↓
8. Monitor Performance
   - Track redemptions
   - View real-time stats
   - Adjust as needed
```

## Key Decision Points

### Customer Decision Points
- **Category Selection**: What type of delivery do I need?
- **Vendor Selection**: Which vendor to order from?
- **Item Customization**: How do I want this prepared?
- **Payment Method**: Which payment method to use?
- **Delivery Time**: Immediate or scheduled?
- **Tip Amount**: How much to tip the driver?

### Vendor Decision Points
- **Accept/Reject Order**: Can I fulfill this order?
- **Preparation Time**: How long will this take?
- **Item Availability**: Do I have all items in stock?
- **Substitution**: What substitute to offer?
- **Online/Offline**: Should I accept more orders?

### Driver Decision Points
- **Accept/Decline Delivery**: Is this delivery worth it?
- **Route Choice**: Which route to take?
- **Batch Acceptance**: Should I accept multiple orders?
- **Contact Method**: Call, text, or in-app message?
- **Delivery Method**: Contactless or hand-to-hand?

### Admin Decision Points
- **Vendor Approval**: Should this vendor be approved?
- **Dispute Resolution**: What refund/compensation is appropriate?
- **Promotion Strategy**: Which segment to target?
- **Commission Adjustment**: Should we adjust rates?
- **Feature Rollout**: Ready to launch new feature?

## Error Handling Flows

### Payment Failure
```
Customer places order → Payment declined →
Notify customer → Offer alternative payment →
Retry payment → Success/Continue or Cancel order
```

### Order Cancellation
```
Order placed → Customer/Vendor cancels →
Check cancellation policy → Calculate fee →
Process refund (if applicable) → Notify all parties →
Update analytics
```

### Driver No-Show
```
Order ready → Driver doesn't arrive →
System detects delay → Auto-reassign to new driver →
Update ETA → Notify customer →
Flag driver for review
```

### Item Out of Stock
```
Customer orders → Vendor sees out of stock →
Notify customer → Offer substitution →
Customer approves/rejects → Update order →
Adjust price if needed
```

## Integration Points

1. **Payment Gateways**: Stripe, PayPal, local processors
2. **Mapping Services**: Google Maps, Mapbox
3. **SMS/Push Notifications**: Twilio, Firebase Cloud Messaging
4. **Analytics**: Mixpanel, Amplitude, Google Analytics
5. **Customer Support**: Zendesk, Intercom
6. **Accounting**: QuickBooks, Xero
7. **Background Checks**: Checkr, Sterling
8. **Identity Verification**: Onfido, Jumio
