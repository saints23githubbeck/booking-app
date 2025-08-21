import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';


describe('AuthController', () => {
  let bookingController: BookingController;
  let bookingService: BookingService;

  const mockAuthService = {
    BookingDto: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [{ provide: BookingService, useValue: mockAuthService }],
    }).compile();

    bookingController = module.get<BookingController>(BookingController);
    bookingService = module.get<BookingService>(BookingService);
  });

  it('should be defined', () => {
    expect(bookingController).toBeDefined();
  });

});
