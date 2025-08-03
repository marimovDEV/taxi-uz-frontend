import PaymentRequests from "@/components/PaymentRequests"

export default function PaymentsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="mobile-title font-bold tracking-tight">To'lov so'rovlari</h1>
        <p className="mobile-text text-muted-foreground">
          Haydovchilar tomonidan yuborilgan to'lov so'rovlarini boshqaring
        </p>
      </div>

      <PaymentRequests />
    </div>
  )
}
