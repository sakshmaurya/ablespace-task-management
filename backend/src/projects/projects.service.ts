import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const createdProject = new this.projectModel({
      ...createProjectDto,
      createdBy: new Types.ObjectId(userId),
      lead: createProjectDto.lead ? new Types.ObjectId(createProjectDto.lead) : undefined,
    });
    return createdProject.save();
  }

  async findAll(query: any = {}): Promise<Project[]> {
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    return this.projectModel
      .find(filter)
      .populate('lead')
      .populate('createdBy')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectModel
      .findById(id)
      .populate('lead')
      .populate('createdBy')
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    if (updateProjectDto.lead) {
      updateProjectDto.lead = new Types.ObjectId(updateProjectDto.lead) as any;
    }

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .populate('lead')
      .populate('createdBy')
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }
    return updatedProject;
  }

  async delete(id: string): Promise<Project> {
    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deletedProject) {
      throw new NotFoundException('Project not found');
    }
    return deletedProject;
  }
}
