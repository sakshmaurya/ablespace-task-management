import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects with filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'priority', required: false })
  async findAll(@Query() query: any) {
    return this.projectsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by id' })
  async findById(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user._id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project' })
  async delete(@Param('id') id: string) {
    return this.projectsService.delete(id);
  }
}
