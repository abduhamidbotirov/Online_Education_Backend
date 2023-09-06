import '../db/mongo.js';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fileUpload from 'express-fileupload';
import 'reflect-metadata';
import indexRouter from "../modules/index.routes.js"
import { createExpressServer } from 'routing-controllers';
import { CategoryController } from '../modules/Category/category.contr.js';
import errorMiddleware from '../middleware/errorHandler.js';
import { VideoController } from '../modules/Video/video.contr.js';
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Express middleware'larni sozlash
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${process.cwd()}/src/public`));

app.use("/api", indexRouter)
// Routing-controllers orqali RESTful API endpointlarini tayyorlash
app.use('/api', createExpressServer({
  controllers: [CategoryController, VideoController],
}));

// Bosh sahifa uchun ro'yxat
app.get('/api', async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Welcome to the Jop API.',
      postmen: 'https://documenter.getpostman.com/view/24139682/2s93si1pwE',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Xatolarni boshqarish middleware'i
app.use(errorMiddleware);

// Serverni tinglash
app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
