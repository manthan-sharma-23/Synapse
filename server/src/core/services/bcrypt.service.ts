import * as bcrypt from "bcryptjs";

type password = string;

class BcryptService {
  async compare_password(password: password, hash: password) {
    return await bcrypt.compare(password, hash);
  }

  async hash_password(password: password) {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}

export default new BcryptService();
