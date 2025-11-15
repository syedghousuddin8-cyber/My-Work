# Design Guidelines - Multi-Vendor Delivery Platform

## Design Principles

### 1. Clarity Over Complexity
- Every screen should have one primary action
- Use clear, concise language
- Minimize cognitive load
- Progressive disclosure for advanced features

### 2. Speed and Efficiency
- Optimize for task completion speed
- Reduce number of taps/clicks
- Provide smart defaults
- Enable quick reordering

### 3. Category-Aware Design
- Each category (food, grocery, pharmacy) has distinct visual identity
- Consistent patterns across categories
- Category-specific iconography and colors

### 4. Trust and Safety
- Transparent pricing
- Real-time tracking
- Verified vendors and drivers
- Secure payment handling

### 5. Accessibility First
- WCAG 2.1 AA compliance
- Minimum touch target: 44x44pt
- Color contrast ratio ≥ 4.5:1 for text
- Support for screen readers
- Large text options

## Color System

### Brand Colors

#### Primary Orange
- **Primary 500**: `#F97316` - Main brand color, CTAs, active states
- **Primary 300**: `#FDBA74` - Hover states
- **Primary 700**: `#C2410C` - Pressed states
- **Primary 50**: `#FFF7ED` - Backgrounds, highlights

#### Secondary Green
- **Secondary 500**: `#22C55E` - Success states, earnings, positive metrics
- **Secondary 700**: `#15803D` - Dark variant
- **Secondary 50**: `#DCFCE7` - Light backgrounds

### Category Colors

#### Food Delivery
- Primary: `#F97316` (Orange)
- Light: `#FFEDD5`
- Dark: `#C2410C`
- Usage: Restaurant cards, food category badges, order tracking

#### Grocery
- Primary: `#22C55E` (Green)
- Light: `#DCFCE7`
- Dark: `#15803D`
- Usage: Grocery category, fresh products, organic badges

#### Pharmacy
- Primary: `#EF4444` (Red)
- Light: `#FEE2E2`
- Dark: `#DC2626`
- Usage: Pharmacy category, prescription badges, health warnings

#### Meat & Seafood
- Primary: `#DC2626` (Deep Red)
- Light: `#FEE2E2`
- Dark: `#991B1B`
- Usage: Meat category, temperature warnings

#### Retail
- Primary: `#8B5CF6` (Purple)
- Light: `#EDE9FE`
- Dark: `#6D28D9`
- Usage: General retail, miscellaneous items

### Semantic Colors

#### Success
- Main: `#10B981`
- Light: `#D1FAE5`
- Dark: `#047857`
- Usage: Order completed, payment successful, positive metrics

#### Warning
- Main: `#F59E0B`
- Light: `#FEF3C7`
- Dark: `#D97706`
- Usage: Warnings, pending actions, time-sensitive alerts

#### Error
- Main: `#EF4444`
- Light: `#FEE2E2`
- Dark: `#DC2626`
- Usage: Errors, failed payments, order cancellations

#### Info
- Main: `#3B82F6`
- Light: `#DBEAFE`
- Dark: `#1D4ED8`
- Usage: Information, tips, navigation

### Neutral Colors

- **Black**: `#000000` - Reserved for critical text only
- **Gray 900**: `#171717` - Primary text
- **Gray 700**: `#404040` - Headings
- **Gray 600**: `#525252` - Secondary text
- **Gray 500**: `#737373` - Tertiary text, labels
- **Gray 400**: `#A3A3A3` - Placeholders, disabled text
- **Gray 300**: `#D4D4D4` - Borders
- **Gray 200**: `#E5E5E5` - Dividers
- **Gray 100**: `#F5F5F5` - Backgrounds
- **Gray 50**: `#FAFAFA` - Page backgrounds
- **White**: `#FFFFFF` - Cards, surfaces

## Typography

### Font Families

#### Primary: Inter
- Usage: All UI text, body copy, headings
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- Characteristics: Excellent readability, optimized for screens

