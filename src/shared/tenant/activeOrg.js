let _activeOrgId = null;

export function setActiveOrgId(orgId) {
  _activeOrgId = orgId ?? null;
}

export function getActiveOrgId() {
  return _activeOrgId;
}

export function requireActiveOrgId() {
  if (!_activeOrgId) throw new Error("No hay org_id activo.");
  return _activeOrgId;
}
