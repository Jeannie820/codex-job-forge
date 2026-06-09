async function main() {
  console.log('Seed skipped: JobForge starts with an empty local database.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
