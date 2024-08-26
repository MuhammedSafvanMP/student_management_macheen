import swaggerAutogen from 'swagger-autogen';
import logger from './modules/shared/utils/logger';

const doc = {
  info: {
    title: 'Student Management',
    description: 'Student Management API',
  },
  host: 'localhost:3029',
  schemes: ['http'],
};

const outputFile = '../swagger-output.json';
const routes = [
  './modules/student/routes/student.routes',
  './modules/batches/routes/batch.routes',
  './modules/attendance/routes/attendance.routes',
];

(async () => {
  try {
    await swaggerAutogen(outputFile, routes, doc);
    logger.info('Swagger documentation generated successfully.');
  } catch (err) {
    logger.error('Error generating Swagger documentation:', err);
  }
})();
