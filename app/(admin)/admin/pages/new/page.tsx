import { AdminShell } from "@/components/admin/admin-shell";
import { PageEditor } from "@/components/admin/page-editor";

export default function NewPagePage() {
  return (
    <AdminShell title="New page">
      <PageEditor />
    </AdminShell>
  );
}
