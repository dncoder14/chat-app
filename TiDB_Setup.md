# TiDB Database Setup

## Connection String Format

Your `DATABASE_URL` in `.env` should include SSL parameters:

```env
DATABASE_URL="mysql://username:password@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?ssl={"rejectUnauthorized":true}&sslcert=/path/to/ca.pem"
```

## For TiDB Serverless (Recommended):

```env
DATABASE_URL="mysql://username:password@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
```

## After updating .env:

1. Generate Prisma client:
```bash
cd backend
npx prisma generate
```

2. Deploy schema to TiDB:
```bash
npx prisma db push
```

3. Verify connection:
```bash
npx prisma studio
```

## Troubleshooting:

- Ensure your TiDB cluster is running
- Check if your IP is whitelisted in TiDB console
- Verify username/password are correct
- Make sure database name exists in TiDB