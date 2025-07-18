class PrismaClient {
  constructor() {
    this.user = {
      async findMany() {
        return [{ id: 1, name: 'Stub User' }];
      },
    };
  }

  async $disconnect() {
    return;
  }
}

module.exports = { PrismaClient };
