# Recipe App 🍳

An AI-powered recipe management web app that turns a photo of food into a structured recipe. Snap or upload an image, and the app uses the Claude API to read it and extract the dish name, ingredients, and cooking steps automatically. Built with React, Flask, and a few cloud services.

## Features

- **AI image-to-recipe analysis** — Upload a food photo and the app calls the Claude API to detect the dish, then extracts the recipe name, ingredients, and step-by-step instructions.
- **Manual recipe cards** — Add your own recipes with custom card images.
- **Recipe links** — Save recipes from external URLs, including Instagram.
- **Cloud image storage** — Images are uploaded to Cloudinary so they persist permanently, not just in the browser.
- **Local persistence** — Recipes are saved in the browser via `localStorage`, so your data stays after you close the tab.
- **Edit & delete** — Update any saved recipe (including replacing its image) or remove it with a confirmation prompt.
- **Bilingual UI** — Toggle the interface between English and Japanese (EN / JA).
- **Clean formatting** — AI-generated recipes are displayed as readable bulleted lists.

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | React, JavaScript                   |
| Backend      | Python, Flask                       |
| AI           | Claude API                          |
| Image hosting| Cloudinary                          |
| Storage      | Browser `localStorage`              |

## How It Works

1. The user uploads a food image in the React frontend.
2. The frontend sends the image to a Flask backend server.
3. Flask forwards the image to the Claude API with a prompt asking it to identify the dish and return the recipe details.
4. The API response is formatted into a clean recipe card (name, ingredients, steps).
5. The image is stored on Cloudinary, and the recipe is saved to `localStorage`.

> A Flask backend is used as an intermediary to handle the API call and avoid CORS issues from the browser.

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3
- A Claude API key
- A Cloudinary account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/NaaaaooGit-Hub/recipe-app-react.git
   cd recipe-app-react
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   pip install flask flask-cors requests
   ```

4. Create a `.env` file in the project root and add your keys:
   ```
   API_KEY=your_api_key_here
   CLOUDINARY_URL=your_cloudinary_url_here
   ```
   > **Note:** `.env` is listed in `.gitignore` and is never committed. Keep your API keys private.

5. Start the Flask backend:
   ```bash
   python server.py
   ```

6. Start the React frontend (in a separate terminal):
   ```bash
   npm start
   ```

7. Open the app in your browser at the address shown in the terminal.

## Future Improvements

- User accounts so recipes sync across devices
- Search and filtering by ingredient
- Recipe categories and tags
- Shopping list generation from selected recipes

## About

I love cooking, and I'm always screenshotting recipes and food photos on my phone. The problem is they pile up and get lost — when I want to cook something again, I can never find the right picture. I built this app to solve that small everyday frustration: a place to capture a food photo, automatically turn it into an organized recipe, and find it again easily later.

---

*Built by [NaaaaooGit-Hub](https://github.com/NaaaaooGit-Hub)*
