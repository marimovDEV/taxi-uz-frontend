import DetailedStatistics from "@/components/DetailedStatistics"

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Batafsil statistika</h1>
        <p className="text-muted-foreground">
          Tizimning batafsil statistikasi va tahlili
        </p>
      </div>

      <DetailedStatistics />
    </div>
  )
}
