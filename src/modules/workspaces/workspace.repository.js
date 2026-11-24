export class WorkspaceRepository {
  constructor(initialItems = []) {
    this.items = initialItems.map((item) => ({ ...item }));
  }

  async findAll() {
    return this.items.map((item) => ({ ...item }));
  }

  async findById(id) {
    return this.items.find((w) => w.id === id) || null;
  }

  async findByName(name) {
    return this.items.find((w) => w.name.toLowerCase() === name.toLowerCase()) || null;
  }

  async create(data) {
    const record = {
      id: `ws_${this.items.length + 1}`,
      ...data,
      createdAt: new Date().toISOString(),
      internalFlag: true,
    };
    this.items.push(record);
    return record;
  }

  async deleteById(id) {
    const idx = this.items.findIndex((w) => w.id === id);
    if (idx === -1) return false;
    this.items.splice(idx, 1);
    return true;
  }
}
