import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getExpenses() {
    // Pour l'instant, simulons des dépenses car la table n'existe pas encore
    const expenses = [
      {
        id: '1',
        description: 'Achat de matériaux - Ciment',
        amount: 2500,
        date: new Date('2024-01-15'),
        category: 'MATERIAUX',
        projectId: '1',
        projectName: 'Rénovation Centre Commercial',
        status: 'VALIDATED',
      },
      {
        id: '2',
        description: 'Salaires ouvriers - Janvier',
        amount: 15000,
        date: new Date('2024-01-31'),
        category: 'PERSONNEL',
        projectId: '1',
        projectName: 'Rénovation Centre Commercial',
        status: 'VALIDATED',
      },
      {
        id: '3',
        description: 'Location engins de chantier',
        amount: 3500,
        date: new Date('2024-02-01'),
        category: 'EQUIPEMENT',
        projectId: '2',
        projectName: 'Construction Entrepôt Logistique',
        status: 'PENDING',
      },
    ];

    return expenses;
  }

  async getExpense(id: string) {
    const expenses = await this.getExpenses();
    const expense = expenses.find(e => e.id === id);
    
    if (!expense) {
      throw new Error('Expense not found');
    }
    
    return expense;
  }

  async createExpense(createExpenseDto: any) {
    // Simulation - à implémenter avec vraie DB
    return {
      id: 'new-expense-id',
      ...createExpenseDto,
      status: 'PENDING',
      createdAt: new Date(),
    };
  }

  async updateExpense(id: string, updateExpenseDto: any) {
    // Simulation - à implémenter avec vraie DB
    return {
      id,
      ...updateExpenseDto,
      updatedAt: new Date(),
    };
  }

  async deleteExpense(id: string) {
    // Simulation - à implémenter avec vraie DB
    return { message: 'Expense deleted successfully', id };
  }

  async getBudgets() {
    const projects = await this.prisma.project.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        budget: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    });

    return projects.map(project => ({
      id: project.id,
      projectName: project.name,
      totalBudget: Number(project.budget || 0),
      spentBudget: Math.floor(Number(project.budget || 0) * 0.65), // Simulation 65% dépensé
      remainingBudget: Math.floor(Number(project.budget || 0) * 0.35),
      progress: 65,
      status: project.status,
    }));
  }

  async getFinanceStats() {
    const [totalBudget, projects] = await Promise.all([
      this.prisma.project.aggregate({
        where: { deletedAt: null },
        _sum: { budget: true },
      }),
      this.prisma.project.findMany({
        where: { deletedAt: null },
        select: { budget: true },
      }),
    ]);

    const totalBudgetAmount = Number(totalBudget._sum.budget || 0);
    const spentBudget = Math.floor(totalBudgetAmount * 0.65); // Simulation
    const remainingBudget = Math.floor(totalBudgetAmount * 0.35);

    return {
      totalBudget: totalBudgetAmount,
      spentBudget,
      remainingBudget,
      budgetUtilization: 65,
      totalExpenses: spentBudget,
      pendingExpenses: 3500, // Simulation
      validatedExpenses: spentBudget - 3500,
    };
  }

  async getCostRepartition() {
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
