export class WorkspaceRepository {
  constructor() {
    this.items = [];
  }
  async findByName(name) {
    return this.items.find((w) => w.name.toLowerCase() === name.toLowerCase()) || null;
  }
  async create(data) {
    const record = { id: `ws_${this.items.length + 1}`, ...data, internalFlag: true };
    this.items.push(record);
    return record;
  }
}
