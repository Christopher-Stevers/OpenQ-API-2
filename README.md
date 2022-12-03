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

Copy the content from `.env.sample` to `.env`.

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

**How To Test**

1. Boot OpenQ-API, MongoDB, and Mongo Express

Using the `docker-compose.yml` in the root of the `OpenQ-API` repository, run `./boot.sh`

NOTE: You may need to `chmod u+x boot.sh` to make it executable first.

2. Run yarn