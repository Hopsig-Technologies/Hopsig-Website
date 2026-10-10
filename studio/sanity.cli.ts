import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'e1ib49ry',
    dataset: process.env.SANITY_STUDIO_DATASET || 'development',
  },
  // Hosted at https://hopsig.sanity.studio (`pnpm --filter studio deploy`).
  studioHost: 'hopsig',
  // `pnpm --filter studio typegen`: schema -> web/sanity/types.ts (queries in web/ are typed against it).
  typegen: {
    path: '../web/{app,components,lib,sanity}/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../web/sanity/types.ts',
  },
  deployment: {
    appId: 'unqmz6g5zwnplr29iruizo8s',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
