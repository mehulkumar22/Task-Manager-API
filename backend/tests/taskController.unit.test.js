const Task = require('../models/Task');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

jest.mock('../models/Task');

describe('Unit Tests - Task Controller', () => {
  const mockReq = {};
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getTasks - should return list of tasks', async () => {
    Task.find.mockResolvedValue([{ title: 'Sample Task' }]);

    await getTasks(mockReq, mockRes);

    expect(Task.find).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith([{ title: 'Sample Task' }]);
  });

  test('createTask - should create a task', async () => {
    mockReq.body = { title: 'New Task' };
    const saveMock = jest.fn().mockResolvedValue({ _id: '123', title: 'New Task' });
    Task.mockImplementation(() => ({ save: saveMock }));

    await createTask(mockReq, mockRes);

    expect(saveMock).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ _id: '123', title: 'New Task' });
  });

  test('updateTask - should update a task', async () => {
    mockReq.params = { id: '1' };
    mockReq.body = { completed: true };
    Task.findByIdAndUpdate.mockResolvedValue({ _id: '1', completed: true });

    await updateTask(mockReq, mockRes);

    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith('1', { completed: true }, { new: true });
    expect(mockRes.json).toHaveBeenCalledWith({ _id: '1', completed: true });
  });

  test('deleteTask - should delete a task', async () => {
    mockReq.params = { id: '1' };
    Task.findByIdAndDelete.mockResolvedValue({});

    await deleteTask(mockReq, mockRes);

    expect(Task.findByIdAndDelete).toHaveBeenCalledWith('1');
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Task deleted' });
  });
});
