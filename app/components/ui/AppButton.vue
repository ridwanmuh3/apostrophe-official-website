<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string;
    href?: string;
    variant?: "outline" | "solid";
    cursor?: string;
    type?: "button" | "submit" | "reset";
  }>(),
  { variant: "outline", type: "button", to: undefined, href: undefined, cursor: undefined },
);

const tag = computed(() =>
  props.to ? resolveComponent("NuxtLink") : props.href ? "a" : "button",
);

const attrs = computed(() =>
  props.to
    ? { to: props.to }
    : props.href
      ? { href: props.href }
      : { type: props.type },
);
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    :data-cursor="cursor"
    class="group relative inline-flex items-center justify-center overflow-hidden rounded-editorial border px-7 py-4 font-oxanium text-[10px] uppercase tracking-[0.24em] transition-colors duration-500"
    :class="
      variant === 'solid'
        ? 'border-bone bg-bone text-ink hover:text-bone'
        : 'border-champagne/40 text-bone hover:text-ink'
    "
  >
    <span
      aria-hidden="true"
      class="absolute inset-0 translate-y-full transition-transform duration-500 ease-editorial group-hover:translate-y-0"
      :class="variant === 'solid' ? 'bg-ink' : 'bg-bone'"
    />
    <span class="relative z-10 flex items-center gap-3">
      <slot />
    </span>
  </component>
</template>
