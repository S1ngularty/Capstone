function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) throw new Error(`Missing environment variable: ${name}`);

  return value;
}

export const env = {
  r2: {
    accountId: requiredEnv("R2_ACCOUNT_ID"),
    accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
    bucketName: requiredEnv("R2_BUCKET_NAME"),
  },
};
