<template>
  <section
    id="home-section"
    :style="{
      backgroundImage: `url(/images/hero.webp)`,
    }"
    class="w-full h-[768px] relative inset-0 z-10 bg-no-repeat bg-cover bg-top transition-all duration-250 ease-in-out aspect-square"
  >
    <div
      class="absolute inset-0 z-5 bg-linear-to-t from-zinc-950 to-transparent"
    />
    <div
      class="relative w-full max-w-[1366px] flex mx-auto px-6 md:px-8 h-full pb-24 pt-48 items-end justify-start z-10"
    >
      <div
        class="flex flex-col items-start justify-center space-y-4 md:space-y-6"
      >
        <SocialMediaLinks />
        <h1 class="text-[3.5rem] md:text-[5rem] font-bold md:leading-24">
          We are <br />
          Apostrophe
        </h1>
        <a
          class="border px-10 mt-2 py-4 flex items-center gap-3 text-lg hover:bg-zinc-100 hover:text-zinc-950 duration-300 transition-all cursor-pointer"
          href="https://wa.me/6287802784601?text=Halo%20apostrophe%2C%20aku%20pengen%20tanya%20tanya%20nih"
          target="_blank"
          rel="external noreferrer"
        >
          <Icon class="text-3xl" name="ic:baseline-whatsapp" />
          <span>Hubungi Kami</span>
        </a>
      </div>
    </div>
  </section>
</template>
