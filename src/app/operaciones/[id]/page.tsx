import { redirect } from "next/navigation";

export default function LegacyOperationPage({ params }: { params: { id: string } }) {
  redirect(`/operacion/${params.id}`);
}