#### Secondary: Plus Jakarta Sans
- Usage: Marketing content, promotional banners
- Weights: 400, 600, 700
- Characteristics: Friendly, modern, approachable

#### Monospace: JetBrains Mono
- Usage: Order numbers, tracking codes, timestamps
- Weight: 400
- Characteristics: Clear distinction of characters

### Type Scale

| Name | Size | Weight | Line Height | Use Case |
|------|------|--------|-------------|----------|
| H1 | 48px | 700 | 1.25 | Page titles (rare) |
| H2 | 36px | 700 | 1.25 | Section titles |
| H3 | 30px | 600 | 1.25 | Card titles, modals |
| H4 | 24px | 600 | 1.25 | Subsection titles |
| H5 | 20px | 600 | 1.25 | Small headings |
| H6 | 18px | 600 | 1.25 | List headings |
| Body Large | 18px | 400 | 1.75 | Emphasized body text |
| Body | 16px | 400 | 1.5 | Default body text |
| Body Small | 14px | 400 | 1.5 | Secondary text |
| Caption | 12px | 400 | 1.5 | Captions, metadata |
| Button | 16px | 600 | 1 | Button labels |
| Label | 14px | 500 | 1.25 | Form labels |

### Text Styles

#### Headings
- Use sentence case (not title case)
- Keep concise (1-3 words ideal)
- Avoid punctuation
- High contrast color

#### Body Text
- Use sentence case
- Optimize for readability
- Maximum line length: 75 characters
- Use adequate spacing between paragraphs

#### Labels and Metadata
- Use uppercase sparingly
- Prefer medium weight over bold for emphasis
- Use color to differentiate importance

## Spacing System

### Base Unit: 4px

All spacing uses multiples of 4px for consistency.

| Token | Value | Common Use |
|-------|-------|------------|
| space-1 | 4px | Tight spacing, icon padding |
| space-2 | 8px | Small gaps, list item spacing |
| space-3 | 12px | Medium gaps |
| space-4 | 16px | Default spacing, card padding |
| space-5 | 20px | Section padding |
| space-6 | 24px | Large padding |
| space-8 | 32px | Extra large padding |
| space-10 | 40px | Section margins |
| space-12 | 48px | Page margins |
| space-16 | 64px | Large section breaks |

### Layout Spacing

- **Screen Padding**: 20px (horizontal), 16px (vertical)
- **Card Padding**: 16-24px
- **List Item Spacing**: 12px
- **Section Spacing**: 24-32px
- **Page Margins**: 32-48px (desktop)

## Components

### Buttons

#### Primary Button
- Background: `#F97316`
- Text: `#FFFFFF`
- Height: 48px (default), 36px (small), 56px (large)
- Border Radius: 12px
- Font: 16px, 600 weight
- Padding: 12px 24px
- Usage: Main CTAs, order placement, confirmations

#### Secondary Button
- Background: `#22C55E`
- Text: `#FFFFFF`
- Height: 48px
- Border Radius: 12px
- Usage: Alternative actions

#### Outline Button
- Background: Transparent
- Border: 2px solid `#F97316`
- Text: `#F97316`
- Usage: Cancel, secondary actions

#### Ghost Button
- Background: Transparent
- Text: `#F97316`
- Usage: Tertiary actions, links

#### States
- **Hover**: Reduce opacity to 90%
- **Active/Pressed**: Reduce opacity to 80%, scale 98%
- **Disabled**: 50% opacity, no interaction
- **Loading**: Show spinner, disable interaction

### Cards

#### Elevated Card
- Background: `#FFFFFF`
- Shadow: `0 2px 8px rgba(0, 0, 0, 0.1)`
- Border Radius: 16px
- Padding: 16-24px
- Border: None
- Usage: Featured content, vendor cards

#### Outlined Card
- Background: `#FFFFFF`
- Border: 1px solid `#E5E5E5`
- Border Radius: 16px
- Padding: 16px
- Shadow: None
- Usage: List items, selections

