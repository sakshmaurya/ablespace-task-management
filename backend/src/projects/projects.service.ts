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
      createdBy: createProjectDto.createdById ? new Types.ObjectId(createProjectDto.createdById) : new Types.ObjectId(userId),
      lead: createProjectDto.leadId ? new Types.ObjectId(createProjectDto.leadId) : undefined,
    });
    return createdProject.save();
  }

  async findAll(query: any = {}, userId: string): Promise<Project[]> {
    const filter: any = {};

    // CRITICAL: Only return projects where user is creator or lead
    const userAccessFilter = {
      $or: [
        { createdBy: new Types.ObjectId(userId) },
        { lead: new Types.ObjectId(userId) },
      ],
    };

    if (query.search) {
      filter.$and = [
        userAccessFilter,
        {
          $or: [
            { name: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } },
          ],
        },
      ];
    } else {
      Object.assign(filter, userAccessFilter);
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

  async findById(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel
      .findById(id)
      .populate('lead')
      .populate('createdBy')
      .exec();

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // CRITICAL: Check if user has access to this project
    const userObjectId = new Types.ObjectId(userId);
    const hasAccess =
      project.createdBy && project.createdBy._id.equals(userObjectId) ||
      project.lead && project.lead._id.equals(userObjectId);

    if (!hasAccess) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    // Check authorization first
    await this.findById(id, userId);

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

  async delete(id: string, userId: string): Promise<Project> {
    // Check authorization first
    await this.findById(id, userId);

    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deletedProject) {
      throw new NotFoundException('Project not found');
    }
    return deletedProject;
  }
}
