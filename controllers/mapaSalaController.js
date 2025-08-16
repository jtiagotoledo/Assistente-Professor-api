const pool = require('../config/db'); // Garanta que 'pool' está configurado para sua conexão com o MariaDB
const generateUUID = require('../utils/uuid'); // Assumindo que você tem um utilitário para gerar UUIDs

// Função para salvar ou atualizar um plano de sala
exports.salvarOuAtualizar = async (req, res) => {
    const { idClasse, nome, colunas, fileiras, assentos } = req.body;
    const idMapa = req.body.id; // Opcional: se o ID do mapa já existe para atualização

    if (!idClasse || !nome || colunas === undefined || fileiras === undefined || !assentos) {
        return res.status(400).json({ message: 'Dados incompletos para salvar o mapa de sala.' });
    }

    try {
        // Tenta encontrar um mapa existente para esta classe e nome
        const [existingMap] = await pool.query(
            'SELECT id FROM mapa_sala WHERE id_classe = ? AND nome = ?',
            [idClasse, nome]
        );

        if (existingMap.length > 0) {
            // Se o mapa já existe, atualiza
            const mapIdToUpdate = existingMap[0].id;
            await pool.query(
                'UPDATE mapa_sala SET colunas = ?, fileiras = ?, assentos = ? WHERE id = ?',
                [colunas, fileiras, JSON.stringify(assentos), mapIdToUpdate]
            );
            res.status(200).json({ id: mapIdToUpdate, message: 'Mapa de sala atualizado com sucesso.' });
        } else {
            // Se o mapa não existe, insere um novo
            const newId = generateUUID();
            await pool.query(
                'INSERT INTO mapa_sala (id, id_classe, nome, colunas, fileiras, assentos) VALUES (?, ?, ?, ?, ?, ?)',
                [newId, idClasse, nome, colunas, fileiras, JSON.stringify(assentos)]
            );
            res.status(201).json({ id: newId, message: 'Mapa de sala criado com sucesso.' });
        }
    } catch (err) {
        console.error('Erro ao salvar/atualizar mapa de sala:', err);
        res.status(500).json({ message: 'Erro interno do servidor ao salvar o mapa de sala.' });
    }
};

// Função para buscar o plano de sala de uma classe específica (o mais recente ou por nome, se houver múltiplos)
exports.getByClasseId = async (req, res) => {
    const { id_classe } = req.params;
    // Você pode adicionar um parâmetro de query para 'nome' se quiser buscar um mapa específico pelo nome
    const { nome } = req.query; 

    try {
        let query = 'SELECT colunas, fileiras, assentos FROM mapa_sala WHERE id_classe = ?';
        let params = [id_classe];

        if (nome) {
            query += ' AND nome = ?';
            params.push(nome);
        } else {
            // Se não for especificado um nome, busca o mais recente (se você tiver uma coluna de timestamp)
            // Ou o primeiro que encontrar, dependendo da sua regra de negócio
            query += ' ORDER BY atualizado_em DESC LIMIT 1'; // Assumindo que você adicionará 'atualizado_em'
        }

        const [results] = await pool.query(query, params);

        if (results.length > 0) {
            // O campo 'assentos' é retornado como string JSON, precisa ser parseado no front-end
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Mapa de sala não encontrado para esta classe.' });
        }
    } catch (err) {
        console.error('Erro ao buscar mapa de sala:', err);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar o mapa de sala.' });
    }
};

// Opcional: Função para deletar um mapa de sala
exports.delete = async (req, res) => {
    const { id } = req.params; // ID do mapa de sala a ser deletado

    try {
        const [result] = await pool.query(
            'DELETE FROM mapa_sala WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mapa de sala não encontrado.' });
        }

        res.status(200).json({ message: 'Mapa de sala excluído com sucesso.' });
    } catch (err) {
        console.error('Erro ao excluir mapa de sala:', err);
        res.status(500).json({ message: 'Erro interno do servidor ao excluir o mapa de sala.' });
    }
};