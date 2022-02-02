import { Context, Next } from "koa";
import router, { Config, Router } from "koa-joi-router";
import logger from "logger";
import { Error } from "mongoose";
import V2UserSerializer from "serializers/v2.user.serializer";

import User, { IUser, CORE_FIELDS } from "models/user";
import { uniformizeSector } from "services/sector-handler.service";
import { pick } from "lodash";

const v2UserRouter: Router = router();
v2UserRouter.prefix("/api/v2/user");

const Joi: typeof router.Joi = router.Joi;

interface IRequestUser {
    id: string;
    role: string;
    extraUserData: Record<string, any>;
}

const createUserConfig: Config = {
    validate: {
        type: "json",
        body: {
            fullName: Joi.string().optional(),
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional(),
            email: Joi.string().optional(),
            gender: Joi.string().optional(),
            country: Joi.string().optional(),
            city: Joi.string().optional(),
            sector: Joi.string().optional(),
            organization: Joi.string().optional(),
            organizationType: Joi.string().optional(),
            scaleOfOperations: Joi.string().optional(),
            position: Joi.string().optional(),
            interests: Joi.array().optional(),
            howDoYouUse: Joi.array().optional(),
            createdAt: Joi.string().optional(),
            provider: Joi.string().optional(),
        },
    },
};

const updateUserConfig: Config = createUserConfig;

class V2UserRouter {
    static getUser(ctx: Context): IRequestUser {
        let user: IRequestUser = {
            ...ctx.state.user,
        };

        return user;
    }

    static async getCurrentUser(ctx: Context) {
        logger.info("Obtaining logged in user");
        const tokenUser: IRequestUser = V2UserRouter.getUser(ctx);

        ctx.params.id = tokenUser.id;
        return V2UserRouter.getUserById(ctx);
    }

    static async getUserById(ctx: Context) {
        const tokenUser: IRequestUser = V2UserRouter.getUser(ctx);

        if (
            ctx.params.id !== tokenUser.id &&
            tokenUser.role !== "ADMIN" &&
            tokenUser.id !== "microservice"
        ) {
            ctx.throw(403, "Forbidden");
            return;
        }

        logger.info("Obtaining user by id %s", ctx.params.id);
        const user: IUser = await User.findById(ctx.params.id);
        if (user === null) {
            ctx.throw(404, "User not found");
            return;
        }
        ctx.body = V2UserSerializer.serialize(user);
    }

    static async createUser(ctx: Context) {
        logger.info("Create user", ctx.request.body);
        const existingUser: IUser = await User.findById(ctx.state.user.id);

        if (existingUser) {
            logger.error("Duplicated user");
            ctx.throw(400, "Duplicated user");
            return;
        }

        let newUserData: Record<string, any> = pick(
            ctx.request.body,
            CORE_FIELDS
        );

        if (newUserData.sector) {
            const uniformizedSector: string = uniformizeSector(
                newUserData.sector
            );
            if (!uniformizedSector) {
                logger.error("Unsupported sector");
                ctx.throw(400, "Unsupported sector");
                return;
            }

            newUserData.sector = uniformizedSector;
        }

        newUserData._id = ctx.state.user.id;

        const user: IUser = new User(newUserData);
        const errors: Error.ValidationError | null = user.validateSync();
        if (errors) {
            logger.info(errors.message);
            ctx.throw(422, "Can't create user, missing data");
            return;
        }
        const userCreate: IUser = await user.save();

        ctx.body = V2UserSerializer.serialize(userCreate);
    }

    static async updateUser(ctx: Context) {
        logger.info("Obtaining users by id %s", ctx.params.id);
        const tokenUser: IRequestUser = V2UserRouter.getUser(ctx);

        if (ctx.params.id !== tokenUser.id) {
            ctx.throw(403, "Forbidden");
            return;
        }
        let user: IUser = await User.findById(ctx.params.id);

        if (user === null) {
            user = new User();
            user._id = tokenUser.id;
            await user.save();
        }

        const { body } = ctx.request;

        if (body.fullName !== undefined) {
            user.fullName = body.fullName;
        }
        if (body.firstName !== undefined) {
            user.firstName = body.firstName;
        }
        if (body.lastName !== undefined) {
            user.lastName = body.lastName;
        }
        if (body.email !== undefined) {
            user.email = body.email;
        }

        if (body.gender !== undefined) {
            user.gender = body.gender;
        }

        if (body.country !== undefined) {
            user.country = body.country;
        }

        if (body.city !== undefined) {
            user.city = body.city;
        }

        if (body.sector !== undefined) {
            user.sector = body.sector;
        }

        if (body.organization !== undefined) {
            user.organization = body.organization;
        }

        if (body.organizationType !== undefined) {
            user.organizationType = body.organizationType;
        }

        if (body.scaleOfOperations !== undefined) {
            user.scaleOfOperations = body.scaleOfOperations;
        }

        if (body.position !== undefined) {
            user.position = body.position;
        }

        if (body.howDoYouUse !== undefined) {
            user.howDoYouUse = body.howDoYouUse;
        }

        if (body.interests !== undefined) {
            user.interests = body.interests;
        }

        if (body.provider !== undefined) {
            user.provider = body.provider;
        }

        await user.save();

        ctx.body = V2UserSerializer.serialize(user);
    }

    static async deleteUser(ctx: Context) {
        logger.info("Obtaining users by id %s", ctx.params.id);
        const tokenUser: IRequestUser = V2UserRouter.getUser(ctx);
        if (ctx.params.id !== tokenUser.id) {
            ctx.throw(401, "Not authorized");
            return;
        }
        const userFind: IUser = await User.findById(ctx.params.id);
        if (!userFind) {
            logger.error("User not found");
            ctx.throw(404, "User not found");
            return;
        }
        await userFind.remove();
        ctx.body = V2UserSerializer.serialize(userFind);
    }
}

const isLoggedIn = async (ctx: Context, next: Next) => {
    const loggedUser: IRequestUser = ctx.state.user;

    if (!loggedUser) {
        ctx.throw(401, "Unauthorized");
    }
    await next();
};

v2UserRouter.get("/", isLoggedIn, V2UserRouter.getCurrentUser);
v2UserRouter.get("/:id", isLoggedIn, V2UserRouter.getUserById);
v2UserRouter.post("/", createUserConfig, isLoggedIn, V2UserRouter.createUser);
v2UserRouter.patch(
    "/:id",
    updateUserConfig,
    isLoggedIn,
    V2UserRouter.updateUser
);
v2UserRouter.delete("/:id", isLoggedIn, V2UserRouter.deleteUser);

export default v2UserRouter;
