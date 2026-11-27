<template>
  <div
    class="cover-art relative isolate aspect-square w-full overflow-hidden rounded-editorial bg-[#0d0b12] shadow-[16px_22px_60px_rgba(0,0,0,.55)] ring-1 ring-bone/10"
    role="img"
    aria-label="Sampul Back to Me oleh Apostrophe, rekaman belum dirilis"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_38%,#4b3570_0%,#221a33_46%,#0b0910_82%)]"
    />
    <div class="absolute inset-[6.5%] border border-bone/15" />

    <div class="absolute inset-x-[11%] top-[10%] flex items-center justify-between">
      <img
        src="/logo/apostrophe.webp"
        alt=""
        width="40"
        height="40"
        class="h-8 w-8 rounded-full md:h-10 md:w-10"
      >
      <span class="font-oxanium text-[8px] tracking-[0.24em] text-violet/80">
        RAW RECORD
      </span>
    </div>

    <div class="absolute inset-x-[11%] bottom-[11%]">
      <div class="mb-5 h-px w-12 bg-champagne/70" />
      <span
        class="block font-display text-[clamp(2.4rem,7vw,4.6rem)] leading-[0.88] tracking-[-0.02em] text-bone"
      >
        Back<br>to Me
      </span>
      <div
        class="mt-6 flex items-center justify-between font-oxanium text-[8px] uppercase tracking-[0.24em] text-bone/55"
      >
        <span>Apostrophe</span>
        <span>Unreleased</span>
      </div>
    </div>

    <div
      class="cover-shine pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_25%,rgba(255,255,255,.12)_48%,transparent_70%)] opacity-0"
    />
  </div>
</template>
