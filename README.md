# gen-graphql-operation-map

A plugin for https://the-guild.dev/graphql/codegen/docs/getting-started which generates a Typescript object and Type, mapping from user defined graphql operation names to query names.

for use with
https://github.com/NathMcBride/cypress-graphql-stub

## Example output

```
export const OperationToQuery = {
  getTask: ['task'] as const,
  getUser: ['user'] as const,
  getStatistics: ['getStatistics'] as const,
};

export type OperationToQuery = typeof OperationToQuery;
```

Notice the use of ```as const``` to aid Typescript in resolving the type as ```["task"]``` instead of ```[]string``` 

## References

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters