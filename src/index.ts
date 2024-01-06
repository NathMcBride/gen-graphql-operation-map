import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import {
  concatAST,
  GraphQLSchema,
  Kind,
  DocumentNode,
  OperationDefinitionNode,
  FieldNode
} from 'graphql';

type FileWithDocument = Types.DocumentFile & {
  document: DocumentNode;
};

const isFileWithDocument = (
  documentFile: Types.DocumentFile
): documentFile is FileWithDocument => documentFile.document !== undefined;

export const plugin: PluginFunction<string> = (
  schema: GraphQLSchema,
  rawDocuments: Types.DocumentFile[]
) => {
  const p = rawDocuments.filter(isFileWithDocument).map(v => v.document);
  const allAst = concatAST(p);

  const operations = allAst.definitions.filter(
    (d): d is OperationDefinitionNode => d.kind === Kind.OPERATION_DEFINITION
  );

  const lines = operations.map(d => {
    const fields = d.selectionSet.selections
      .filter((n): n is FieldNode => n.kind === Kind.FIELD)
      .map(n => `'${n.name.value}'`);

    const queryName = d.name?.value;
    const line = `  ${queryName ?? 'oops'}: [${fields.join(',')}] as const`;
    return line;
  });

  const content = [
    `export const OperationToQuery = {\n${lines.join(',\n')}\n};`,
    'export type OperationToQuery = typeof OperationToQuery;'
  ];

  return content.join('\n\n');
};
