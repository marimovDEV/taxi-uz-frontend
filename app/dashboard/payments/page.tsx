import PaymentRequests from "@/components/PaymentRequests"

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">To'lov so'rovlari</h1>
        <p className="text-muted-foreground">
          Haydovchilar tomonidan yuborilgan to'lov so'rovlarini boshqaring
        </p>
      </div>

      <PaymentRequests />
    </div>
  )
}
