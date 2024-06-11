# Integration of ChatGPT in Prompt Engineering for Web Development

## Introduction

This project aims to explore how integrating AI tools such as ChatGPT can enhance web development by facilitating code generation, creating interactive chatbots, and other functionalities. It provides a comprehensive tutorial on using ChatGPT for prompt engineering with concrete examples and illustrations.

## Objectives

-   Understand the principles of prompt engineering and its importance in web development.
-   Explore the possibilities of integrating ChatGPT in web development.
-   Create an interactive chatbot using ChatGPT to respond to user queries on a website.
-   Use ChatGPT to generate HTML, CSS, or JavaScript code based on specific requests.
-   Document the integration process and results with screenshots, annotated source code, and concrete examples.

## Project Structure

-   **chatty-frontend**: The frontend application built with React, Typescript, Vite, and SCSS.
-   **chatty-backend**: The backend application providing the API for the ChatGPT integration.

## Setup

### chatty-frontend

#### Installation

```bash
cd chatty-frontend
npm install
npm run dev
```

#### .env

```bash
VITE_APP_BACKEND_URL=
```

### chatty-backend

```bash
cd chatty-backend
npm install
npm run prisma
npm run dev
```

#### .env

```bash
# OpenAI API
OPENAI_API_URL=https://api.openai.com/v1/chat/completions
OPENAI_API_KEY=

# JWT KEY
JWT_SECRET_KEY=

# VERCEL
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```
