import { Injectable } from '@nestjs/common';

@Injectable()
export class EventQueryService {
  repository: any;
  cache: any;
  constructor() {
    this.repository = {
      find: () => {
        return 'EventQueryService';
      },
    };
    this.cache = {
      get: () => {
        return 'EventQueryService';
      },
      set: () => {},
    };
  }

  get() {
    const cache = this.cache.get();
    if (cache) {
      return cache;
    }
    const newCache = this.repository.find();
    this.cache.set(newCache);
    return newCache;
  }
}
