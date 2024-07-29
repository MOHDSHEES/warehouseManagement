# Warehouse Management System

Welcome to the Warehouse Management System! This project is a web application designed to efficiently manage warehouse operations, built using cutting-edge technologies such as Next.js, MongoDB, Cloudinary, and more.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Introduction

The Warehouse Management System (WMS) is a comprehensive solution for managing inventory, tracking shipments, and overseeing warehouse operations. It provides a user-friendly interface for warehouse staff to handle various tasks efficiently, reducing errors and increasing productivity.

## Features

- **User Authentication**: Secure login and registration using JWT.
- **Inventory Management**: Add, update, and delete inventory items.
- **Image Uploads**: Upload and manage product images with Cloudinary.
- **Responsive Design**: Fully responsive design for mobile, tablet, and desktop.
- **Real-time Updates**: Real-time inventory updates using WebSockets.

## Technologies Used

- **Next.js**: React framework for server-rendered applications.
- **MongoDB**: NoSQL database for storing inventory and order data.
- **Mongoose**: ODM for MongoDB, providing schema-based solutions.
- **Cloudinary**: Cloud-based image and video management.
- **JWT**: JSON Web Tokens for secure authentication.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/warehouse-management-system.git
    cd warehouse-management-system
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env.local` file in the root directory and add the following variables:
    ```plaintext
    MONGODB_URI=your_mongodb_connection_string
    CLOUDINARY_URL=your_cloudinary_url
    JWT_SECRET=your_jwt_secret
    ```

4. **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

Once the application is up and running, you can:

- **Register and log in** to the system.
- **Add new inventory items** and upload images.
- **Update existing items** with new information.
- **Delete items** that are no longer needed.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or inquiries, please contact:

- MOHAMMAD SHEES: [mohd.shees100@gmail.com](mailto:mohd.shees100@gmail.com)

