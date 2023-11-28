import { Test, TestingModule } from '@nestjs/testing';
import { TeamTaskCommentService } from './team-task-comment.service';

describe('TeamTaskCommentService', () => {
  let service: TeamTaskCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamTaskCommentService],
    }).compile();

    service = module.get<TeamTaskCommentService>(TeamTaskCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
