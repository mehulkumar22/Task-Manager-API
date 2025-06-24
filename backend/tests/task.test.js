const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const taskRoutes = require('../routes/taskRoutes');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Task API Integration Tests', () => {
  let taskId;

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'API testing' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    taskId = res.body._id;
  });

  it('should fetch all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ completed: true });

    expect(res.statusCode).toEqual(200);
    expect(res.body.completed).toBe(true);
  });

  it('should delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Task deleted');
  });
});
