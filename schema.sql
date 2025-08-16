-- 1. Professores
CREATE TABLE IF NOT EXISTS professores (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    foto VARCHAR(255) NOT NULL DEFAULT '',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Acessos
CREATE TABLE IF NOT EXISTS acessos (
    id CHAR(36) PRIMARY KEY,
    id_professor CHAR(36) NOT NULL,
    email_professor VARCHAR(255) NOT NULL,
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_professor) REFERENCES professores(id) ON DELETE CASCADE,
    INDEX idx_acessos_id_professor (id_professor)
);

-- 3. Períodos
CREATE TABLE IF NOT EXISTS periodos (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100),
    id_professor CHAR(36),
    FOREIGN KEY (id_professor) REFERENCES professores(id) ON DELETE CASCADE,
    INDEX idx_periodos_id_professor (id_professor)
);

-- 4. Classes
CREATE TABLE IF NOT EXISTS classes (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(100),
    id_periodo CHAR(36),
    FOREIGN KEY (id_periodo) REFERENCES periodos(id) ON DELETE CASCADE,
    INDEX idx_classes_id_periodo (id_periodo)
);

-- 5. Alunos
CREATE TABLE IF NOT EXISTS alunos (
    id CHAR(36) PRIMARY KEY,
    numero INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    inativo BOOLEAN DEFAULT FALSE,
    media_notas DECIMAL(5,2),
    porc_frequencia DECIMAL(5,2),
    id_classe CHAR(36),
    FOREIGN KEY (id_classe) REFERENCES classes(id) ON DELETE CASCADE,
    INDEX idx_alunos_id_classe (id_classe),
    INDEX idx_alunos_numero (numero)
);

-- 6. Datas de chamada (frequência)
CREATE TABLE IF NOT EXISTS datas_frequencia (
    id CHAR(36) PRIMARY KEY,
    data DATE NOT NULL,
    id_classe CHAR(36) NOT NULL,
    atividade VARCHAR(255) DEFAULT '',
    FOREIGN KEY (id_classe) REFERENCES classes(id) ON DELETE CASCADE,
    INDEX idx_datas_frequencia_id_classe (id_classe),
    INDEX idx_datas_frequencia_data (data)
);

-- 7. Datas de avaliação (notas)
CREATE TABLE IF NOT EXISTS datas_nota (
    id CHAR(36) PRIMARY KEY,
    data DATE NOT NULL,
    id_classe CHAR(36) NOT NULL,
    titulo VARCHAR(255) DEFAULT '',
    FOREIGN KEY (id_classe) REFERENCES classes(id) ON DELETE CASCADE,
    INDEX idx_datas_nota_id_classe (id_classe),
    INDEX idx_datas_nota_titulo (titulo)
);

-- 8. Frequências dos alunos
CREATE TABLE IF NOT EXISTS frequencias (
    id CHAR(36) PRIMARY KEY,
    id_data_frequencia CHAR(36) NOT NULL,
    id_aluno CHAR(36) NOT NULL,
    presente BOOLEAN NOT NULL,
    FOREIGN KEY (id_data_frequencia) REFERENCES datas_frequencia(id) ON DELETE CASCADE,
    FOREIGN KEY (id_aluno) REFERENCES alunos(id) ON DELETE CASCADE,
    INDEX idx_frequencias_id_data_frequencia (id_data_frequencia),
    INDEX idx_frequencias_id_aluno (id_aluno)
);

-- 9. Notas dos alunos
CREATE TABLE IF NOT EXISTS notas (
    id CHAR(36) PRIMARY KEY,
    id_data_nota CHAR(36) NOT NULL,
    id_aluno CHAR(36) NOT NULL,
    nota DECIMAL(5,2),
    FOREIGN KEY (id_data_nota) REFERENCES datas_nota(id) ON DELETE CASCADE,
    FOREIGN KEY (id_aluno) REFERENCES alunos(id) ON DELETE CASCADE,
    INDEX idx_notas_id_data_nota (id_data_nota),
    INDEX idx_notas_id_aluno (id_aluno)
);

-- 10. Mapa Sala
CREATE TABLE IF NOT EXISTS mapa_sala (
    id CHAR(36) PRIMARY KEY,
    id_classe CHAR(36) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    colunas INT NOT NULL,
    fileiras INT NOT NULL,
    assentos JSON NOT NULL,
    FOREIGN KEY (id_classe) REFERENCES classes(id) ON DELETE CASCADE,
    INDEX idx_planos_de_sala_id_classe (id_classe)
);
