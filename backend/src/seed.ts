import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ProjectsService } from './projects/projects.service';
import { TasksService } from './tasks/tasks.service';
import { CommentsService } from './comments/comments.service';
import { TaskStatus, Priority, AccentColor, Theme } from './common/enums';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const projectsService = app.get(ProjectsService);
  const tasksService = app.get(TasksService);
  const commentsService = app.get(CommentsService);

  // Check if seed data already exists
  const existingUsers = await usersService.findAll();
  if (existingUsers.length > 0) {
    await app.close();
    return;
  }

  const user1 = await usersService.create({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    username: 'alexjohnson',
    title: 'Senior Developer',
    isGuest: false,
    password: 'password123',
    theme: Theme.LIGHT,
    accentColor: AccentColor.BLUE,
  });

  const user2 = await usersService.create({
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    username: 'sarahchen',
    title: 'Product Designer',
    isGuest: false,
    password: 'password123',
    theme: Theme.LIGHT,
    accentColor: AccentColor.PINK,
  });

  const user3 = await usersService.create({
    name: 'Mike Wilson',
    email: 'mike@example.com',
    username: 'mikewilson',
    title: 'Project Manager',
    isGuest: false,
    password: 'password123',
    theme: Theme.DARK,
    accentColor: AccentColor.EMERALD,
  });



  const project1 = await projectsService.create(
    {
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website',
      priority: Priority.HIGH,
      lead: user2._id.toString(),
      dueDate: new Date('2026-12-31').toISOString(),
    },
    user1._id.toString(),
  );

  const project2 = await projectsService.create(
    {
      name: 'Mobile App Development',
      description: 'Build iOS and Android applications',
      priority: Priority.URGENT,
      lead: user1._id.toString(),
      dueDate: new Date('2026-11-30').toISOString(),
    },
    user3._id.toString(),
  );

  const project3 = await projectsService.create(
    {
      name: 'API Integration',
      description: 'Integrate third-party APIs',
      priority: Priority.MEDIUM,
      lead: user1._id.toString(),
      dueDate: new Date('2026-10-15').toISOString(),
    },
    user1._id.toString(),
  );



  const task1 = await tasksService.create(
    {
      title: 'Design Homepage',
      description: 'Create modern homepage design with new branding',
      status: TaskStatus.COMPLETED,
      priority: Priority.HIGH,
      projectId: project1._id.toString(),
      members: [user2._id.toString()],
      labels: ['Design', 'UI/UX'],
      dueDate: new Date('2026-09-01').toISOString(),
      reporter: user3._id.toString(),
    },
    user3._id.toString(),
  );

  const task2 = await tasksService.create(
    {
      title: 'Develop Login Feature',
      description: 'Implement secure authentication system',
      status: TaskStatus.DOING,
      priority: Priority.URGENT,
      projectId: project2._id.toString(),
      members: [user1._id.toString()],
      labels: ['Backend', 'Security'],
      dueDate: new Date('2026-09-15').toISOString(),
      reporter: user3._id.toString(),
    },
    user1._id.toString(),
  );

  const task3 = await tasksService.create(
    {
      title: 'Test Payment Gateway',
      description: 'Integration testing for payment processing',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      projectId: project2._id.toString(),
      members: [user1._id.toString(), user2._id.toString()],
      labels: ['Testing', 'Finance'],
      dueDate: new Date('2026-09-20').toISOString(),
      reporter: user3._id.toString(),
    },
    user3._id.toString(),
  );

  const task4 = await tasksService.create(
    {
      title: 'Write API Documentation',
      description: 'Document all API endpoints and responses',
      status: TaskStatus.DOING,
      priority: Priority.MEDIUM,
      projectId: project3._id.toString(),
      members: [user1._id.toString()],
      labels: ['Documentation'],
      dueDate: new Date('2026-09-10').toISOString(),
      reporter: user1._id.toString(),
    },
    user1._id.toString(),
  );

  const task5 = await tasksService.create(
    {
      title: 'Implement Search Function',
      description: 'Add advanced search capabilities',
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      projectId: project1._id.toString(),
      members: [user1._id.toString()],
      labels: ['Frontend', 'Feature'],
      dueDate: new Date('2026-09-25').toISOString(),
      reporter: user2._id.toString(),
    },
    user2._id.toString(),
  );

  const task6 = await tasksService.create(
    {
      title: 'Code Review Completed',
      description: 'Review and approve pull requests',
      status: TaskStatus.COMPLETED,
      priority: Priority.LOW,
      projectId: project3._id.toString(),
      members: [user1._id.toString()],
      labels: ['Code Review'],
      dueDate: new Date('2026-08-25').toISOString(),
      reporter: user1._id.toString(),
    },
    user1._id.toString(),
  );

  const task7 = await tasksService.create(
    {
      title: 'Design Mockups Finalized',
      description: 'Finalize all design mockups for approval',
      status: TaskStatus.ON_HOLD,
      priority: Priority.HIGH,
      projectId: project1._id.toString(),
      members: [user2._id.toString()],
      labels: ['Design', 'UI/UX'],
      dueDate: new Date('2026-09-05').toISOString(),
      reporter: user3._id.toString(),
    },
    user2._id.toString(),
  );

  const task8 = await tasksService.create(
    {
      title: 'Deploy to Production',
      description: 'Deploy application to production environment',
      status: TaskStatus.TODO,
      priority: Priority.URGENT,
      projectId: project2._id.toString(),
      members: [user1._id.toString(), user3._id.toString()],
      labels: ['DevOps', 'Deployment'],
      dueDate: new Date('2026-10-01').toISOString(),
      reporter: user3._id.toString(),
    },
    user3._id.toString(),
  );



  await tasksService.createSubtask(task2._id.toString(), {
    title: 'Setup JWT authentication',
    priority: Priority.HIGH,
  });

  await tasksService.createSubtask(task2._id.toString(), {
    title: 'Create login form',
    priority: Priority.HIGH,
  });

  await tasksService.createSubtask(task2._id.toString(), {
    title: 'Implement password reset',
    priority: Priority.MEDIUM,
  });

  await tasksService.createSubtask(task3._id.toString(), {
    title: 'Test credit card payments',
    priority: Priority.URGENT,
  });

  await tasksService.createSubtask(task3._id.toString(), {
    title: 'Test PayPal integration',
    priority: Priority.HIGH,
  });



  await commentsService.create(task1._id.toString(), { message: 'Great work on the homepage design!' }, user3._id.toString());
  await commentsService.create(task1._id.toString(), { message: 'Thanks! Let me know if you need any changes.' }, user2._id.toString());
  await commentsService.create(task2._id.toString(), { message: 'Authentication is working well. Need to add refresh tokens.' }, user1._id.toString());
  await commentsService.create(task5._id.toString(), { message: 'Should we use Elasticsearch or simple text search?' }, user2._id.toString());
  await commentsService.create(task5._id.toString(), { message: 'Let\'s start with simple search and optimize later.' }, user1._id.toString());




  await app.close();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
