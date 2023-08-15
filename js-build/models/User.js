"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
// Created a Schema. It will describe, How our user will be stored in the database.
const UserSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: 'Role' }] // Each user has an array of roles. Ref - It's a link. Ссылка на другую сущность роли.
});
// Export the model, will create from the schema
exports.User = (0, mongoose_1.model)('User', UserSchema);
