import { CACHE_MANAGER, CacheTTL } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}


    async setItem(key: string, item: string) {
        this.cacheManager.set(key, item);
    }

    getItem(key:string) {
        this.cacheManager.get(key);
    }
}