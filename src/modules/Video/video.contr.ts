import { JsonController, Get, Param, Post, Put, Delete, Body, OnUndefined, HttpCode, UseBefore } from 'routing-controllers';
import { IVideo } from '../../interface/interface'; // IVideo interface ni topshirish kerak
import { setRedisData, getRedisData, deleteRedisData } from '../../db/redis.js';
import Video from './video.schema.js'; // Video modelini topshirish kerak
import authMiddleware from '../../middleware/auth.js';
import { ErrorHandlerMiddleware } from '../../middleware/errorHandlerDecoratir.js';

const redisKey = process.env.allVideos as string || 'allVideos';

@JsonController('/videos')
@UseBefore(ErrorHandlerMiddleware)
export class VideoController {
    @Get('/')
    async getAllVideos(): Promise<IVideo[]> {
        let videos = await getRedisData(redisKey);

        if (!videos) {
            videos = await Video.find();
            await setRedisData(redisKey, videos);
        }

        return videos;
    }

    @Get('/:id')
    async getVideoById(@Param('id') id: string): Promise<IVideo> {
        const redisKey = `video:${id}`;
        let video = await getRedisData(redisKey);

        if (!video) {
            video = await Video.findById(id);

            if (!video) {
                throw new Error('Video not found');
            }

            await setRedisData(redisKey, video.toObject());
        }

        return video;
    }

    @Post('/')
    @UseBefore(authMiddleware)
    @HttpCode(201)
    async createVideo(@Body() videoData: IVideo): Promise<IVideo> {
        try {
            const video = new Video(videoData);
            let savedVideo = await video.save();

            // Barcha Video ma'lumotlarini qayta yozish
            const videos = await Video.find();
            await setRedisData(redisKey, videos);

            // Yangi ma'lumotni qayta Redisga yozish
            await setRedisData(`video:${savedVideo._id}`, savedVideo.toObject());
            return savedVideo.toObject();
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    @Put('/:id')
    @UseBefore(authMiddleware)
    async updateVideo(@Param('id') id: string, @Body() videoData: IVideo): Promise<IVideo> {
        const video = await Video.findByIdAndUpdate(id, videoData, { new: true });
        if (!video) {
            throw new Error('Video not found');
        }

        // Barcha Video ma'lumotlarini qayta yozish
        const videos = await Video.find();
        await setRedisData(redisKey, videos);

        // Yangilangan ma'lumotni qayta Redisga yozish
        await setRedisData(`video:${id}`, video.toObject());

        return video.toObject();
    }

    @Delete('/:id')
    @UseBefore(authMiddleware)
    @OnUndefined(204)
    async deleteVideo(@Param('id') id: string): Promise<void> {
        const video = await Video.findByIdAndDelete(id);
        if (!video) {
            throw new Error('Video not found');
        }

        // Barcha Video ma'lumotlarini qayta yozish
        const videos = await Video.find();
        await setRedisData(redisKey, videos);

        // Redisdan o'chirilgan ma'lumotni olib tashlash
        const redisKeyDel = `video:${id}`;
        await deleteRedisData(redisKeyDel);
    }
}
