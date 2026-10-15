# PATHORA PRODUCTION ASSET MANIFEST

**Document Path:** `docs/pathora-assets.md`  
**Product:** Pathora ("Every Journey Has a Path.")  
**Root Asset Directory:** `client/public/assets/pathora/`  

---

## 1. Directory Structure Overview

The asset hierarchy is organized into five functional directories within `client/public/`:
```text
client/public/
├── logo.png                                     # Root authoritative mark (1024x1024)
├── favicon.png                                  # Browser tab icon (1024x1024)
├── og-image.jpg                                 # Root Open Graph card (1792x1024)
└── assets/
    └── pathora/
        ├── brand/
        │   └── pathora-icon.png                 # Standalone app icon variant (1024x1024)
        ├── destinations/
        │   ├── santorini-hero.jpg               # Landing page caldera hero banner (1792x1024, 16:9)
        │   ├── santorini.jpg                    # Destination card variant (1792x1024)
        │   ├── bali.jpg                         # Indonesian temple card (896x1152, 3:4)
        │   ├── paris.jpg                        # Eiffel Tower golden hour card (896x1152, 3:4)
        │   ├── tokyo.jpg                        # Chureito Pagoda Fuji card (896x1152, 3:4)
        │   ├── newyork.jpg                      # Manhattan skyline card (896x1152, 3:4)
        │   ├── kyoto-banner.jpg                 # Panoramic Kyoto temple banner (1792x1024, 16:9)
        │   ├── kyoto.jpg                        # Kyoto card fallback (1792x1024)
        │   ├── kinkaku-ji.jpg                   # Golden Pavilion attraction (1024x1024, 1:1)
        │   ├── arashiyama.jpg                   # Bamboo Grove attraction (1024x1024, 1:1)
        │   ├── fushimi-inari.jpg                # Torii Gates attraction (1024x1024, 1:1)
        │   └── hotel-granvia.jpg                # Hotel Granvia Kyoto card (1024x768, 4:3)
        ├── illustrations/
        │   ├── empty-trips.svg                  # Empty portfolio graphic (Vector SVG)
        │   ├── no-results.svg                   # Search not found & 404 graphic (Vector SVG)
        │   ├── no-notifications.svg             # Clean inbox notification bell (Vector SVG)
        │   └── trip-success.svg                 # Booking / creation confirmation (Vector SVG)
        ├── motion/
        │   └── pathora-pulse.svg                # Concentric animated pulse SVG (Vector SVG)
        └── social/
            └── og-image.jpg                     # High-res social sharing display (1792x1024, 16:9)
```

---

## 2. Comprehensive Asset Inventory

### 2.1 Brand Identity Assets

| Filename | Dimensions | Format | Generation / Source Method | Integration Points | License / Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `logo.png` | 1024x1024 | PNG | Authoritative user-supplied icon | Navbar lockup, Auth headers, Loader | Proprietary Brand Asset |
| `favicon.png` | 1024x1024 | PNG | Generated from authoritative mark | Browser tab icon (`index.html`) | Proprietary Brand Asset |
| `pathora-icon.png` | 1024x1024 | PNG | Brand variant asset | Mobile drawer header, app icons | Proprietary Brand Asset |

---

### 2.2 Travel Photography Assets

All travel destination photographs were produced via high-fidelity generative imaging matching the Santorini and Kyoto art direction from the user-supplied UI reference.

