import { useState, useMemo } from "react";
import { Calculator, DollarSign, Percent, ShieldCheck, PieChart as PieIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/format";

export function MortgageCalculator({
  propertyPrice = 3850000,
  defaultHoa = 650,
}: {
  propertyPrice?: number;
  defaultHoa?: number;
}) {
  const [price, setPrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.25);
  const [loanTermYears, setLoanTermYears] = useState<15 | 30>(30);
  const [annualPropertyTaxPercent, setAnnualPropertyTaxPercent] = useState(1.2);
  const [annualInsurance, setAnnualInsurance] = useState(Math.round(propertyPrice * 0.0035));
  const [hoaFee, setHoaFee] = useState(defaultHoa);

  const calculations = useMemo(() => {
    const downPaymentAmount = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPaymentAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const totalPayments = loanTermYears * 12;

    let monthlyPrincipalInterest = 0;
    if (monthlyInterestRate > 0 && totalPayments > 0) {
      monthlyPrincipalInterest =
        (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments))) /
        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
    } else {
      monthlyPrincipalInterest = loanAmount / totalPayments;
    }

    const monthlyPropertyTax = (price * (annualPropertyTaxPercent / 100)) / 12;
    const monthlyInsurance = annualInsurance / 12;
    const totalMonthly = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance + hoaFee;

    return {
      downPaymentAmount,
      loanAmount,
      monthlyPrincipalInterest: Math.round(monthlyPrincipalInterest),
      monthlyPropertyTax: Math.round(monthlyPropertyTax),
      monthlyInsurance: Math.round(monthlyInsurance),
      hoaFee: Math.round(hoaFee),
      totalMonthly: Math.round(totalMonthly),
      piShare: totalMonthly > 0 ? (monthlyPrincipalInterest / totalMonthly) * 100 : 0,
      taxShare: totalMonthly > 0 ? (monthlyPropertyTax / totalMonthly) * 100 : 0,
      insShare: totalMonthly > 0 ? (monthlyInsurance / totalMonthly) * 100 : 0,
      hoaShare: totalMonthly > 0 ? (hoaFee / totalMonthly) * 100 : 0,
    };
  }, [price, downPaymentPercent, interestRate, loanTermYears, annualPropertyTaxPercent, annualInsurance, hoaFee]);

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-lg sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-accent">
            <Calculator className="size-5" aria-hidden="true" />
            <span className="eyebrow text-xs font-bold text-accent">Financial Planning</span>
          </div>
          <h3 className="mt-1 font-display text-2xl font-semibold text-foreground">
            Luxury Mortgage & Carrying Cost Calculator
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase tracking-wider text-muted-foreground block">
            Estimated Total Monthly
          </span>
          <span className="numeral text-3xl font-bold text-accent">
            {formatPrice(calculations.totalMonthly)}
            <span className="text-xs text-muted-foreground font-normal"> /mo</span>
          </span>
        </div>
      </div>

      {/* Visual Bar Breakdown */}
      <div className="space-y-2">
        <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            style={{ width: `${calculations.piShare}%` }}
            className="bg-accent transition-all duration-300"
            title={`Principal & Interest: ${formatPrice(calculations.monthlyPrincipalInterest)}`}
          />
          <div
            style={{ width: `${calculations.taxShare}%` }}
            className="bg-slate-700 transition-all duration-300"
            title={`Property Tax: ${formatPrice(calculations.monthlyPropertyTax)}`}
          />
          <div
            style={{ width: `${calculations.insShare}%` }}
            className="bg-amber-600 transition-all duration-300"
            title={`Home Insurance: ${formatPrice(calculations.monthlyInsurance)}`}
          />
          <div
            style={{ width: `${calculations.hoaShare}%` }}
            className="bg-emerald-600 transition-all duration-300"
            title={`HOA Dues: ${formatPrice(calculations.hoaFee)}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 text-xs sm:grid-cols-4">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-accent" />
            <div>
              <p className="text-muted-foreground">Principal & Int.</p>
              <p className="font-semibold text-foreground">{formatPrice(calculations.monthlyPrincipalInterest)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-slate-700" />
            <div>
              <p className="text-muted-foreground">Property Taxes</p>
              <p className="font-semibold text-foreground">{formatPrice(calculations.monthlyPropertyTax)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-amber-600" />
            <div>
              <p className="text-muted-foreground">Insurance</p>
              <p className="font-semibold text-foreground">{formatPrice(calculations.monthlyInsurance)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-emerald-600" />
            <div>
              <p className="text-muted-foreground">HOA / Dues</p>
              <p className="font-semibold text-foreground">{formatPrice(calculations.hoaFee)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sliders and Inputs */}
      <div className="grid gap-6 sm:grid-cols-2 pt-4">
        {/* Home Price */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Label htmlFor="mortgage-price">Purchase Price</Label>
            <span className="font-semibold text-foreground">{formatPrice(price)}</span>
          </div>
          <Slider
            id="mortgage-price"
            value={[price]}
            min={500000}
            max={25000000}
            step={50000}
            onValueChange={([val]) => setPrice(val ?? price)}
          />
        </div>

        {/* Down Payment */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Label htmlFor="mortgage-down">Down Payment ({downPaymentPercent}%)</Label>
            <span className="font-semibold text-foreground">{formatPrice(calculations.downPaymentAmount)}</span>
          </div>
          <Slider
            id="mortgage-down"
            value={[downPaymentPercent]}
            min={10}
            max={70}
            step={5}
            onValueChange={([val]) => setDownPaymentPercent(val ?? downPaymentPercent)}
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Label htmlFor="mortgage-rate">Interest Rate</Label>
            <span className="font-semibold text-foreground">{interestRate.toFixed(2)}%</span>
          </div>
          <Slider
            id="mortgage-rate"
            value={[interestRate * 100]}
            min={300}
            max={1000}
            step={12.5}
            onValueChange={([val]) => setInterestRate((val ?? 625) / 100)}
          />
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label className="text-sm">Loan Term</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLoanTermYears(30)}
              className={`rounded-md border py-2 text-sm font-semibold transition-colors ${
                loanTermYears === 30
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              30-Year Fixed
            </button>
            <button
              type="button"
              onClick={() => setLoanTermYears(15)}
              className={`rounded-md border py-2 text-sm font-semibold transition-colors ${
                loanTermYears === 15
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              15-Year Fixed
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-muted/40 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
        <ShieldCheck className="size-4 shrink-0 text-accent mt-0.5" />
        <p>
          * Estimates provided for illustrative luxury advisory purposes. Actual rates, jumbo loan requirements, and private banking terms subject to underwriting by lender. Sharif Realty partners with premier private wealth lenders for bespoke financing solutions.
        </p>
      </div>
    </div>
  );
}
