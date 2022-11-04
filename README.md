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
DATABASE_URL=mongodb://root:root@mongo:27018/openqDB?authSource=admin
ACTUAL_URL=mongodb://root:root@mongo:27018/openqDB?authSource=admin
TEST_URL=mongodb+srv://openq:openq@cluster0.9voft.mongodb.net/openqDB?retryWrites=true&w=majority
OPENQ_API_URL=http://localhost:4000/
OPENQ_SUBGRAPH_HTTP_URL=http://graph_node:8000/subgraphs/name/openqdev/openq
OPENQ_API_SECRET=secret123!
PORT=4000
COOKIE_SIGNER=entropydfnjd23
PROPERTY_ID=<PROPERTY_ID>
GOOGLE_APPLICATION_CREDENTIALS=./src/context/auth.json
ORIGIN=http://localhost:3000,http//openq-frontend:3000,host.docker.internal:3000,http://localhost:8075,http://openq-bounty-actions-autotask:8075,http://localhost:4000,http://openq-api:4000,https://studio.apollographql.com
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
