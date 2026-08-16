export function splitSqlStatements(source) {
  const statements = [];
  let current = '';
  let index = 0;
  let singleQuoted = false;
  let doubleQuoted = false;
  let lineComment = false;
  let blockComment = false;
  let dollarTag = null;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (lineComment) {
      current += char;
      if (char === '\n') lineComment = false;
      index += 1;
      continue;
    }

    if (blockComment) {
      current += char;
      if (char === '*' && next === '/') {
        current += next;
        blockComment = false;
        index += 2;
      } else {
        index += 1;
      }
      continue;
    }

    if (dollarTag) {
      if (source.startsWith(dollarTag, index)) {
        current += dollarTag;
        index += dollarTag.length;
        dollarTag = null;
      } else {
        current += char;
        index += 1;
      }
      continue;
    }

    if (!singleQuoted && !doubleQuoted && char === '-' && next === '-') {
      current += char + next;
      lineComment = true;
      index += 2;
      continue;
    }

    if (!singleQuoted && !doubleQuoted && char === '/' && next === '*') {
      current += char + next;
      blockComment = true;
      index += 2;
      continue;
    }

    if (!singleQuoted && !doubleQuoted && char === '$') {
      const match = source.slice(index).match(/^\$[A-Za-z_][A-Za-z0-9_]*\$|^\$\$/);
      if (match) {
        dollarTag = match[0];
        current += dollarTag;
        index += dollarTag.length;
        continue;
      }
    }

    if (!doubleQuoted && char === "'") {
      current += char;
      if (singleQuoted && next === "'") {
        current += next;
        index += 2;
        continue;
      }
      singleQuoted = !singleQuoted;
      index += 1;
      continue;
    }

    if (!singleQuoted && char === '"') {
      current += char;
      if (doubleQuoted && next === '"') {
        current += next;
        index += 2;
        continue;
      }
      doubleQuoted = !doubleQuoted;
      index += 1;
      continue;
    }

    if (!singleQuoted && !doubleQuoted && char === ';') {
      const statement = current.trim();
      if (statement) statements.push(statement);
      current = '';
      index += 1;
      continue;
    }

    current += char;
    index += 1;
  }

  const trailing = current.trim();
  if (trailing) statements.push(trailing);

  if (singleQuoted || doubleQuoted || blockComment || dollarTag) {
    throw new Error('SQL file ended inside an unterminated quote or comment.');
  }

  return statements;
}
