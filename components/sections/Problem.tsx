import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";

const leaks = [
  {
    code: "LEAK_01",
    title: "Geç yanıt",
    body: "Gelen mesaja saatler sonra dönülüyor. O sırada aday rakibe yazdı ve karar verdi bile.",
  },
  {
    code: "LEAK_02",
    title: "Kayıt yok",
    body: "Adaylar DM'de, WhatsApp'ta, not defterinde dağınık. Kimin nerede kaldığını kimse bilmiyor.",
  },
  {
    code: "LEAK_03",
    title: "Takip yok",
    body: "İlk görüşmede satın almayan herkes kayıp sayılıyor. Oysa satışların çoğu takipte gelir.",
  },
  {
    code: "LEAK_04",
    title: "Körlük",
    body: "Hangi reklam müşteri getirdi, hangisi para yaktı belli değil. Bütçe hisle yönetiliyor.",
  },
];

export default function Problem() {
  return (
    <section id="problem" className="section">
      <div className="container-x">
        <SectionHeading
          eyebrow="Problem"
          title={
            <>
              Reklamınız çalışıyor.
              <br className="hidden sm:block" /> Sisteminiz çalışmıyor.
            </>
          }
          lead="Sorun çoğu zaman reklam değil. Reklam ilgi getiriyor; ama o ilgi, müşteriye dönmeden yolda kayboluyor. İşte paranın sızdığı dört nokta:"
        />

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {leaks.map((leak, i) => (
            <Reveal key={leak.code} delay={i * 0.06}>
              <div className="group h-full bg-white p-6 transition-colors hover:bg-surface/50 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] tracking-label text-copper">
                    {leak.code}
                  </span>
                  <span className="h-px flex-1 bg-line" />
                </div>
                <h3 className="h3 mt-4">{leak.title}</h3>
                <p className="prose-body mt-3 text-[0.95rem]">{leak.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            Her sızıntı, ödediğiniz reklam bütçesinin bir kısmını çöpe atıyor.
            Çözüm daha fazla reklam değil —{" "}
            <strong className="font-semibold text-ink">
              akan suyu tutan bir sistem.
            </strong>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
