import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';


describe('AuthController', () => {
  let searchController: SearchController;
  let searchService: SearchService;

  const mockAuthService = {
    requestOtp: jest.fn().mockResolvedValue({ success: true }),
    verifyOtp: jest.fn().mockResolvedValue({ verified: true }),
    checkIdentity: jest.fn().mockResolvedValue({ exists: false }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [{ provide: SearchService, useValue: mockAuthService }],
    }).compile();

    searchController = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(SearchController).toBeDefined();
  });
});
