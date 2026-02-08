import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis() {
    // Récupérer les vraies données depuis la base
    const [totalProjects, activeProjects, budgetData] = await Promise.all([
      this.prisma.project.count({ where: { deletedAt: null } }),
      this.prisma.project.count({ where: { status: 'ACTIVE', deletedAt: null } }),
      this.prisma.project.aggregate({
        where: { deletedAt: null },
        _sum: { budget: true }
      })
    ]);

    // Calculer les retards (projets en retard)
    const delayedProjects = await this.prisma.project.count({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: new Date()
        },
        deletedAt: null
      }
    });

    return {
      chantiersActifs: activeProjects,
      budgetGlobal: budgetData._sum.budget || 0,
      avancementMoyen: 65, // Calculer depuis les tâches plus tard
      retards: delayedProjects
    };
  }

  async getProgression() {
    // Récupérer les vrais projets pour la progression
    const projects = await this.prisma.project.findMany({
      where: { deletedAt: null },
      select: {
        name: true,
        status: true,
        createdAt: true,
        endDate: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Calculer la progression par mois
    const monthlyProgress = projects.reduce((acc, project) => {
      const month = project.createdAt.toISOString().slice(0, 7);
      if (!acc[month]) acc[month] = 0;
      acc[month] += project.status === 'ACTIVE' ? 1 : 0;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(monthlyProgress),
      datasets: [{
        label: 'Projets créés par mois',
        data: Object.values(monthlyProgress),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      }]
    };
  }

  async getCostRepartition() {
    // Simuler la répartition des coûts (à améliorer avec de vraies données)
    return {
      labels: ['Main d\'œuvre', 'Matériaux', 'Équipement', 'Sous-traitants', 'Autres'],
      datasets: [{
        label: 'Répartition des coûts (€)',
        data: [45000, 32000, 18000, 12000, 8000],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ]
      }]
    };
  }
}