#### Filled Card
- Background: `#FAFAFA`
- Border: None
- Border Radius: 12px
- Padding: 16px
- Usage: Information sections, summaries

### Input Fields

#### Text Input
- Height: 48px
- Border: 1px solid `#E5E5E5`
- Border Radius: 12px
- Padding: 12px 16px
- Font: 16px (prevents zoom on iOS)
- Background: `#FFFFFF`

#### States
- **Focus**: Border color `#F97316`, 2px width
- **Error**: Border color `#EF4444`
- **Disabled**: Background `#F5F5F5`, text `#A3A3A3`

#### Labels
- Position: Above input, 8px margin
- Font: 14px, 500 weight
- Color: `#525252`

#### Helper Text
- Position: Below input, 4px margin
- Font: 12px, 400 weight
- Color: `#737373` (normal), `#EF4444` (error)

### Badges and Tags

#### Status Badge
- Height: 24px
- Border Radius: 6px
- Padding: 4px 10px
- Font: 12px, 600 weight
- Examples:
  - New: Background `#FEF3C7`, Text `#92400E`
  - Active: Background `#DCFCE7`, Text `#15803D`
  - Completed: Background `#E5E5E5`, Text `#525252`

#### Category Badge
- Height: 28px
- Border Radius: 8px
- Padding: 6px 12px
- Font: 13px, 600 weight
- Icon: 16px, left aligned
- Category-specific colors

### Navigation

#### Bottom Tab Bar
- Height: 64px
- Background: `#FFFFFF`
- Border Top: 1px solid `#F5F5F5`
- Shadow: `0 -2px 8px rgba(0, 0, 0, 0.05)`

#### Tab Item
- Icon: 24x24px
- Label: 11px, 500 weight
- Spacing: 4px between icon and label
- Active Color: `#F97316`
- Inactive Color: `#737373`

#### Top Navigation Bar
- Height: 56px
- Background: `#FFFFFF`
- Border Bottom: 1px solid `#F5F5F5`
- Title: 18px, 700 weight, centered
- Back Button: 40x40px, left aligned
- Actions: Right aligned

### Lists

#### List Item
- Min Height: 64px
- Padding: 12px 20px
- Border Bottom: 1px solid `#F5F5F5`
- Background: `#FFFFFF`

#### List Item States
- **Hover** (web): Background `#FAFAFA`
- **Active**: Background `#FFF7ED`
- **Selected**: Border left 4px `#F97316`

### Modals and Overlays

#### Modal
- Max Width: 500px (mobile: 90vw)
- Border Radius: 20px
- Background: `#FFFFFF`
- Shadow: `0 20px 50px rgba(0, 0, 0, 0.25)`
- Padding: 24px

#### Bottom Sheet (Mobile)
- Border Radius: 20px 20px 0 0
- Background: `#FFFFFF`
- Handle: 32px width, 4px height, `#D4D4D4`
- Padding: 24px

#### Overlay
- Background: `rgba(0, 0, 0, 0.5)`
- Backdrop blur: 4px (optional)

### Loading States

#### Spinner
- Size: 24px (small), 40px (medium), 64px (large)
- Color: `#F97316`
- Animation: Rotate 360deg in 1s

#### Skeleton
- Background: Linear gradient `#F5F5F5` → `#E5E5E5` → `#F5F5F5`
- Animation: Shimmer effect
- Border Radius: Match component

#### Progress Bar
- Height: 6px
- Background: `#E5E5E5`
- Fill: `#F97316`
- Border Radius: 3px
- Animation: Smooth fill

## Iconography

### Icon System

#### Style
- Outline style (2px stroke)
- Rounded corners (2px radius)
- 24x24px grid
- Consistent visual weight

#### Sizes
- Small: 16x16px (metadata, labels)
- Medium: 24x24px (default, lists)
- Large: 32x32px (category tiles)
- Extra Large: 48x48px (empty states)

