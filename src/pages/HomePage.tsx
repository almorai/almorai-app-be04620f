import { Card, CardHeader } from "../components/ui/Card";
import { PageHeader } from "../components/layout/PageHeader";
import { brand } from "../lib/brand";

export function HomePage() {
  return (
    <>
      <PageHeader
        title={`Bienvenido a ${brand.name}`}
        description="Panel principal — el Developer personalizará esta pantalla según el plan acordado."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Elementos", value: "0" },
          { label: "Activos", value: "0" },
          { label: "Pendientes", value: "0" },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums text-text">
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Listo para personalizar"
          description="Almorai añadirá aquí las pantallas y flujos acordados en el plan."
        />
        <p className="text-sm text-muted">
          Esta base incluye layout, sidebar, componentes UI y almacenamiento local.
        </p>
      </Card>
    </>
  );
}
