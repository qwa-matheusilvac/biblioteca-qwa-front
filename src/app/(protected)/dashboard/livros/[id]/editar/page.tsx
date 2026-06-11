import { LivroFormPage } from '@/features/livros/components/LivroFormPage';

interface EditarLivroPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarLivroPage({ params }: EditarLivroPageProps) {
  const { id } = await params;

  return <LivroFormPage mode="edit" livroId={Number(id)} />;
}
