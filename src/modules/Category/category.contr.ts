import { JsonController, Get, Param, Post, Put, Delete, Body, OnUndefined, HttpCode, UseBefore } from 'routing-controllers';
import { ICategory } from '../../interface/interface';
import { setRedisData, getRedisData, updateRedisData, deleteRedisData } from '../../db/redis.js';
import Category from './category.schema.js';
import authMiddleware from '../../middleware/auth';

@JsonController('/categories')
export class CategoryController {
    @Get('/')
    async getAllCategories(): Promise<ICategory[]> {
        const redisKey = 'allCategories';
        let categories = await getRedisData(redisKey);

        if (!categories) {
            categories = await Category.find();
            await setRedisData(redisKey, categories);
        }

        return categories;
    }

    @Get('/:id')
    async getCategoryById(@Param('id') id: string): Promise<ICategory> {
        const redisKey = `category:${id}`;
        let category = await getRedisData(redisKey);

        if (!category) {
            category = await Category.findById(id);

            if (!category) {
                throw new Error('Category not found');
            }

            await setRedisData(redisKey, category.toObject());
        }

        return category;
    }

    @Post('/')
    @UseBefore(authMiddleware)
    @HttpCode(201)
    async createCategory(@Body() categoryData: ICategory): Promise<ICategory> {
        try {
            const category = new Category(categoryData);
            let savedCategory = await category.save();

            // Barcha Category ma'lumotlarini qayta yozish
            const categories = await Category.find();
            await setRedisData('allCategories', categories);

            // Yangi ma'lumotni qayta Redisga yozish
            await setRedisData(`category:${savedCategory._id}`, savedCategory.toObject());

            return savedCategory.toObject();
        } catch (error: any) {
            // Xatoni console logga chiqarish
            console.error('Kategoriyani yaratishda xatolik yuz berdi:', error.message);

            throw new Error('Kategoriyani yaratishda xatolik yuz berdi');
        }
    }

    @Put('/:id')
    @UseBefore(authMiddleware)

    async updateCategory(@Param('id') id: string, @Body() categoryData: ICategory): Promise<ICategory> {
        const category = await Category.findByIdAndUpdate(id, categoryData, { new: true });
        if (!category) {
            throw new Error('Category not found');
        }

        // Barcha Category ma'lumotlarini qayta yozish
        const categories = await Category.find();
        await setRedisData('allCategories', categories);

        // Yangilangan ma'lumotni qayta Redisga yozish
        await setRedisData(`category:${id}`, category.toObject());

        return category.toObject();
    }

    @Delete('/:id')
    @UseBefore(authMiddleware)
    @OnUndefined(204)
    async deleteCategory(@Param('id') id: string): Promise<void> {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            throw new Error('Category not found');
        }

        // Barcha Category ma'lumotlarini qayta yozish
        const categories = await Category.find();
        await setRedisData('allCategories', categories);

        // Redisdan o'chirilgan ma'lumotni olib tashlash
        const redisKey = `category:${id}`;
        await deleteRedisData(redisKey);
    }
}