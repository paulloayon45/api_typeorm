import express, { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import Joi, { ObjectSchema } from "joi";  // Combine imports from Joi
import { Role } from "../_helpers/role";



const router = express.Router();
const userService = new UserService();

// Routes
router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createSchema, create);
router.put("/:id", updateSchema, update);
router.delete("/:id", _delete);

export default router;

// Controller Functions
async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
}

async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const user = await userService.getById(Number(req.params.id));
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.create(req.body);
        res.json({ message: "User created" });
    } catch (error) {
        next(error);
    }
}

async function update(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.update(Number(req.params.id), req.body);
        res.json({ message: "User updated" });
    } catch (error) {
        next(error);
    }
}

async function _delete(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.delete(Number(req.params.id));
        res.json({ message: "User deleted" });
    } catch (error) {
        next(error);
    }
}

// Validation Schemas
function createSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        role: Joi.string().valid(Role.Admin, Role.User).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    });
    validateRequest(req, next, schema);
}

function updateSchema(req: Request, res: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string(),
        firstName: Joi.string(),
        lastName: Joi.string(),
        role: Joi.string().valid(Role.Admin, Role.User),
        email: Joi.string().email(),
        password: Joi.string().min(6),
        confirmPassword: Joi.string().valid(Joi.ref("password")),
    });
    validateRequest(req, next, schema);
}

export function validateRequest(req: Request, next: NextFunction, schema: ObjectSchema) {
    const { error } = schema.validate(req.body);
    if (error) {
        next(error);
    } else {
        next();
    }
}
