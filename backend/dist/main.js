"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const compression = require("compression");
const helmet_1 = require("helmet");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        snapshot: true,
        rawBody: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('E-Commerce API')
        .setVersion('1.0')
        .addTag('E-Commerce')
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, documentFactory);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use((0, helmet_1.default)(), compression());
    const port = 3000;
    await app.listen(process.env.PORT ?? port);
    common_1.Logger.log(`Application running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map