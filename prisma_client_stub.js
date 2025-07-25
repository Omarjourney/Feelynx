class PrismaClient {
  constructor() {
    this._users = [];
    this.user = {
      create: async ({ data }) => {
        const newUser = { id: this._users.length + 1, verificationStatus: 'unverified', ...data };
        this._users.push(newUser);
        return newUser;
      },
      findMany: async () => {
        return this._users;
      },
      findUnique: async ({ where }) => {
        return this._users.find(
          (u) => u.id === where.id || u.email === where.email
        );
      },
      update: async ({ where, data }) => {
        const user = this._users.find(
          (u) => u.id === where.id || u.email === where.email
        );
        if (!user) return null;
        Object.assign(user, data);
        return user;
      },
    };
  }

  async $disconnect() {
    return;
  }
}

module.exports = { PrismaClient };
