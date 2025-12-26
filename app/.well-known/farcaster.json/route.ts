import { minikitConfig } from "../../../minikit.config";

function withValidProperties(properties: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (value === undefined || value === null) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.length > 0;
      return true;
    })
  );
}

export async function GET() {
  const manifest = {
    accountAssociation: minikitConfig.accountAssociation,
    miniapp: withValidProperties(minikitConfig.miniapp as Record<string, any>),
  };
  return Response.json(manifest);
}