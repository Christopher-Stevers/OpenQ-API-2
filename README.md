# OpenQ-Api

## Boot for Local Development

Let's get you up and going in 3 easy (I hope) steps
- Get access to a MongoDB instance
- Configure .env
- Install dependencies and boot

### 1 Get Access to a MongoDB Instance

You can provision a simple MongoDB sandbox using MongoDB Atlas by following the instructions [here](https://www.mongodb.com/docs/atlas/getting-started/).

### 2 Configure OpenQ-API `.env`

In the root of `OpenQ-API`, create a `.env` file.

Copy the following from `.env.sample` to `.env`.

```bash
DATABASE_URL="mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>/openqdb?retryWrites=true&w=majority"
```

This connects MongoDB `USER` with `PASSWORD` to a database in `CLUSTER` called `openqdb`.

An example complete `DATABASE_URL` would look like:

```bash
DATABASE_URL="mongodb+srv://admin:admin123!@local.9kxsm.mongodb.net/openqdb?retryWrites=true&w=majority"
```

### 3 Boot and Access

Install dependencies with:

```bash
yarn
```

Boot locally with:

```bash
yarn start
```

You can now access the GraphiQL Playground at `http://localhost:4000`.

Any changes you make will trigger a live reload thanks to `nodemon`. 
