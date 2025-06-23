# Rate Mate (R8M8)

Rate Mate is a web application that enables users to rate and provide feedback on their teammates. Designed to encourage constructive communication and improve team collaboration, Rate Mate makes it easy to share insights and recognize contributions within your group.

# For Developing

1. Install the required dependencies:
   ```bash
        npm install
   ```
2. Create a `.env` file in the root directory using the provided `.env.example` as a template.
3. Set up the Prisma database:
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

# For Production

1. Ensure your `.env` file is configured with the correct production environment variables.
2. Run the deployment script:
   ```bash
        ./scripts/deploy.sh
   ```
