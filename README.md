# E-Shop Frontend

A modern, responsive e-commerce frontend built with React, TypeScript, and TailwindCSS.

![E-Shop Preview](https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=200)

## Features

- 🛍️ Modern and responsive UI design
- 🎨 Sleek product browsing experience
- 🛒 Advanced shopping cart functionality
- 💳 Secure checkout process
- 📱 Mobile-first approach
- 🔍 Product search and filtering
- 📦 Real-time order tracking
- 💌 Newsletter subscription
- 🎯 Personalized product recommendations

## Tech Stack

- **Frontend Framework:** React
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Redux Toolkit + RTK Query
- **Routing:** React Router DOM
- **Icons:** Lucide Icons
- **HTTP Client:** Axios
- **Build Tool:** Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/eshop_frontend.git
cd eshop_frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add necessary environment variables:
```env
VITE_API_BASE_URL=your_api_url_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── custom/        # Custom components
│   └── ui/           # UI components
├── features/          # Feature-based modules
│   ├── cart/         # Cart-related features
│   ├── products/     # Product-related features
│   └── auth/         # Authentication features
├── pages/            # Page components
│   └── web/         # Web pages
├── services/         # API services
├── store/           # Redux store configuration
├── styles/          # Global styles
└── utils/           # Utility functions
```

## Key Components

### Hero Section
- Dynamic image slider
- Featured categories
- Promotional banners

### Product Sections
- Popular products
- Best sellers
- Trending items
- Category browsing

### Shopping Features
- Cart management
- Secure checkout
- Order tracking
- User authentication

### Additional Features
- Newsletter subscription
- Cashback offers
- Customer support
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from modern e-commerce platforms
- [Unsplash](https://unsplash.com) for demo images
- [TailwindCSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for beautiful icons

## Support

For support, email support@example.com or join our Slack channel.

---

Made with ❤️ by Your Team Name
