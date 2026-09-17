# SDN302 Learning Resources

This repository is my personal knowledge base and practice workspace for the SDN302 course. It stores theory notes, runnable examples, exercises, classroom practices, and small backend projects related to JavaScript, Node.js, Express, HTTP, and MongoDB.

The repository is intended for learning and revision. Each topic connects theory with code that can be executed, inspected, modified, and tested.

## Learning Goals

- Strengthen JavaScript fundamentals used in backend development.
- Understand callbacks, Promises, `async`/`await`, timers, and the event loop.
- Understand HTTP, request-response flow, routing, and middleware.
- Build REST APIs with Node.js and Express.
- Work with MongoDB through the official Node.js driver.


## Repository Structure

```text
sdn302-resources/
├── docs/          # Learning roadmaps and theory documents
├── topics/        # Focused topics with notes, demos, and exercises
├── excercises/    # Course exercises and small implementations
├── practices/     # Guided classroom practices
├── projects/      # Larger learning projects and assignments
├── package.json   # Root scripts for demos and projects
└── README.md
```

The main assignment project is located at:

```text
projects/assignment1/
```

It contains an Express and MongoDB API organized into separate layers:

```text
Route -> Controller -> Service -> Model -> MongoDB
```

## Requirements

- Node.js 20 or later
- npm
- MongoDB Server and MongoDB Compass for database exercises
- Thunder Client, Postman, or another HTTP client for API testing

Check the installed versions:

```powershell
node --version
npm --version
```

## Getting Started

Clone the repository and enter its directory:

```powershell
git clone https://github.com/YOUR_USERNAME/sdn302-resources.git
cd sdn302-resources
```

The JavaScript foundation demos use Node.js directly and do not require additional packages.

## JavaScript Asynchronous Demos

Run the demos from the repository root:

```powershell
npm run demo:callback
npm run demo:promise
npm run demo:async
npm run demo:event-loop
```

Run the related exercise tests:

```powershell
npm run test:exercise
```

Some starter exercises are intentionally incomplete. Complete their `TODO` sections until all tests pass.

## Assignment 1: Express and MongoDB

Install the Assignment 1 dependencies:

```powershell
cd projects/assignment1
npm install
Copy-Item .env.example .env
```

Configure `.env` for the local environment:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=assignment1_modern
```

Return to the repository root:

```powershell
cd ../..
```

Available Assignment 1 commands:

```powershell
npm run assignment:dev
npm run assignment:start
npm run assignment:seed
npm run assignment:test
```

`assignment:dev` starts the API in watch mode. `assignment:start` starts it without file watching. `assignment:seed` resets the learning collections and imports the normalized sample data, so it should only be used with a development database.


## Documentation

Course notes and learning roadmaps are organized in the `docs/` directory. Topic-specific explanations and exercises are stored with their runnable examples under `topics/`.

Short definitions, review questions, and spaced-repetition notes may also be stored in Notion. This repository remains the source for executable examples, exercises, and project code.

## Notes

- This is a personal educational repository, not a production application.
- Secrets and local configuration must stay in `.env` and must not be committed.
- `.env.example` documents the required environment variables without exposing private values.
- `node_modules` is not committed; dependencies are restored with `npm install`.
- Code examples use ES Modules and include the `.js` extension in relative imports.
