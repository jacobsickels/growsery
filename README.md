# Growsiry

A classic CRUD application to help people make growsery lists through defining their favorite recipies. The goal for this project is to be able to define a recipe including but not limited to:

- The name of the recipe
- How many people the recipe feeds
- The ingredients and the amount required in the recipe
- The directions on how to cook or prepare the recipe

After a user defines the recipies, they should be able to easy select them as meals they want to prepare for in the near future and create a shopping list by aggregating the ingredients of the recipies.

This is intended as a collaborative application. Users will be able to make family groups that they can invite other users into to collaborate on making recipients and selecting ingredients. Think of this as parents wanting their children to look at a meal list and select what meals they want for the week. Or, think of this as two parents sitting down and figuring out their final shopping list after they have figured out the meals they want to prepare.

All users of this application should be able to easily configure recipies an shopping lists through their phone or from their computer. This means we will have multiple client applications.

## Getting Started

### Setting up environment

First copy the contents of `.env.example` to a new file `.env` at the same level of the project. There are two things you'll need to do in this file.

Create a new `NEXTAUTH_SECRET` by running the below command and adding it to the env file.

```
openssl rand -base64 32
```

Create a new `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` by navigating to the [Discord Developer Console](https://discord.com/developers) and hitting the `New Application` button. After doing this navigate to the OAuth2 tab on the left and you will be presented with a `Client Information` section where you can copy the values for the `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` respectively from your newly created Discord client application.

Create a new `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` by following the directions on here [Next Auth Google Provider](https://next-auth.js.org/providers/google)

### Starting the application

For local development this application uses Docker to host a Postgres database.

To start the Postgres database:

```
docker-compose up -d
```

To get your database up to the newest prisma schema you'll need to run

```
npm run dev:migrate
```

After this runs you should see a list of migrations run and a message at the bottom that says something like: `Your database is now in sync with your schema.`

This is a good time to check to see if this migration has worked. Prisma has it's own database viewer that we can use for this very case. You can run the below command to open up `Prisma Studio` and view the database tables that have been created after running migrations. This will open up a tab in your browser at `http://localhost:5555/`.

```
npm dev:studio
```

The last thing we need to do is to start up the development server. You can do this by running:

```
npm run dev
```

## Tech

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
  Currently using Discord auth provider but will probably change to Google or something in the future

Database and handling requests

- For local development [Postgres](https://www.postgresql.org/)
- For deployment [Neon Serverless Postgres](https://neon.tech/)
- [Prisma](https://prisma.io) Our DB ORM, we use this to define schemas and do migrations
- [tRPC](https://trpc.io) End-to-end typesafe API requests, we use this to define our API routes and to make requests on the front end

Styling

- [Tailwind CSS](https://tailwindcss.com)

## Deployment

We're using [vercel](https://create.t3.gg/en/deployment/vercel) for our deployment and hosting.

# Making new migrations

It's really important to run this command when you make prisma schema changes

```
prisma migrate dev --name <name>
```

This makes a new migration under the prisma/migrations folder with the name appended to the folder.
These migrations are run in order depending on the time prefix.

We're running migrations with the `prisma migrate deploy` as part of the build step in the CI. So, this means that
all we need to do is make sure that these migrations are backwards compatible and can be applied in the CI.

# More Information

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!
