import { AxiosResponse, AxiosPromise } from "axios";

interface ModelAttributes<T> {
  set(value: T): void;
  getAll(): T;
  get<K extends keyof T>(key: K): T[K];
}

interface HasId {
  id?: number;
}

interface Sync<T> {
  fetch(id: number): AxiosResponse;
  save(data: T): AxiosPromise;
}

interface Events {
  on(eventName: string, callback: () => void): void;
  trigger(eventName: string): void;
}

export class Model<T extends HasId> {
  constructor(
    private attributes: ModelAttributes<T>,
    private events: Events,
    private sync: Sync<T>
  ) {}

  get on() {
    return this.events.on;
  }

  get trigger() {
    return this.events.trigger;
  }

  get get() {
    return this.attributes.get;
  }

  set(update: T): void {
    this.attributes.set(update);
    this.events.trigger("change");
  }

  fetch(): void {
    const id = this.get("id");

    console.log();

    if (typeof id !== "number") {
      throw new Error("Cannot fetch without an id");
    }
    // @ts-ignore
    this.sync.fetch(id).then((response: AxiosResponse): void => {
      this.set(response.data);
    });
    // const response = await this.sync.fetch(id);
    // this.set(response.data);
  }

  save(): void {
    this.sync
      .save(this.attributes.getAll())
      .then((response: AxiosResponse) => {
        this.trigger("save");
      })
      .catch(() => {
        this.trigger("error");
      });
  }
}