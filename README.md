# Welcome To Pen & Paper

## To ensure a smooth run of the front-end web application, follow these essential steps:

1. Navigate to the frontend-web directory using the command:

### `cd frontend-web`

### `npm install`

2. Start the front-end web application with the following command:

### `npm start`




## To ensure a smooth run of the backend application, follow these essential steps:

### `cd backend`

### `npm install`

1. Create Database:
   Run the following command to create the necessary database:

### `npx sequelize-cli db:create`

2. Run Database Migrations:
   Execute the following command to apply the database migrations:

### `npx sequelize-cli db:migrate`

3. Run Users Seeder:
   Seed the database with user data by running the following command:

### `npx sequelize-cli db:seed --seed 20231129144525-demo-user.js`

4. Run Articles Seeder:
   Populate the database with article data using the following command:

### `npx sequelize-cli db:seed --seed 20231129155721-demo-article.js`

5. Start the backend application with the following command:

### `npm start`
