import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePach } from '../utils/buildRoutePath.js';

const database = new Database();
const currentDate = new Date();
const updateTaskDate = new Date();
const completedDate = new Date();

export const Routes = [
    {
        method: 'POST',
        path: buildRoutePach('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body;
            if (!title) {
                res.writeHead(400).end(JSON.stringify('Erro ao cadastrar tarefa, TITULO é obrigatório.'));
                return;
            }
            if (!description) {
                res.writeHead(400).end(JSON.stringify('Erro ao cadastrar tarefa, DESCRIÇÃO é obrigatório.'));
                return;
            }
            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: currentDate,
                completed_at: null,
                updated_at: null
            };
            database.insert('tasks', task);
            return res.writeHead(201).end(JSON.stringify('Tarefa criada com sucesso!'));
        }
    },
    {
        method: 'GET',
        path: buildRoutePach('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;
            const tasks = database.select('tasks', search ? {
                title: search
            } : null);
            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'PUT',
        path: buildRoutePach('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;
            const [task] = database.select('tasks', { id });
            if (!title) {
                return res.writeHead(400).end(JSON.stringify('Erro ao atualizar a tarefa, TITULO é obrigatório.'));
            }
            if (!description) {
                return res.writeHead(400).end(JSON.stringify('Erro ao atualizar a tarefa, DESCRIÇÃO é obrigatório.'));
            }
            if (!task) {
                return res.writeHead(404).end(JSON.stringify('A tarefa com id informado não existe na base.'));
            }
            database.update('tasks', id, {
                title,
                description,
                updated_at: updateTaskDate
            });
            return res.writeHead(204).end(JSON.stringify('Tarefa atualizada com sucesso!!'));
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePach('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const [task] = database.select('tasks', { id });
            if (!task) {
                return res.writeHead(404).end(JSON.stringify('A tarefa com id informado não existe na base.'));
            }
            database.delete('tasks', id);
            return res.writeHead(204).end(JSON.stringify('Tarefa excluida com sucesso!!'));
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePach('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const [task] = database.select('tasks', { id });
            if (!task) {
                return res.writeHead(404).end(JSON.stringify('A tarefa com id informado não existe na base.'));
            }
            database.update('tasks', id, {
                completed_at: completedDate,
            });
            return res.writeHead(204).end(JSON.stringify('Tarefa completada com sucesso!!'));
        }
    },
];