| Filename | Dimensions | Aspect | Subject Matter / Description | Integration Points | Optimization |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `santorini-hero.jpg` | 1792x1024 | 16:9 | Santorini Oia whitewashed caldera at sunset with Aegean sea | `Hero.jsx`, `About.jsx` backdrop | Progressive JPEG, 857 KB |
| `santorini.jpg` | 1792x1024 | 16:9 | Santorini village caldera spotlight | `Hero.jsx`, `TripCard.jsx` fallback | Progressive JPEG, 857 KB |
| `bali.jpg` | 896x1152 | 3:4 | Ulun Danu Beratan water temple with misty mountains | `Hero.jsx` Popular Destinations | Progressive JPEG, 924 KB |
| `paris.jpg` | 896x1152 | 3:4 | Eiffel Tower golden sunset over Seine embankment | `Hero.jsx` Popular Destinations | Progressive JPEG, 1.09 MB |
| `tokyo.jpg` | 896x1152 | 3:4 | Chureito Pagoda overlooking snow-capped Mount Fuji | `Hero.jsx` Popular Destinations | Progressive JPEG, 1.12 MB |
| `newyork.jpg` | 896x1152 | 3:4 | Lower Manhattan skyscrapers at golden hour | `Hero.jsx` Popular Destinations | Progressive JPEG, 1.01 MB |
| `kyoto-banner.jpg` | 1792x1024 | 16:9 | Kyoto Kinkaku-ji temple reflection across mirror lake | `view-trip/index.jsx` header banner | Progressive JPEG, 942 KB |
| `kinkaku-ji.jpg` | 1024x1024 | 1:1 | Close vantage of Golden Pavilion with pine trees | Day 1 timeline card in Itinerary | Progressive JPEG, 942 KB |
| `arashiyama.jpg` | 1024x1024 | 1:1 | Sunlight filtering through towering Arashiyama bamboo stalks | Day 2 timeline card in Itinerary | Progressive JPEG, 1.16 MB |
| `fushimi-inari.jpg` | 1024x1024 | 1:1 | Vermilion torii gate corridor winding through forest | Day 3 timeline card in Itinerary | Progressive JPEG, 1.05 MB |
| `hotel-granvia.jpg` | 1024x768 | 4:3 | Modern luxury hotel lobby with warm ambient illumination | Hotel card & Chat attachment preview | Progressive JPEG, 771 KB |

---

### 2.3 Brand Vector Illustrations

Bespoke SVGs created specifically for Pathora adhering to the `#0A1628` navy, `#00B4D8` teal, and `#FF6B35` orange tokens.

| Filename | Type | Dimensions | Integration Points | Purpose / User Experience |
| :--- | :--- | :--- | :--- | :--- |
| `empty-trips.svg` | SVG | Responsive | `my-trips/index.jsx`, `OrganiserDashboard.jsx` | Friendly prompt when a user has not yet created or saved any journeys |
| `no-results.svg` | SVG | Responsive | `pages/Explore.jsx`, `pages/NotFound.jsx` | Clear visual feedback when filter criteria or waypoint URLs return zero hits |
| `no-notifications.svg` | SVG | Responsive | `NotificationDropdown.jsx` | Visual reassurance that user is "All Caught Up" with zero pending alerts |
| `trip-success.svg` | SVG | Responsive | `PaymentModal.jsx`, `create-trip/index.jsx` | Delightful boarding pass and compass badge signifying successful reservation |

---

### 2.4 Motion & Kinetic Assets

| Filename | Type | Technology | Integration Points | Accessibility / Reduced Motion |
| :--- | :--- | :--- | :--- | :--- |
| `pathora-pulse.svg` | Animated SVG | CSS keyframe transitions & SVG filters | Decorative backdrop & loading state | Pauses when `prefers-reduced-motion` is active |
| CSS Motion Utilities | CSS | Tailwind CSS v4 `@keyframes` | Global `client/src/index.css` | Explicitly overridden with duration 0.01ms for reduced motion |

---

### 2.5 Social Sharing & Metadata Assets

| Filename | Dimensions | Aspect | Purpose / Usage | Integration Points |
| :--- | :--- | :--- | :--- | :--- |
| `og-image.jpg` | 1792x1024 | 16:9 | High-impact 3D isometric mockup of Pathora interface with logo | OpenGraph `<meta property="og:image">`, Twitter Cards |
