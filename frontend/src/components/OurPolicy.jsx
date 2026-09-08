import React from 'react'
import { RefreshCw, ShieldCheck, Headphones } from 'lucide-react'

const OurPolicy = () => {
  return (
    <section className="container-store mt-24 py-12 border-t border-b border-border/20 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 text-center">
        {/* Policy 1 */}
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-muted rounded-full text-primary">
            <RefreshCw className="size-6 stroke-[1.5]" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-foreground uppercase">
            Easy Exchange Policy
          </h3>
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
            We offer hassle free exchange policy
          </p>
        </div>

        {/* Policy 2 */}
        <div className="flex flex-col items-center gap-3 border-t sm:border-t-0 sm:border-l sm:border-r border-border/25 pt-8 sm:pt-0">
          <div className="p-3 bg-muted rounded-full text-primary">
            <ShieldCheck className="size-6 stroke-[1.5]" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-foreground uppercase">
            7 Days Return Policy
          </h3>
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
            We provide 7 days free return policy
          </p>
        </div>

        {/* Policy 3 */}
        <div className="flex flex-col items-center gap-3 border-t sm:border-t-0 pt-8 sm:pt-0">
          <div className="p-3 bg-muted rounded-full text-primary">
            <Headphones className="size-6 stroke-[1.5]" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-foreground uppercase">
            Best Customer Support
          </h3>
          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
            We provide 24/7 customer support
          </p>
        </div>
      </div>
    </section>
  )
}

export default OurPolicy