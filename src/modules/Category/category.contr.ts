import { JsonController, Get, Param, Post, Put, Delete, Body, OnUndefined, HttpCode } from 'routing-controllers';
import { ICategory } from '../../interface/interface';
import Category from './category.schema.js';
@JsonController('/categories')
export class CategoryController {
    @Get('/')
    async getAllCategories(): Promise<ICategory[]> {
        try {
            const categories = await Category.find();
            const categoryObjects = categories.map(category => category.toObject());
            return categoryObjects
        } catch (error) {
            throw new Error('Kategoriyalarni olishda xatolik yuz berdi');
        }
    }
    @Get('/:id')
    async getCategoryById(@Param('id') id: string): Promise<ICategory> {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category.toObject();
    }
    @Post('/')
    @HttpCode(201)
    async createCategory(@Body() categoryData: ICategory): Promise<ICategory> {
        try {
            const category = new Category(categoryData);
            let savedCategory = await category.save();
            return savedCategory.toObject();
        } catch (error: any) {
            // Xatoni console logga chiqarish
            console.error('Kategoriyani yaratishda xatolik yuz berdi:', error.message);

            throw new Error('Kategoriyani yaratishda xatolik yuz berdi');
        }
    }
    @Put('/:id')
    async updateCategory(@Param('id') id: string, @Body() categoryData: ICategory): Promise<ICategory> {
        const category = await Category.findByIdAndUpdate(id, categoryData, { new: true });
        if (!category) {
            throw new Error('Category not found');
        }
        return category.toObject();
    }

    @Delete('/:id')
    @OnUndefined(204)
    async deleteCategory(@Param('id') id: string): Promise<void> {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            throw new Error('Category not found');
        }
    }
}
