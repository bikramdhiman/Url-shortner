📌 URL Shortener API

A scalable URL Shortener API built using Node.js, Express, MongoDB.
Supports Google OAuth authentication, analytics, rate limiting, caching, and deployment on Render.



🚀 Features

✅ Shorten URLs with Custom Aliases

✅ Google OAuth Authentication (Only Google Sign-In)

✅ Rate Limiting (Prevents API abuse)

✅ Real-Time Analytics (Total clicks, unique users, OS, device types)

✅ Topic-Based URL Grouping

✅ Deployed on Render




📡 Live API URL

🌍 Base URL:https://url-shortner-lt22.onrender.com

🛠 Installation

1️⃣ Clone the repository:

git clone https://github.com/yourusername/url-shortener.git

cd url-shortener

2️⃣ Install dependencies:


npm install

3️⃣ Create a .env file and add:



PORT=5000

MONGO_URI=your_mongodb_url

GOOGLE_CLIENT_ID=your-google-client-id

GOOGLE_CLIENT_SECRET=your-google-client-secret

GOOGLE_CALLBACK_URL=live_link/auth/google

JWT_SECRET=your-secret-key

SESSION_SECRET=your-session-secret


4️⃣ Start the server:

npm start


🔗 API Endpoints

1️⃣ Authentication API

Method	Endpoint	Description

GET	/auth/google	Redirects user to Google OAuth login

GET	/auth/google/callback	Handles Google OAuth callback, returns JWT token

GET	/auth/logout	Logs out the user


2️⃣ URL Shortener API

Method	Endpoint	Description

POST	/api/shorten	Shorten a URL (custom alias optional)

GET	/api/shorten/:alias	Redirect to original URL, logs analytics

📥 Request Body for /api/shorten:




{
  "longUrl": "https://example.com",
  
  "customAlias": "example123",
  
  "topic": "marketing"
  
}


3️⃣ Analytics API

Method	Endpoint	Description

GET	/api/analytics/:alias	Get analytics for a specific short URL

GET	/api/analytics/topic/:topic	Get analytics for all URLs under a topic

GET	/api/analytics/overall	Get overall analytics for all user-created URLs

📤 Response for /api/analytics/:alias:



📈 Rate Limiting

Max 5 URL creation requests per minute per user.

If exceeded, response:

{ "message": "Too many URL creation attempts, please try again later" }



📡 Deployment

1️⃣ Deploy to Render

Push the repo to GitHub.

Connect GitHub to Render.

Add Environment Variables (MONGO_URI, GOOGLE_CLIENT_ID, etc.).

Deploy and get a live URL!

✅ Live API:

https://url-shortner-lt22.onrender.com

💡 Contributors
👤 Bikramjeet
💻 GitHub

🎯 Final Checklist

✅ Includes all API details & features

✅ Provides installation & deployment steps

✅ Includes example API responses
