-- Professores
CREATE TABLE IF NOT EXISTS professores (
    id CHAR(36) PRIMARY KEY,
    uuid VARCHAR(128) NOT NULL UNIQUE,
    nome VARCHAR(255),
    email VARCHAR(255),
    foto VARCHAR(255) NOT NULL DEFAULT '',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Acessos
CREATE TABLE IF NOT EXISTS acessos (
    id CHAR(36) PRIMARY KEY,
    id_professor CHAR(36) NOT NULL,
    email_professor VARCHAR(255) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_professor) REFERENCES professores(id)
);

-- Períodos
CREATE TABLE IF NOT EXISTS periodos (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100),
    id_professor CHAR(36),
    FOREIGN KEY (id_professor) REFERENCES professores(id)
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100),
    id_periodo CHAR(36),
    FOREIGN KEY (id_periodo) REFERENCES periodos(id)
);

-- Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id CHAR(36) PRIMARY KEY,             
    numero VARCHAR(100) NOT NULL,                      
    nome VARCHAR(100) NOT NULL,               
    inativo BOOLEAN DEFAULT FALSE,            
    media_notas DECIMAL(5,2),                  
    porc_frequencia DECIMAL(5,2),       
    id_classe CHAR(36),                        
    FOREIGN KEY (id_classe) REFERENCES classes(id)
);

-- Frequências
CREATE TABLE IF NOT EXISTS frequencias (
    id CHAR(36) PRIMARY KEY,
    data DATE,
    atividades VARCHAR(100),
    presente BOOLEAN,
    id_aluno CHAR(36),
    FOREIGN KEY (id_aluno) REFERENCES alunos(id)
);

-- Notas
CREATE TABLE IF NOT EXISTS notas (
    id CHAR(36) PRIMARY KEY,
    data DATE,
    titulo VARCHAR(100),
    valor DECIMAL(5,2),
    id_aluno CHAR(36),
    FOREIGN KEY (id_aluno) REFERENCES alunos(id)
);
