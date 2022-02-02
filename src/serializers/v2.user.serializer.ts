import { Serializer } from "jsonapi-serializer";
import { CORE_FIELDS } from "../models/user";
import { pick } from "lodash";

const v2UserSerializer: Serializer = new Serializer("user", {
    attributes: CORE_FIELDS,
    typeForAttribute: (attribute: string) => attribute,
    keyForAttribute: "camelCase",
    transform: (record: Record<string, any>) => {
        return {
            id: record.id,
            ...pick(record, CORE_FIELDS),
        };
    },
});

export default class V2UserSerializer {
    static serialize(data: Record<string, any>) {
        return v2UserSerializer.serialize(data);
    }
}
