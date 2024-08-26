import express from 'express';
import { config } from 'dotenv';
import { errorHandler } from './modules/shared/middlewares/error.middleware';
import { DB } from './config/database';
import studentRoutes from './modules/student/routes/student.routes';
import batchRoutes from './modules/batches/routes/batch.routes';
import attendanceRoutes from './modules/attendance/routes/attendance.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger-output.json'; // Adjust path if necessary
import logger from './modules/shared/utils/logger';

config();

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port: number = Number(process.env.PORT) || 3000;

app.use('/api', studentRoutes);
app.use('/api', batchRoutes);
app.use('/api', attendanceRoutes);

DB();

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
