import { notFound } from "next/navigation";
import { ActionForm, ConfirmForm } from "@/components/ui/action-form";
import { PageHeader, Panel } from "@/components/ui/layout";
import { ApiError, api } from "@/lib/api";
import type { Course } from "@/lib/types";
import { deleteCourse, updateCourse } from "../actions";
import { CourseFields } from "../course-fields";

export default async function CoursePage({
  params,
}: PageProps<"/cursos/[id]">) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const course = await api
    .get<Course>(`/admin/courses/${id}`)
    .catch((e: unknown) => {
      if (e instanceof ApiError && e.status === 404) notFound();
      throw e;
    });

  return (
    <>
      <PageHeader
        eyebrow={`e-MEC ${course.id}`}
        title={course.name}
      />
      <div className="grid max-w-2xl gap-6">
        <Panel title="Dados">
          <ActionForm action={updateCourse.bind(null, id)}>
            <CourseFields value={course} />
          </ActionForm>
        </Panel>
        <Panel title="Zona de perigo">
          <ConfirmForm action={deleteCourse.bind(null, id)} />
        </Panel>
      </div>
    </>
  );
}
