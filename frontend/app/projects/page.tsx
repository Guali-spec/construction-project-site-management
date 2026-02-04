import MainLayout from '@/components/layout/MainLayout';
import ProjectsList from '@/modules/projects/ProjectsList';

export default function ProjectsPage() {
  return (
    <MainLayout>
      <ProjectsList />
    </MainLayout>
  );
}