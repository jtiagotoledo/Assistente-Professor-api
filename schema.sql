-- Professores
CREATE TABLE IF NOT EXISTS professores (
    id CHAR(36) PRIMARY KEY,
    uuid VARCHAR(128) NOT NULL UNIQUE,
    nome VARCHAR(255),
    email VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Períodos
CREATE TABLE IF NOT EXISTS periodos (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100),
    ano INT,
    id_professor CHAR(36),
    FOREIGN KEY (id_professor) REFERENCES professores(id)
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100),
    id_professor CHAR(36),
    FOREIGN KEY (id_professor) REFERENCES professores(id)
);

-- Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100),
    id_professor CHAR(36),
    id_classe CHAR(36),
    FOREIGN KEY (id_professor) REFERENCES professores(id),
    FOREIGN KEY (id_classe) REFERENCES classes(id)
);

-- Frequências
CREATE TABLE IF NOT EXISTS frequencias (
    id CHAR(36) PRIMARY KEY,
    data DATE,
    presente BOOLEAN,
    id_aluno CHAR(36),
    FOREIGN KEY (id_aluno) REFERENCES alunos(id)
);

-- Notas
CREATE TABLE IF NOT EXISTS notas (
    id CHAR(36) PRIMARY KEY,
    descricao VARCHAR(100),
    valor DECIMAL(5,2),
    id_aluno CHAR(36),
    FOREIGN KEY (id_aluno) REFERENCES alunos(id)
);
