import {ObjectId} from "mongodb";
import { AppError } from "../errors/app-error.js";

export function parseObjectId(value, fieldName = "id"){

    // Một objectId tiêu chuẩn được biểu diễn bằng chuỗi gồm 24 kí tự hexadecimal
    const isValid = typeof value === "string" && /^[a-fA-F0-9]{24}$/.test(value);

    if(!isValid){
        throw new AppError(400, `${fieldName} must be a valid objectId.`,
        "INVALID_OBJECT_ID")
    }

    return new ObjectId(value);
}

