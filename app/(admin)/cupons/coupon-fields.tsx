import { Field, Input, Select } from "@/components/ui/fields";
import type { Coupon } from "@/lib/types";

export function CouponFields({ coupon }: { coupon?: Coupon }) {
  const isFixed = coupon?.discountType === "fixed_cents";
  const fixedReais = isFixed ? (coupon.discountValue / 100).toFixed(2) : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Código do cupom" hint="Letras e números (será convertido para maiúsculas)">
          <Input
            name="code"
            defaultValue={coupon?.code ?? ""}
            required
            placeholder="PROMO20, VIPFREE, GABRIEL15"
            className="uppercase font-mono tracking-wider font-semibold"
          />
        </Field>

        <Field label="Tipo de cupom">
          <Select
            name="kind"
            defaultValue={coupon?.kind ?? "campaign"}
            options={[
              { value: "campaign", label: "Campanha Promocional" },
              { value: "influencer", label: "Influenciador / Afiliado" },
              { value: "special", label: "Especial / VIP" },
              { value: "support", label: "Suporte ao Cliente" },
            ]}
          />
        </Field>
      </div>

      <Field label="Descrição interna" hint="Objetivo ou contexto deste cupom">
        <Input
          name="description"
          defaultValue={coupon?.description ?? ""}
          placeholder="Ex: Parceria com influencer no Instagram - Lançamento"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Tipo de desconto">
          <Select
            name="discountType"
            defaultValue={coupon?.discountType ?? "percentage"}
            options={[
              { value: "percentage", label: "Percentual (%)" },
              { value: "fixed_cents", label: "Valor Fixo (R$)" },
              { value: "vip_free", label: "100% Grátis (VIP Free)" },
            ]}
          />
        </Field>

        <Field label="Valor percentual (%)" hint="Usado se for Percentual">
          <Input
            type="number"
            name="discountValue"
            min="0"
            max="100"
            defaultValue={!isFixed && coupon?.discountValue ? coupon.discountValue : 10}
            placeholder="Ex: 15 para 15%"
          />
        </Field>

        <Field label="Valor fixo em R$" hint="Usado se for Valor Fixo">
          <Input
            type="number"
            step="0.01"
            name="discountValueReais"
            min="0"
            defaultValue={fixedReais}
            placeholder="Ex: 10.00"
          />
        </Field>
      </div>

      <div className="border-t border-line-subtle pt-4">
        <h3 className="text-sm font-bold text-strong mb-3">Dados do Influenciador (opcional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Nome do Influenciador">
            <Input
              name="influencerName"
              defaultValue={coupon?.influencerName ?? ""}
              placeholder="Ex: Gabriel Mentor"
            />
          </Field>
          <Field label="E-mail de contato">
            <Input
              type="email"
              name="influencerEmail"
              defaultValue={coupon?.influencerEmail ?? ""}
              placeholder="gabriel@email.com"
            />
          </Field>
          <Field label="Perfil social / @">
            <Input
              name="influencerSocial"
              defaultValue={coupon?.influencerSocial ?? ""}
              placeholder="instagram.com/gabriel"
            />
          </Field>
        </div>

        <div className="mt-3 max-w-xs">
          <Field label="Comissão do Influenciador (%)" hint="Percentual sobre o valor líquido pago">
            <Input
              type="number"
              name="commissionPct"
              min="0"
              max="100"
              defaultValue={coupon?.commissionPct ?? 0}
              placeholder="Ex: 15 para 15%"
            />
          </Field>
        </div>
      </div>

      <div className="border-t border-line-subtle pt-4">
        <h3 className="text-sm font-bold text-strong mb-3">Limites e Validade</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Limite de utilizações" hint="Deixe em branco para ilimitado">
            <Input
              type="number"
              name="maxUses"
              min="1"
              defaultValue={coupon?.maxUses ?? ""}
              placeholder="Ilimitado"
            />
          </Field>

          <Field label="Início da validade">
            <Input
              type="datetime-local"
              name="startsAt"
              defaultValue={coupon?.startsAt ? coupon.startsAt.slice(0, 16) : ""}
            />
          </Field>

          <Field label="Expira em">
            <Input
              type="datetime-local"
              name="expiresAt"
              defaultValue={coupon?.expiresAt ? coupon.expiresAt.slice(0, 16) : ""}
            />
          </Field>
        </div>
      </div>

      <div className="border-t border-line-subtle pt-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-strong">
          <input
            type="checkbox"
            name="active"
            defaultChecked={coupon ? coupon.active : true}
            className="w-4 h-4 rounded text-brand focus:ring-brand"
          />
          <span>Cupom ativo para uso no checkout</span>
        </label>
      </div>
    </div>
  );
}
