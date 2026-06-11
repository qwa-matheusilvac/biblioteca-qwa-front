import { MembroFormPage } from '@/features/membros/components/MembroFormPage';

interface EditarMembroPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarMembroPage({ params }: EditarMembroPageProps) {
  const { id } = await params;

  return <MembroFormPage mode="edit" membroId={Number(id)} />;
}
