# Rate Mate (R8M8)

**Rate Mate** is a web application that enables users to rate and provide feedback on their teammates. Designed to foster constructive communication and enhance team collaboration, Rate Mate makes it easy to share insights and recognize contributions within a group.

## 🛠️ Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory using `.env.example` as a template.

3. Set up the database with Prisma:

   ```bash
   npx prisma migrate dev
   ```

4. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

## 🚀 Production

1. Ensure your `.env` file contains the correct production environment variables.

2. Run the deployment script:

   ```bash
   ./scripts/deploy.sh
   ```
