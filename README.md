# ztypes

This repository contains TypeScript definitions for Threefold Grid types. These types are essential for creating successful deployments on the Threefold Grid.

## Install node modules

Before running the deployment script, make sure you have Node.js and npm installed on your system. Then, follow these steps to install the necessary node modules:

```bash
npm i
```

## Configuration

After installing the node modules, you need to configure your credentials. Follow these steps:

- Navigate to [config.json](/src/config.json)
- Add all of your credentials there.

## Running the Script

To execute the deployment script and create a deployment on the Threefold Grid, use the following command:

```bash
ts-node src/scripts/deployment.ts
```

This command will run the TypeScript script and initiate the deployment process.
