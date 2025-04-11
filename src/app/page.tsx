
import MultiIngredientConverter from '@/components/converter';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-4 pt-16 pb-16 md:p-24">
      <MultiIngredientConverter />
    </main>
  );
}