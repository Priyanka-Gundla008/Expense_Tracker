import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }

    async createCategory(
        createCategoryDto: CreateCategoryDto,
        userId: string,
    ): Promise<{ message: string; data: any }> {

        if (!userId) {
            throw new BadRequestException('User ID is required');
        }

        const name = createCategoryDto.name.trim();

        const exists = await this.categoryRepository.findOne({
            where: { name, userId },
        });

        if (exists) {
            throw new BadRequestException('Category already exists');
        }

        const category = this.categoryRepository.create({
            name,
            icon: createCategoryDto.icon,
            userId,
        });

        const saved = await this.categoryRepository.save(category);

        return {
            message: 'Category created successfully',
            data: {
                id: saved.id,
                userId: userId,
                name: saved.name,
                icon: saved.icon,
            },
        };
    }



    async getAllCategories(userId: string): Promise<{ message: string; userId: string; data: any[] }> {
        const categories = await this.categoryRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });

        return {
            message: 'Categories fetched successfully',
            userId,
            data: categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                icon: cat.icon,
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt,
            })),
        };
    }


    async getCategoryById(id: string, userId: string): Promise<{ message: string; data: Category }> {
        const category = await this.categoryRepository.findOne({ where: { id, userId } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return {
            message: 'Category fetched successfully',
            data: category,
        };
    }


    async updateCategory(
        id: string,
        updateCategoryDto: UpdateCategoryDto,
        userId: string,
    ): Promise<{ message: string; data: any }> {

        const category = await this.categoryRepository.findOne({ where: { id, userId } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existing = await this.categoryRepository.findOne({
                where: { name: updateCategoryDto.name, userId },
            });
            if (existing) {
                throw new BadRequestException(`Category with name "${updateCategoryDto.name}" already exists`);
            }
        }

        Object.assign(category, {
            name: updateCategoryDto.name ?? category.name,
            icon: updateCategoryDto.icon ?? category.icon,
        });

        const saved = await this.categoryRepository.save(category);

        return {
            message: 'Category updated successfully',
            data: saved,
        };
    }

    async deleteCategory(id: string, userId: string): Promise<{ message: string }> {
        const category = await this.categoryRepository.findOne({ where: { id, userId } });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        await this.categoryRepository.remove(category);

        return {
            message: 'Category deleted successfully'
        };
    }

}
