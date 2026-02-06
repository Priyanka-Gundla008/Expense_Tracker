import { BadRequestException, Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './DTO/create-category.dto';
import { UpdateCategoryDto } from './DTO/update-category.dto';
import { Req } from '@nestjs/common';

@ApiTags('Categories')
@ApiBearerAuth('JWT')
@Controller('api/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post('/create-category')
    @ApiOperation({ summary: 'Create category' })
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Req() req: any,
    ) {
        if (!req.user?.id) {
            throw new UnauthorizedException('User not authenticated');
        }

        return this.categoriesService.createCategory(
            createCategoryDto,
            req.user.id,
        );
    }


    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    async getAllCategories(@Req() req: any) {
        return this.categoriesService.getAllCategories(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID' })
    async getCategoryById(
        @Param('id', new ParseUUIDPipe({
            version: '4',
            exceptionFactory: () => new BadRequestException('Invalid UUID'),
        })) id: string,
        @Req() req: any,
    ) {
        return this.categoriesService.getCategoryById(id, req.user.id);
    }


    @Put(':id')
    @ApiOperation({ summary: 'Update category by ID' })
    async updateCategory(
        @Param('id', new ParseUUIDPipe({
            version: '4',
            exceptionFactory: () => new BadRequestException('Invalid UUID'),
        })) id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Req() req: any,
    ) {
        return this.categoriesService.updateCategory(id, updateCategoryDto, req.user.id);
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Delete category by ID' })
    async deleteCategory(
        @Param('id', new ParseUUIDPipe({
            version: '4',
            exceptionFactory: () => new BadRequestException('Invalid UUID'),
        })) id: string,
        @Req() req: any,
    ) {
        return this.categoriesService.deleteCategory(id, req.user.id);
    }


}
