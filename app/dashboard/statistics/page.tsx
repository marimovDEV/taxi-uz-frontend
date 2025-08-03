import DetailedStatistics from "@/components/DetailedStatistics"

export default function StatisticsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mobile-title font-bold tracking-tight">Batafsil statistika 📊</h1>
        <p className="mobile-text text-muted-foreground">
          Tizimning batafsil statistikasi va tahlili
        </p>
      </div>

      <DetailedStatistics />
    </div>
  )
}
