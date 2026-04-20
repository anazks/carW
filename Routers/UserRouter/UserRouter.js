import express from "express";
import { Router } from "express";



const UserRouter = Router();

UserRouter.get("/", (req, res) => {
    res.send("User Router");
});
UserRouter.get("/register", async (req, res) => {
    res.send("User Router register");
});
UserRouter.get("/login", async (req, res)=> {
    res.send("User Router login");
});
UserRouter.get("/profile", async (req, res) => {
    res.send("User Router profile");
});
export default UserRouter;