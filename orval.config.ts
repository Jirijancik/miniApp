import { defineConfig } from 'orval';

export default defineConfig({
  miniapp: {
    input: {
      target: 'https://frontend-test-be.stage.thinkeasy.cz/api-json',
    },
    output: {
      target: './src/api/generated',
      schemas: './src/api/generated/model',
      mode: 'tags-split',
      client: 'axios-functions',
      override: {
        mutator: {
          path: './src/api/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
