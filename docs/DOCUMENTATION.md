# Documentation

Welcome to the Synapse documentation! This guide provides information on setting up and using the Synapse messaging system.

## Features

For a detailed overview of the features implemented in Synapse, please refer to the [Features Documentation](./FEATURES.md).

## Directory Structure

For a detailed overview of the directory structure implemented in Synapse, please refer to the [Directory Structure Documentation](./STRUCTURE.md).


## Local Setup

To set up Synapse locally, follow these steps:

### 1. **Clone the Repository**

```bash
git clone https://github.com/manthan-sharma-23/Synapse
cd Synapse
```

### 2. **Setup Client**
```bash
cd client/
pnpm i
pnpm run dev
```

### 3. **Setup Server**
- Copy the `.env.example` file to `.env` in the server directory and update it with your configuration.
```bash
cd server/
pnpm i
pnpm run dev
```

**You should have a server running on port 2700 and client running on port 3000.**