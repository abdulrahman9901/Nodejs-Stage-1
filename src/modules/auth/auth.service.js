import {
  hashPassword,
  verifyPassword,
  signJwt,
  sanitizeUserDto,
} from "./crypto-auth.js";

export class AuthService {
  constructor(jwtSecret = "taskhub_s10_jwt_secret") {
    this.jwtSecret = jwtSecret;
    this.users = [];
  }

  async register({ email, name, password, role = "MEMBER" }) {
    const cleanEmail = email?.trim().toLowerCase() || "";
    if (!cleanEmail || !password || password.length < 6) {
      const err = new Error("Valid email and password (>= 6 chars) are required");
      err.statusCode = 422;
      err.errorCode = "VALIDATION_ERROR";
      throw err;
    }

    const exists = this.users.some((u) => u.email === cleanEmail);
    if (exists) {
      const err = new Error("Email is already registered");
      err.statusCode = 409;
      err.errorCode = "EMAIL_TAKEN";
      throw err;
    }

    const user = {
      id: `user_${this.users.length + 1}`,
      email: cleanEmail,
      name: name?.trim() || "Member",
      role,
      passwordHash: await hashPassword(password),
    };
    this.users.push(user);

    return sanitizeUserDto(user);
  }

  async login({ email, password }) {
    const cleanEmail = email?.trim().toLowerCase() || "";
    const user = this.users.find((u) => u.email === cleanEmail);

    // TODO(student): SECURITY BUG (User Enumeration)!
    // Returning different status codes / messages for "email not found" vs "wrong password"
    // lets attackers harvest registered user emails!
    // Fix this so BOTH cases throw statusCode = 401 with the exact same message: "Invalid email or password"
    if (!user) {
      const err = new Error("User with that email does not exist");
      err.statusCode = 404;
      err.errorCode = "USER_NOT_FOUND";
      throw err;
    }

    if (!(await verifyPassword(password || "", user.passwordHash))) {
      const err = new Error("Incorrect password for this account");
      err.statusCode = 401;
      err.errorCode = "WRONG_PASSWORD";
      throw err;
    }

    const accessToken = signJwt(
      { sub: user.id, email: user.email, role: user.role },
      this.jwtSecret,
      900
    );

    return {
      accessToken,
      user: sanitizeUserDto(user),
    };
  }
}
