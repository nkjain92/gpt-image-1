# Next.js Image Generator

A Next.js application for generating and managing AI-generated images using OpenAI's GPT Image API.

## Features

- Generate AI images using text prompts
- View previously generated images
- Upload and manage your own images
- Integration with OpenAI's GPT Image API

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- OpenAI API key with access to GPT Image model

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Copy the environment variables:

```bash
cp env.example .env.local
```

4. Add your OpenAI API key to the `.env.local` file:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Project Structure

- `src/app` - Next.js app router pages
- `src/components` - Reusable React components
- `src/app/api` - API routes for generating images and uploads
- `public/results` - Generated images storage
- `public/uploads` - Uploaded images storage

## Tech Stack

- Next.js 15
- React 19
- OpenAI API
- Formidable (file uploads)
- Tailwind CSS

## License

This project is MIT licensed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
