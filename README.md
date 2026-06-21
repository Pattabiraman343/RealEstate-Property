🏠 RealEstate-Property Platform
Full-stack real estate listing platform | Next.js + Node.js + PostgreSQL

🌐 Live Demo
Frontend: https://real-estate-property.vercel.app

Backend: https://realestate-property-jq22.onrender.com

API Docs: https://realestate-property-jq22.onrender.com/api-docs

🛠️ Tech Stack
Layer	Tech
Frontend	Next.js 14, Tailwind CSS
Backend	Node.js, Express.js
Database	PostgreSQL (Neon)
Auth	JWT (Access + Refresh Tokens)
Docs	Swagger/OpenAPI
✨ Features
🔐 Auth – Register, Login, JWT with refresh tokens

🏠 Properties – CRUD with image upload, ownership validation

🔍 Search – City, price, type, bedrooms with sorting & pagination

📊 Dashboard – Manage your properties & inquiries

💬 Inquiries – Contact owners, duplicate & spam prevention

🎯 Similar Properties – Algorithm based on price, city, type

🌐 SEO – SSR, dynamic metadata, OpenGraph

📚 API Docs – Swagger at /api-docs

📁 Quick Structure
text
backend/          # Node.js + Express API
frontend/         # Next.js App Router
uploads/          # Property images
🚀 Local Setup
bash
# Clone
git clone https://github.com/Pattabiraman343/RealEstate-Property.git
cd RealEstate-Property

# Backend
cd backend && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
Environment Variables
Backend (.env)

text
DATABASE_URL=postgresql://...
JWT_SECRET=...
REFRESH_SECRET=...
Frontend (.env.local)

text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
📡 Key APIs
Method	Endpoint	Description
POST	/api/auth/register	Register
POST	/api/auth/login	Login
GET	/api/properties	All properties
POST	/api/properties	Create (auth)
PUT	/api/properties/:id	Update (auth)
DELETE	/api/properties/:id	Delete (auth)
GET	/api/properties/search	Search & filter
POST	/api/inquiries	Send inquiry
📊 Database
users – id, name, email, password, refresh_token

properties – id, title, description, price, city, type, bedrooms, image_url, user_id

inquiries – id, property_id, name, phone, message
