"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbConnection = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const typedi_1 = require("typedi");
const config_1 = __importDefault(require("../config"));
let DbConnection = class DbConnection {
    getConnection() {
        return (new sqlite3_1.default.Database(config_1.default.databaseURL, sqlite3_1.default.OPEN_READWRITE));
    }
};
DbConnection = __decorate([
    typedi_1.Service()
], DbConnection);
exports.DbConnection = DbConnection;
//# sourceMappingURL=db.js.map