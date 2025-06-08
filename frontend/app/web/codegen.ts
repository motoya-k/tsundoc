import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_API_URL + '/graphql',
  documents: 'src/lib/graphql/**/*.graphql',
  generates: {
    'src/lib/graphql/generated/': {
      preset: 'client',
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request'
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        rawRequest: false,
      }
    }
  }
}

export default config