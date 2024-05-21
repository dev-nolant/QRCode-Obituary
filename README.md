# 🌟 User Management Platform - Memorial/Obituary

Welcome to the User Management Platform! This project provides a web-based interface to manage user profiles, including their personal details, profile images, background images, and associated videos. This site was intended as an obituary site related to QR codes.

## 🚀 Features

- 🌐 User login and admin interface
- 🎨 Manage user profiles, including bio, birthday, and additional details
- 📸 Upload and update profile and background images
- 🎥 Add and manage user videos (YouTube links)
- 🗂️ JSON-based user details storage
- 🔑 Secure password handling
- 📦 Flask and SQLAlchemy integration
- 🌐 Render.com PostgreSQL database integration

## 📋 Requirements

- Python 3.7+
- Flask
- Flask-SQLAlchemy
- Flask-WTF
- Flask-Uploads
- Werkzeug
- Requests
- Psycopg2
- Qrcode
- Python-dotenv

## 🛠️ Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/dev-nolant/QRCode-Obituary-Fullstack.git
    cd QRCode-Obituary-Fullstack
    ```

2. **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3. **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Set up environment variables:**

    Create a `.env` file in the project root with the following content:

    ```env
    SECRET_KEY=your_secret_key
    ADMIN_PASSWORD=your_admin_password
    ```

5. **Set up the database:**

    Configure your database URI in the `app.config['SQLALCHEMY_DATABASE_URI']` line in `app.py`.

6. **Run the application:**

    ```bash
    python app.py
    ```

    The application will be available at `http://127.0.0.1:5000/`.

## 📄 API Endpoints

### User Endpoints

- **GET /user?user_id=<user_id>**: Retrieve user profile.
- **POST /check-password**: Check user password.
- **GET /user-dates/<uid>**: Get user dates.
- **GET /get-user-details**: Get user details.
- **POST /update-details**: Update user details.
- **POST /update-birthday**: Update user birthday.
- **POST /delete-image**: Delete user image.
- **POST /update-deathdate**: Update user death date.
- **POST /update-bio**: Update user bio.
- **POST /upload-image**: Upload user image.
- **POST /add-video**: Add user video.
- **GET /get-user-videos/<uid>**: Get user videos.
- **POST /save_name**: Save user name.
- **POST /remove-video**: Remove user video.
- **GET /uploads/<filename>**: Get uploaded file.
- **POST /update-background-image**: Update background image.
- **POST /upload-user-image**: Upload user image.
- **GET /user-images/<uid>**: Get user images.
- **POST /update-profile-image**: Update profile image.

### Admin Endpoints

- **GET /login**: Admin login.
- **POST /admin**: Admin dashboard.

## 💡 Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License.

---

Happy coding! 😊
