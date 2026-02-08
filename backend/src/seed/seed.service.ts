import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async createSampleData() {
    // Créer un utilisateur admin s'il n'existe pas
    const existingAdmin = await this.prisma.user.findFirst({
      where: { email: 'admin@test.com' }
    });

    if (!existingAdmin) {
      await this.prisma.user.create({
        data: {
          email: 'admin@test.com',
          passwordHash: '$2b$12$LQv3c1yqBWVHxkd0bHEbAOzGQJbqCbyb', // password123
          firstName: 'Admin',
          lastName: 'User',
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
    }

    // Créer des projets exemples
    const projects = [
      {
        name: 'Rénovation Centre Commercial',
        description: 'Rénovation complète du centre commercial avec création de nouveaux espaces',
        location: 'Paris Centre',
        status: 'ACTIVE' as const,
        budget: 150000,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
      },
      {
        name: 'Construction Entrepôt Logistique',
        description: 'Construction d\'un nouvel entrepôt de 2000m²',
        location: 'Lyon Est',
        status: 'ACTIVE' as const,
        budget: 280000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-15'),
      },
      {
        name: 'Aménagement Park Technologique',
        description: 'Aménagement d\'un parc technologique avec bureaux et espaces verts',
        location: 'Marseille',
        status: 'PLANNED' as const,
        budget: 450000,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-12-20'),
      },
    ];

    for (const project of projects) {
      await this.prisma.project.create({
        data: {
          name: project.name,
          description: project.description,
          location: project.location,
          status: project.status,
          budget: project.budget,
          startDate: project.startDate,
          endDate: project.endDate,
          createdById: 'admin@test.com', // ID de l'utilisateur admin
        },
      });
    }

    return {
      message: 'Données exemples créées avec succès',
      projectsCreated: projects.length,
    };
  }
}
