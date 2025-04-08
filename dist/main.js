"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Enable CORS
    app.enableCors({
        origin: true, // Allow all origins
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    // Enable validation pipes
    app.useGlobalPipes(new common_1.ValidationPipe());
    // Swagger configuration
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Remittance Management API')
        .setDescription('API for managing customer and bank accounts with Firebase integration')
        .setVersion('1.0')
        .addTag('customers')
        .addTag('quotes')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const PORT = process.env.PORT || 3002;
    await app.listen(PORT);
    console.log(`Application is running on: http://localhost:${PORT}`);
    console.log(`Swagger documentation is available at: http://localhost:${PORT}/api`);
}
bootstrap();
