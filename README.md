# 📚 Book List Manager

A modern web application for managing and sharing your book collection. Built with Next.js, Firebase Authentication, and Prisma.

## ✨ Features

- **📖 Public Book Feed**: Browse all books shared by the community
- **👤 User Authentication**: Secure sign-up and login with Firebase
- **📚 Personal Book Collection**: Manage your own book collection
- **⭐ Book Rating System**: Rate and review books
- **🔍 Book Details**: View comprehensive book information including:
  - Title
  - Author
  - Genre
  - Description
  - Rating
  - Added by (user)

## 🛠️ Technology Stack

- **Frontend**:
  - Next.js 15.1.7
  - React 19
  - Tailwind CSS
  - Headless UI
  - Heroicons
  - Framer Motion

- **Backend**:
  - Next.js API Routes
  - Prisma (Database ORM)
  - Firebase Admin SDK

- **Authentication**:
  - Firebase Authentication
  - Custom session management

- **Database**:
  - PostgreSQL

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Firebase project

### Environment Variables

Create a `.env` file in the root directory with:

```env
# Database
DATABASE_URL="your-postgresql-database-url"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="your-client-email"
FIREBASE_PRIVATE_KEY="your-private-key"

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/book-list-manager.git
   cd book-list-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Usage

### Public Feed
- Visit the home page to see all books shared by users
- Books display title, author, genre, and who added them
- Sign in to rate books

### Authentication
- Click "Sign In" to access your account
- New users can create an account with email/password
- Google Sign-In available for quick access

### Managing Books
1. **Adding Books**:
   - Click "Add New Book" on the books page
   - Fill in book details (title, author, genre, description)
   - Click "Add Book" to save

2. **Editing Books**:
   - Navigate to your books page
   - Click the edit icon on any book
   - Update details and save changes

3. **Deleting Books**:
   - Find the book in your collection
   - Click the delete icon
   - Confirm deletion

4. **Rating Books**:
   - Click on the star rating for any book
   - Select 1-5 stars
   - Rating updates immediately

## 🔒 Security Features

- Secure authentication with Firebase
- Protected API routes
- User-specific book management
- Session-based authentication
- Server-side validation

## 🌟 Best Practices

- Modern React patterns
- Responsive design
- Error handling
- Loading states
- User feedback
- Clean code architecture

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Your Name - [ahsanulkarim.dev@gmail.com](mailto:ahsanulkarim.dev@gmail.com)

Project Link: [https://github.com/ahsantamim/book-list-app](https://github.com/ahsantamim/book-list-app)
