import DriverRatings from "@/components/DriverRatings"

export default function RatingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Haydovchilar reytingi</h1>
        <p className="text-muted-foreground">
          Haydovchilar reytingi va faolligi
        </p>
      </div>

      <DriverRatings />
    </div>
  )
}
