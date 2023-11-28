import { Test, TestingModule } from '@nestjs/testing';
import { TeamTaskCommentController } from './team-task-comment.controller';

describe('TeamTaskCommentController', () => {
  let controller: TeamTaskCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamTaskCommentController],
    }).compile();

    controller = module.get<TeamTaskCommentController>(TeamTaskCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
