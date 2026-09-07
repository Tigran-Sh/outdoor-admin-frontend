import { Navigate, useParams } from "react-router-dom";

/**
 * There is no working admin-edit endpoint: `PATCH /api/v1/admin/clubs/{id}/`
 * accepts the request but every field is read-only, so it would silently
 * discard any changes. Only the club's own owner can edit its profile
 * (`PATCH /api/v1/club/`), so redirect here to the read-only admin view
 * instead of presenting a form that looks like it saves but doesn't.
 */
function EditClubPage() {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={id ? `/admin/clubs/${id}` : "/admin/clubs"} replace />;
}

export default EditClubPage;
