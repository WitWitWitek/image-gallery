"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const images_1 = __importDefault(require("./routes/images"));
const users_1 = __importDefault(require("./routes/users"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = require("./config/corsOptions");
const multer_1 = __importDefault(require("multer"));
const connectMongoDb_1 = __importDefault(require("./lib/connectMongoDb"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
mongoose_1.default.set('strictQuery', false);
(0, connectMongoDb_1.default)();
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, multer_1.default)({ storage: multer_1.default.memoryStorage() }).single('file'));
app.use('/auth', auth_1.default);
app.use('/users', users_1.default);
app.use('/images', images_1.default);
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path_1.default.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    }
    else {
        res.type('txt').send('404 Not Found');
    }
});
app.use(errorHandler_1.errorHandler);
mongoose_1.default.connection.once('open', () => {
    console.log('MongoDb connected...');
    app.listen(3500, () => console.log('Server listening on port 3500'));
});
