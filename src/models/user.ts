import type { Document, Model, Schema as ISchema } from "mongoose";
import { model, Schema } from "mongoose";

export const CORE_FIELDS: string[] = [
    "fullName",
    "firstName",
    "lastName",
    "email",
    "gender",
    "country",
    "city",
    "sector",
    "organization",
    "organizationType",
    "scaleOfOperations",
    "position",
    "howDoYouUse",
    "interests",
    "provider",
];

export interface IUser extends Document {
    _id: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: string;
    createdAt?: Date;
    sector?: string;
    country?: string;
    city?: string;
    howDoYouUse?: any;
    language?: string;
    profileComplete?: boolean;
    position?: string;
    organization?: string;
    organizationType?: string;
    scaleOfOperations?: string;
    interests?: any;
    signUpToNewsletter?: boolean;
    topics?: any;
    provider?: string;
    applicationData: Record<string, Record<string, any>>;
}

export const User: ISchema<IUser> = new Schema<IUser>({
    _id: { type: String, trim: true },
    fullName: { type: String, required: false, trim: true },
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    email: { type: String, required: false, trim: true },
    gender: { type: String, required: false, trim: true },
    createdAt: { type: Date, required: false, default: new Date() },
    sector: { type: String, required: false, trim: true },
    country: { type: String, required: false, trim: true },
    city: { type: String, required: false, trim: true },
    howDoYouUse: { type: Array, default: [] },
    language: { type: String, required: false },
    profileComplete: { type: Boolean, default: false },
    position: { type: String, trim: true },
    organization: { type: String, trim: true },
    organizationType: { type: String, required: false, trim: true },
    scaleOfOperations: { type: String, required: false, trim: true },
    interests: { type: Array, default: [] },
    signUpToNewsletter: { type: Boolean, default: false },
    topics: { type: Array, default: [] },
    provider: { type: String, required: false, trim: true },
    applicationData: { type: Object, default: {} },
});

const UserModel: Model<IUser> = model<IUser>("User", User);

export default UserModel;
