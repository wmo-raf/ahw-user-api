import { Context, Next } from "koa";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";
import logger from "logger";
import config from "config";

interface IAuth {
    secret: string;
    cliendId: string;
}

interface IRequestUser {
    id: string;
    role: string;
    email?: string;
}

const auth: IAuth = config.get("auth");

const jwtSecret = `-----BEGIN PUBLIC KEY-----\r\n${auth.secret}\r\n-----END PUBLIC KEY-----`;

const jwtVerify = async (ctx: Context, next: Next) => {
    let token = null;

    if (ctx.headers && ctx.headers.authorization) {
        const parts: string[] = ctx.headers.authorization.split(" ");
        if (parts.length === 2) {
            const scheme: string = parts[0];
            if (/^Bearer$/i.test(scheme)) {
                token = parts[1];
            }
        }
    }

    if (token) {
        logger.info("Checking token");
        try {
            const jwtDecodedToken: any = jwt.verify(token, jwtSecret, {
                algorithms: ["RS256"],
            });

            if (jwtDecodedToken) {
                const user: IRequestUser = {
                    id: jwtDecodedToken.sub,
                    email: jwtDecodedToken.email,
                    role: jwtDecodedToken?.resource_access?.[auth.cliendId]
                        ?.roles?.[0],
                };
                ctx.state.user = user;
            }
        } catch (err) {
            logger.info("Invalid token", err);
        }
    }

    await next();
};

export default jwtVerify;
