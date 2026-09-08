export interface CommissioningStorageDriver {
  read(key: string): string | null;
  write(key: string, value: string): void;
  remove(key: string): void;
}

export class MemoryCommissioningStorageDriver implements CommissioningStorageDriver {
  private readonly values = new Map<string, string>();

  read(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  write(key: string, value: string): void {
    this.values.set(key, value);
  }

  remove(key: string): void {
    this.values.delete(key);
  }
}

type BrowserStorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

export class BrowserLocalStorageDriver implements CommissioningStorageDriver {
  constructor(
    private readonly storage: BrowserStorageLike,
    private readonly prefix = 'orbi_pvmetrics_commissioning',
  ) {}

  private scopedKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  read(key: string): string | null {
    return this.storage.getItem(this.scopedKey(key));
  }

  write(key: string, value: string): void {
    this.storage.setItem(this.scopedKey(key), value);
  }

  remove(key: string): void {
    this.storage.removeItem(this.scopedKey(key));
  }
}
