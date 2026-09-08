import { notFound } from "next/navigation";
import { designs } from "../data";
import DesignStudy from "../DesignStudy";

export function generateStaticParams() {
  return designs.map(design => ({ design: design.id }));
}

export default async function DesignPage({ params }: { params: Promise<{ design: string }> }) {
  const { design: id } = await params;
  const design = designs.find(item => item.id === id);
  if (!design) notFound();
  return <DesignStudy key={design.id} design={design.id} />;
}
