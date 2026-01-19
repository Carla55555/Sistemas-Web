# Aplicación E-Commerce

This project is a complete e-commerce application where users can register and log in, view a product list, add items to their cart, and place orders.

Each order is saved in the database, and users can view their purchase history at any time.

The project is divided into two main parts:
- A backend built with FastAPI and SQLModel that manages the database, authentication, and all business logic.

- A frontend developed with React and TypeScript that functions as a web application.

## URLs (online)   
- **Backend (FastAPI):** https://ecommerce-backend-mqhb.onrender.com
- **Backend (FastAPI): Documentation** https://ecommerce-backend-mqhb.onrender.com/docs
- **Frontend (React):** https://sistemas-web-three.vercel.app/orders 
https://sistemas-m44962wk4-carla-domenechs-projects.vercel.app/


## How to run the project locally
The project is divided into two parts: backend and frontend. The backend must be started first, and then the frontend.

### Backend
- For the backend, go to the corresponding folder: 
```bash
cd backend
```
- Install the necessary dependencies:
```bash
pip install -r requirements.txt
```
- Run the server: 
```bash
uvicorn app.main:app --reload
```

Once started, the backend will be available at:
- API: http://127.0.0.1:8000
- Documentation: http://127.0.0.1:8000/docs

### Frontend
- Then, for the frontend, make sure you enter its folder: 
```bash
cd frontend
```
- Install the dependencies:
```bash 
npm install
```
- To start the application:
```bash
npm run dev
```

Once started, the frontend will be available at:
- http://localhost:5173

From the browser you can access the frontend and use the complete application, which will automatically connect to the backend.

## Project structure

The repository is organized into two main folders: one for the backend and one for the frontend.

The backend folder contains the FastAPI application, including:
- Database configuration.
- Models (User, Product, Order, OrderItem).
- Routes for authentication, products, checkout and orders.
- Security and dependency management.

Structure:

backend/
- app/
  - models/
  - routes/
  - db.py
  - main.py
  - security.py
  - dependencies.py

The frontend folder contains the React application, including:
- Pages for products, cart, login, register and orders.
- API files to communicate with the backend.
- Components such as the layout.
- CSS.

Structure example:

frontend/
- src/
  - pages/
  - api/
  - components/
  - routes.tsx
  - App.tsx
  - main.tsx

This separation between frontend and backend keeps responsibilities clear and makes the project easier to maintain and understand.

## Project Description
This project is an e-commerce application that allows users to view products, manage a shopping cart, and place orders after logging in.

The backend is a REST API built with FastAPI and SQLModel. It handles:
- User registration and login using JWT authentication.
- Product management and inventory control.
- Shopping cart validation before creating an order.
- Order creation and storage in the database.
- Retrieving the order history for each authenticated user.

The frontend is a single-page application (SPA) developed with React and TypeScript. It allows users to:
- View the product catalog.
- View details of each product.
- Add products to the cart.
- Register and log in.
- Make orders.
- View their order history.

The frontend communicates exclusively with the backend through the API, and all data is stored and retrieved from the database managed by the backend.

## Application workflow
1. The user can enter the application and view the product list without needing to be registered.

2. From the catalog, the user can access the details of a product and add it to the cart.

3. The shopping cart is managed on the front end and allows you to:
    - View the added products.
    - View the total price.
    - Empty the cart.
    - Click the Buy button (if you are not logged in, you will be directed to log in).

4. To make a purchase, the user must register or log in.

5. Once the user has registered, they can confirm the purchase. Then:
    - The shopping cart is sent to the backend.
    - The backend validates that the products exist.
    - It checks that there is sufficient stock.
    - It calculates the order total.

6. If everything is correct:
    - An order is created in the database.
    - The purchased products are saved.
    - The stock for each product is deducted.

7. The user can access the Orders section to view the history of all their orders placed.

This flow represents the complete application usage cycle, from when the user first enters until they make a purchase and check their orders.

## API Structure
The backend API is organized into different routes, each with a clear function, which helps keep the project organized and easy to understand.

The **/health** route is used only to check that the API is working correctly. It returns a simple response indicating that the server is active.

The **/auth** route manages everything related to user authentication. Through it, new users can be registered, logged in, and the authenticated user's information can be obtained using JWT tokens.

The **/products** route handles product management and querying. It allows you to obtain the complete product list, search for products by text, and view the details of a specific product using its id.

The **/checkout** route is used to validate the shopping cart before creating an order. It checks that the items listed exist, that there is sufficient stock available, calculates the total order price, and returns which products are valid and which are not.

Finally, the **/orders** route manages everything related to orders for authenticated users. It allows users to create new orders, save purchased products, decrease the corresponding stock, and access each user's order history.

This organization clearly separates the responsibilities of each part of the API, making the backend cleaner and easier to understand.

## Frontend Structure
The frontend is organized into different pages, each with a specific function within the application.

The home page (**/**) displays the catalog of available products. From here, the user can view all products and access the details of each one.

The product details page (**/products/:id**) displays complete product information and allows users to add it to their cart.

The cart page (**/cart**) allows users to view the products they have added, check the total price, empty their cart, and complete the purchase.

The login page (**/login**) allows users to authenticate by entering their email and password.

The registration page (**/register**) allows users to create a new account. Once created, the user is automatically logged in.

The orders page (**/orders**) displays the user's purchase history. This page is only available to authenticated users.

In addition, there is a navigation menu at the top of the application. From this menu the user can quickly access products, the shopping cart, orders, and login or logout options depending on their authentication status.

This structure allows the frontend to be organized into clear and separate screens, facilitating navigation and making the application easy to use.

## Design Decisions
**FastAPI** was used on the backend due to its simplicity in creating REST APIs and its automatic documentation in /docs. **SQLite** was used for the database, along with **SQLModel**, as it allows for clear and quick definition of models and working with the database without configuring a more complex system.

A **JWT**-based authentication system was implemented. When the user logs in, the backend returns a token, which is then stored in the browser. In this way, routes that require authentication (such as creating orders or viewing history) require this token to identify the user.

The shopping cart is managed on the frontend and stored in **localStorage**. This way, the user doesn't lose their cart when the page reloads, and it's not necessary to save it to the database. Even so, before creating an order, the backend always validates the cart to ensure that the products exist, the quantities are correct, and there is sufficient stock.

When an order is created, the stock is decreased in the backend at that same moment, so that the inventory is kept up to date and no more units can be purchased than are available.

The application is separated into backend and frontend to maintain clear responsibilities: the backend manages data, authentication, and business logic, while the frontend focuses on the interface and user experience.

## Extensions and improvements
In addition to the minimum requirements, product images have been added to improve the visual experience of the application.  
Each product has an associated image that is displayed both in the product list and in the product detail page, making the store more realistic and user-friendly.

Although the project focuses on the core functionalities, it could be extended in the future with:
- An admin panel to manage products and users.
- Payment gateway integration.
- Product categories and advanced filtering.
