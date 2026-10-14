/**
 * Türkiye telefonunu E.164'e çevirir: "05XX XXX XX XX" → "+905XXXXXXXXX".
 * cal.com telefon alanı (smsReminderNumber) ülke kodunu numaradan okur; "+90" ile
 * verilmezse tarayıcı/IP tahminine düşüyor ve Almanya (+49) açılıyordu (14 Eki 2026).
 * Form ve webhook aynı fonksiyonu kullanır ki Supabase'e tek biçim yazılsın.
 */
export function e164TR(ham: string): string {
  const d = String(ham || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("90") && d.length === 12) return "+" + d;
  if (d.startsWith("0") && d.length === 11) return "+90" + d.slice(1);
  if (d.startsWith("5") && d.length === 10) return "+90" + d;
  // Yabancı ya da tanınmayan biçim: olduğu gibi + ile
  return String(ham).trim().startsWith("+") ? "+" + d : d;
}
