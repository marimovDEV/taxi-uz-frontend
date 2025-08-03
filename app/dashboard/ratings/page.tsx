import DriverRatings from "@/components/DriverRatings"

export default function RatingsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mobile-title font-bold tracking-tight">Haydovchilar reytingi ⭐️</h1>
        <p className="mobile-text text-muted-foreground">
          Haydovchilar reytingi va faolligi
        </p>
      </div>

      <DriverRatings />
    </div>
  )
}
