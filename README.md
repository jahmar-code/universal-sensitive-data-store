## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Folder Structure

#### /api

- stores api endpoints

#### /components

stores reusable components, such as:
/DataForm.tsx - a single data object to store information, can edit or delete object
/DataList.tsx - a list of the above data objects, allows user add new data
/Footer.tsx - website footer, not in use
/Header.tsx - website header, not in use

#### /Dashboard

/page.tsx - user dashboard, can see all data objects, allows user to logout

#### /Register

/page.tsx - allows new users to register, routed from login page

#### /types

/page.tsx - set type declarations, can be removed

#### /page.tsx

allows users to login

# TODO

- use axios, JavaScript library for making HTTP requests

##### /api/api.ts

- set up reusable api endpoints

##### /components/DataForm.tsx

- set up api call to add new data, update data
- the way data is stuctured is not final, currently just a form so we can connect to backend and store generic data

##### /components/DataList

- set up api call to delete data

##### /Dashboard/page.tsx

- set up api to fetch user data from db
- fetch username
- logout functionality

##### /Register/page.tsx

- set up api to register user

##### /page.tsx

- set up api call to log user in & authenticate

##### .env.local

- store environment variables and export them in next.config.mjs
