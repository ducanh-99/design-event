import { Test, TestingModule } from '@nestjs/testing';
import { EventQueryService } from './event-query.service';
import { beforeEach, describe, expect, it, vitest } from 'vitest';

describe('EventQueryService', () => {
  let service: EventQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventQueryService],
    }).compile();

    service = module.get<EventQueryService>(EventQueryService);
    service.repository = { find: vitest.fn() };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return the result from cache if available', () => {
      const expectedResult = 'CachedEvent';
      vitest.spyOn(service.cache, 'get').mockReturnValue(expectedResult);
      vitest.spyOn(service.repository, 'find');

      const result = service.get();
      expect(result).toBe(expectedResult);
      expect(service.cache.get).toHaveBeenCalled();
      expect(service.repository.find).not.toHaveBeenCalled();
    });

    it('should return the result from repository if cache is empty', () => {
      const expectedResult = 'RepositoryEvent';
      vitest.spyOn(service.cache, 'get').mockReturnValue(null);
      vitest.spyOn(service.repository, 'find').mockReturnValue(expectedResult);
      const cacheSetSpy = vitest.spyOn(service.cache, 'set');

      const result = service.get();
      expect(result).toBe(expectedResult);
      expect(service.cache.get).toHaveBeenCalled();
      expect(service.repository.find).toHaveBeenCalled();
      expect(cacheSetSpy).toHaveBeenCalledWith(expectedResult);
    });
  });
});
