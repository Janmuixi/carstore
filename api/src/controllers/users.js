import { authenticateToken, generateToken, generateTokenPair, verifyRefreshToken } from "../middlewares/auth.js";
import BaseController from "./base.js";
import userModel from "../models/user.js";

class UserController extends BaseController {
  constructor() {
    super(userModel);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  routes(app) {
    app.post("/users", this.create);
    app.post("/users/login", this.login);
    app.post("/users/refresh", this.refreshToken);
    app.get("/users", authenticateToken, this.findAll);
    app.get("/users/:id", authenticateToken, this.findById);
    app.put("/users/:id", authenticateToken, this.update);
    app.delete("/users/:id", authenticateToken, this.delete);
  }
  create = async (req, res) => {
    try {
      const userObj = req.body;
      const { password } = userObj;
      const hashedPassword = await this.model.hashPassword(password);
      delete userObj.password;
      userObj.password_hash = hashedPassword;
      const id = await this.model.create(userObj);
      res.status(201).json({ status: "success", data: id });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  };
  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await this.model.findByEmail(email);
      
      if (!user) {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid email or password" });
      }
      const isValidPassword = await userModel.comparePassword(
        password,
        user.password_hash,
      );
      
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid email or password" });
      }
      
      const { accessToken, refreshToken } = generateTokenPair(user.id);
      
      res.status(200).json({ 
        status: "success", 
        data: { 
          user: { id: user.id, email: user.email },
          accessToken,
          refreshToken
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  };
  
  refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        status: "error", 
        message: "Refresh token is required" 
      });
    }
    
    try {
      const decoded = await verifyRefreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(decoded.id);
      
      res.status(200).json({ 
        status: "success", 
        data: { 
          accessToken,
          refreshToken: newRefreshToken
        } 
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(401).json({ 
        status: "error", 
        message: "Invalid refresh token" 
      });
    }
  };
}

export default new UserController();