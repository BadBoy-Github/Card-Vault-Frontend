# Card Vault - Digital Gift Card Management System

An elegant and secure platform for managing digital gift cards with Apple-inspired design principles.

## ✨ Features

- **Beautiful UI/UX**: Clean, Apple-inspired design with glassmorphism effects
- **Secure Authentication**: JWT-based auth with protected routes
- **Gift Card Management**: Buy, store, and spend digital gift cards
- **Featured Deals**: Exclusive discounts and redeemable offers
- **Secure Payments**: UPI and other secure transaction methods
- **Wallet Integration**: Add value directly to your spending wallet
- **Responsive Design**: Works seamlessly across all devices
- **Dark/Light Mode**: Automatic theme switching based on system preference
- **Custom Cursor**: Elegant animated cursor on desktop devices
- **Animated Carousel**: Engaging product showcases
- **Advanced Search**: Find gift cards by category, brand, or value
- **Wishlist & Cart**: Save favorites and manage purchases
- **Order Tracking**: Complete order history and status updates
- **User Profiles**: Personalized experience with profile management

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM
- **Styling**: CSS3 with CSS Variables, Glassmorphism effects
- **State Management**: React Context API
- **Animations**: CSS keyframes and transitions
- **Icons**: Heroicons for beautiful SVG icons
- **Build Tool**: Vite for lightning-fast development and builds

## 📱 Responsive Design

Card Vault is designed to work beautifully on all devices:
- **Desktop** (≥1024px): Full experience with custom cursor
- **Tablet** (640px-1023px): Optimized layout with touch-friendly controls
- **Mobile** (<640px): Streamlined interface with minimum 44px touch targets

## 🔒 Security Features

- JWT-based authentication with secure token storage
- Protected routes for authenticated users only
- Input sanitization and validation
- Secure API communication
- Password hashing with bcrypt
- Rate limiting on authentication endpoints

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/card-vault.git
cd card-vault/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Card Vault
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # React Context providers
│   ├── assets/         # Images, icons, and static assets
│   ├── index.css       # Global styles and CSS variables
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point
```

## 🎨 Design System

Card Vault follows Apple's design principles with:

- **Color Scheme**: Premium grays with accent blues
- **Typography**: SF Pro Display/System UI font stack
- **Glassmorphism**: Transparent backgrounds with backdrop blur
- **Depth & Shadow**: Subtle elevation for UI elements
- **Motion**: Smooth transitions and micro-interactions
- **Spacing**: Consistent 8px grid system
- **Touch Targets**: Minimum 44px for mobile interactions

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

### Code Guidelines

- Follow existing code style and conventions
- Use functional components with hooks
- Keep components small and focused
- Use CSS variables for theming
- Add JSDoc comments for complex functions
- Write meaningful commit messages

## 🌐 API Integration

The frontend communicates with a RESTful API backend. Key endpoints:

- `GET /api/products` - Get all gift cards
- `GET /api/products/:id` - Get specific gift card details
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/wallet` - Get wallet balance
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user order history
- `POST /api/wishlist` - Add item to wishlist
- `GET /api/wishlist` - Get user wishlist

## 📱 Custom Cursor Implementation

Card Vault features an elegant animated custom cursor that:
- Appears only on desktop devices (≥1024px)
- Shows animated rings on hover over interactive elements
- Automatically hides on touch devices and mobile screens
- Uses CSS blend modes for seamless integration
- Includes smooth follow animations with minimal performance impact

## 🔧 Backend Setup

For complete functionality, set up the backend:

```bash
cd ../backend
npm install
# Configure database connection in .env
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙌 Acknowledgments

- Design inspiration from Apple's aesthetic principles
- React community for excellent libraries and tools
- Vite team for the amazing build tool
- Open source contributors worldwide

---

*Built with ❤️ for a better digital gift card experience*