#### Colors
- Primary icons: `#171717`
- Secondary icons: `#737373`
- Tertiary icons: `#A3A3A3`
- Colored icons: Use category colors

### Icon Categories

#### Navigation
- Home, Search, Orders, Profile
- Back, Forward, Close, Menu
- Arrow Up, Down, Left, Right

#### Actions
- Add, Remove, Edit, Delete
- Save, Share, Like, Favorite
- Call, Message, Email
- Filter, Sort, Settings

#### Status
- Check, Warning, Error, Info
- Loading, Refresh, Sync

#### Category
- Food (burger/utensils)
- Grocery (shopping cart/apple)
- Pharmacy (pill/cross)
- Meat (meat cut)
- Retail (shopping bag)

#### Delivery
- Map Pin, Navigation, Route
- Car, Bike, Scooter
- Package, Box

## Animations and Transitions

### Timing Functions

- **Ease Out**: `cubic-bezier(0.0, 0.0, 0.2, 1)` - Entering elements
- **Ease In**: `cubic-bezier(0.4, 0.0, 1, 1)` - Exiting elements
- **Ease In Out**: `cubic-bezier(0.4, 0.0, 0.2, 1)` - State changes

### Durations

- **Instant**: 100ms - Micro-interactions
- **Fast**: 200ms - Simple transitions
- **Medium**: 300ms - Default animations
- **Slow**: 400ms - Complex animations
- **Slower**: 500ms - Page transitions

### Common Animations

#### Button Press
```css
transform: scale(0.98);
transition: transform 100ms ease-out;
```

#### Card Hover
```css
transform: translateY(-4px);
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
transition: all 300ms ease-out;
```

#### Modal Enter
```css
opacity: 0 → 1;
transform: scale(0.9) → scale(1);
duration: 300ms ease-out;
```

#### Page Transition
```css
opacity: 0 → 1;
transform: translateX(20px) → translateX(0);
duration: 300ms ease-out;
```

#### Skeleton Loading
```css
background: linear-gradient(90deg, #f5f5f5 0%, #e5e5e5 50%, #f5f5f5 100%);
background-size: 200% 100%;
animation: shimmer 1.5s infinite;
```

## Responsive Design

### Breakpoints

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Desktop Large**: 1440px+

### Mobile-First Approach

1. Design for mobile (375px width baseline)
2. Enhance for tablet
3. Optimize for desktop
4. Add extra features for large screens

### Adaptive Layouts

#### Customer App
- Mobile: Single column, full width
- Tablet: 2 columns for lists, side panel for details
- Desktop: Multi-column grids, persistent navigation

#### Admin Panel
- Mobile: Collapse sidebar, simplified tables
- Tablet: Collapsible sidebar, scrollable tables
- Desktop: Fixed sidebar, full-featured tables
- Large Desktop: Multi-column dashboards

### Touch Targets

- Minimum: 44x44px (iOS), 48x48px (Android)
- Recommended: 48x48px (mobile), 40x40px (desktop)
- Spacing: Minimum 8px between targets

## Accessibility

### Color Contrast

- **Text**: Minimum 4.5:1 (WCAG AA)
- **Large Text**: Minimum 3:1
- **UI Components**: Minimum 3:1
- **Active States**: Clear visual distinction

### Screen Readers

- Semantic HTML elements
- ARIA labels for custom components
- Skip links for navigation
- Focus order follows visual order

### Keyboard Navigation

- All interactive elements keyboard accessible
- Visible focus indicators
- Logical tab order
- Keyboard shortcuts for common actions

### Alternative Text

- All images have descriptive alt text
- Decorative images: `alt=""`
- Complex images: Detailed descriptions

### Motion

- Respect `prefers-reduced-motion`
- Provide alternative to animations
- No auto-playing videos with sound

## Voice and Tone

### Customer App

#### Friendly and Helpful
- "Let's find something delicious!"
- "Your order is on its way"
- "Thanks for choosing us!"

#### Clear and Concise
- "Add to cart" not "Add this item to your shopping cart"
- "Track order" not "View order status"

