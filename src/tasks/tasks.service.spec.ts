import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = () => ({ username: 'Test user', password: 'qwerty' });

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;
  let user;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
    user = mockUser();
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filterDto: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };

      const result = await tasksService.getTasks(filterDto, user);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Task desc',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, user);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: user.id },
      });
    });

    it('throws an error as task is not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      await expect(tasksService.getTaskById(1, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.create() and returns the result', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const mockTask = {
        title: 'Test task',
        description: 'Task desc',
      };
      taskRepository.createTask.mockResolvedValue(mockTask);

      const result = await tasksService.createTask(mockTask, user);
      expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, user);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask() to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, user);
      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: user.id,
      });
    });

    it('throws an error as task is not found', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(tasksService.deleteTask(1, user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateTaskStatus', () => {
    it('updates a task status', async () => {
      const save = jest.fn().mockResolvedValue(true);

      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        user,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
