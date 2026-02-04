import MainLayout from '@/components/layout/MainLayout';
import ProjectCreateWizard from '@/modules/projects/ProjectCreateWizard';

export default function ProjectNewPage() {
  return (
    <MainLayout>
      <ProjectCreateWizard />
    </MainLayout>
  );
}
