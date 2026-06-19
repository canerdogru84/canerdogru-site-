import Reveal from "../Reveal";
import SectionHeading from "../SectionHeading";
import PipelineFlow from "../PipelineFlow";
import { IconChat, IconChart, IconTarget, IconSpark } from "../icons";

const benefits = [
  {
    Icon: IconChat,
    title: "Kaçan lead'i yakala",
    body: "Gelen her mesaj saniyeler içinde karşılanır; kimse cevapsız kalıp rakibe gitmez.",
  },
  {
    Icon: IconChart,
    title: "Tahmin edilebilir akış",
    body: "Bir ay dolu bir ay boş değil; düzenli, sistemli müşteri akışı.",
  },
  {
    Icon: IconTarget,
    title: "Boşa giden bütçe biter",
    body: "Hangi reklamın müşteri getirdiğini görür, parayı hisle değil veriyle harcarsın.",
  },
  {
    Icon: IconSpark,
    title: "Sen sadece satışa odaklan",
    body: "Sistem ısıtır, niteler, randevu açar; sen sadece konuşursun.",
  },
];

export default function SystemFlow() {
  return (
    <section id="sistem" className="section relative overflow-hidden bg-white">
      <div className="bp-grid bp-grid-fade pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">
        <SectionHeading
          eyebrow="Çözüm Akışı"
          title="Tek bir bağlantılı sistem"
          lead="Parçalar tek tek iş görmez; değer aralarındaki bağlantıda. Reklam talebi getirir, YZ temsilcisi anında karşılar, CRM kaydeder, takip akışı kaçanı geri kazanır. Hiçbir aday boşluğa düşmez."
        />

        <Reveal y={28}>
          <div className="mt-14">
            <PipelineFlow />
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
            {[
              { stat: "< 60 sn", label: "İlk yanıt süresi hedefi" },
              { stat: "7/24", label: "Kesintisiz aday karşılama" },
              { stat: "0", label: "Kayıt dışı kalan aday" },
            ].map((m) => (
              <div key={m.label}>
                <p className="font-display text-3xl font-extrabold tracking-tight text-ink">
                  {m.stat}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-label text-muted">
                  {m.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Fayda şeridi — mekanizmayı müşteri-sonucuna bağlar */}
        <div className="mt-20">
          <Reveal>
            <p className="eyebrow">Bu sana ne kazandırır?</p>
            <h3 className="h3 mt-3 max-w-xl !text-[1.5rem] sm:!text-[1.75rem]">
              Sistem teknik değil, sonuç odaklıdır
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => {
              const { Icon } = b;
              return (
                <Reveal key={b.title} delay={(i % 4) * 0.06}>
                  <div className="bp-card h-full p-6">
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-signal/10 text-signal">
                      <Icon className="h-[22px] w-[22px]" />
                    </span>
                    <h4 className="mt-5 font-display text-[1.05rem] font-semibold text-ink">
                      {b.title}
                    </h4>
                    <p className="prose-body mt-2 text-[0.92rem]">{b.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
