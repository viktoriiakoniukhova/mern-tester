# mern-tester

Completed Requirements:

1. MERN Stack Development.
2. Authorization: bearer token, password hash.
3. Test Creation (only multiple-choice questions).
4. CRUD Test operations which include CRUD Questions operations.
5. Ability to View Assessment Results (candidate info and score).
6. Basic Styling.
7. Responsive Design.

Non-completed Requirements (Bonus):

1. Implement a timer for assessments.
2. Randomize question order.
3. Different question types (e.g., multiple choice, true/false, short answer, etc.)
4. Ability to upload files.

Tech-stack: 

1. Front:  => React, React-router, React-bootstrap, formik, yup, axios, uuid.
2. Back => Node, Express, Mongoose, jsonwebtoken, bcrypt, nodemon.

Deployment:

Back -> https://mern-tester-server.onrender.com/  NOTE: server goes sleeping when not actively used, so i doubt that you may catch it working.
Front -> https://mern-tester-front.vercel.app/

Run Locally:
1. Install dependencies from ./server and ./client by <code>npm install</code>.
2. Set localhosts instead of deployment links.
3. Create .env file with MONGODB_URL and JWT_SECRET inside ./server.
4. Start server by <code>npm run server</code> in ./server.
5. Start client by <code>npm start</code> in ./client.
6. Go to http://localhost:3000/ to check out frontend.
