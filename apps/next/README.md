# DevTK Nextjs Test Bed

1. Install dependencies:

```sh
pnpm install
```

2. Build workspace packages:

```sh
pnpm run build
```

3. Start the dev server:

```sh
pnpm --filter=@apps/next run dev
```

4. Build the application:

```sh
pnpm --filter=@apps/next run build
```

5. Run production bundle:

```sh
pnpm --filter=@apps/next run start
```