#### Reassuring
- "We'll keep you updated"
- "Your payment is secure"
- "Help is available 24/7"

### Vendor App

#### Professional and Efficient
- "New order received"
- "Mark as ready"
- "View today's earnings"

#### Action-Oriented
- "Accept" not "Would you like to accept?"
- "Update menu" not "Menu management"

### Driver App

#### Direct and Informative
- "Navigate to pickup"
- "Estimated earning: $12.50"
- "2.3 miles • 15 min"

#### Encouraging
- "Great job! 5-star rating"
- "You're almost at your goal!"

### Admin Panel

#### Data-Driven and Precise
- "Revenue up 12.5%"
- "342 active orders"
- "Vendor approval pending"

#### Professional
- "Review application"
- "Process refund"
- "Generate report"

## Imagery

### Photography Style

- Bright and appetizing (food)
- Clean and organized (grocery)
- Professional and clinical (pharmacy)
- Realistic and detailed (meat/seafood)

### Image Specifications

#### Vendor Logos
- Format: PNG with transparency
- Size: 512x512px
- Max file size: 100KB
- Aspect ratio: 1:1

#### Food/Product Photos
- Format: JPG or WebP
- Minimum size: 1200x800px
- Max file size: 500KB
- Aspect ratio: 3:2 or 4:3

#### Hero Images
- Format: JPG or WebP
- Size: 1920x1080px
- Max file size: 800KB
- Aspect ratio: 16:9

### Image Guidelines

- No watermarks or logos
- Good lighting and focus
- Appropriate framing
- Consistent style within category
- Alt text always provided

## Error Handling

### Error Messages

#### Format
```
[Icon] [Brief Description]
[Detailed Explanation]
[Action Button]
```

#### Example
```
❌ Payment Failed
Your card was declined. Please try another payment method.
[Try Again]  [Change Payment]
```

### Error Types

#### Validation Errors
- Inline, next to field
- Red color `#EF4444`
- Specific guidance

#### Network Errors
- Toast notification
- Retry button
- "No internet connection" messaging

#### System Errors
- Full-screen error state
- Friendly illustration
- Contact support option

### Empty States

#### Format
```
[Illustration]
[Heading]
[Description]
[Action Button]
```

#### Example
```
[Shopping cart illustration]
Your cart is empty
Add items from your favorite restaurants
[Start Shopping]
```

## Platform-Specific Guidelines

### iOS

- Use SF Symbols when possible
- Follow iOS Human Interface Guidelines
- Native gestures (swipe to go back)
- Bottom tab bar navigation
- Large titles where appropriate
- Use system fonts for accessibility

### Android

- Material Design principles
- Navigation drawer (optional)
- Floating Action Buttons
- Bottom navigation
- Ripple effects on touch
- Use Roboto or custom fonts

### Web

- Responsive design
- Hover states
- Breadcrumb navigation
- Keyboard shortcuts
- Right-click menus
- Print-friendly views

## Performance Guidelines

### Load Times

- Initial load: < 3 seconds
- Page transitions: < 200ms
- API responses: < 500ms
- Image loading: Progressive/lazy

### Image Optimization

- Use WebP format where supported
- Lazy load below fold
- Responsive images
- CDN delivery

### Animation Performance

- Use `transform` and `opacity` for animations
- Avoid animating `height`, `width`, `top`, `left`
- Use CSS animations over JavaScript
- Limit simultaneous animations

## Documentation Standards

### Component Documentation

Each component should include:
1. **Purpose**: What it's for
2. **Usage**: When to use it
3. **Variants**: All available variants
4. **Props**: All properties and defaults
5. **Examples**: Code snippets
6. **Accessibility**: ARIA attributes, keyboard support
7. **Do's and Don'ts**: Best practices

### Design Handoff

Provide:
1. High-fidelity mockups
2. Component specifications
3. Interaction states
4. Spacing measurements
5. Color values
6. Typography specifications
7. Animation details
8. Edge cases and error states
