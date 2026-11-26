
import Database from 'better-sqlite3';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main() {
  const terminal = createInterface({ input, output });
  const db = new Database('escola.db');

  db.exec(`
    CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      carga_horaria INTEGER NOT NULL
    );
  `);

  try {
    const nome = (await terminal.question('Nome do curso: ')).trim();

    const cargaTexto = await terminal.question('Carga horária: ');
    const cargaHoraria = Number(cargaTexto);

    if (nome.length === 0) {
      console.log('O nome não pode ficar vazio.');
      return;
    }

    if (!Number.isInteger(cargaHoraria) || cargaHoraria <= 0) {
      console.log('Informe uma carga horária inteira maior que zero.');
      return;
    }

    const inserir = db.prepare(`
      INSERT INTO cursos (nome, carga_horaria)
      VALUES (?, ?)
    `);

    const resultado = inserir.run(nome, cargaHoraria);

    console.log(`Curso cadastrado! Código: ${resultado.lastInsertRowid}`);

    const cursos = db.prepare(
      'SELECT * FROM cursos ORDER BY id'
    ).all();

    console.table(cursos);

  } finally {
    terminal.close();
    db.close();
  }
}

main().catch((erro) => {
  console.error('Ocorreu um erro:', erro);
});
