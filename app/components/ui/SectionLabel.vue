<script setup lang="ts">
withDefaults(
  defineProps<{
    index: string;
    label: string;
    tone?: "light" | "dark";
    align?: "left" | "right";
  }>(),
  { tone: "light", align: "left" },
);
</script>

<template>
  <div
    class="flex items-center gap-4"
    :class="[tone === 'dark' ? 'text-ink/55' : 'text-ash', align === 'right' ? 'flex-row-reverse' : '']"
  >
    <span
      class="font-oxanium text-[10px] tracking-[0.3em]"
      :class="tone === 'dark' ? 'text-ink/45' : 'text-champagne/80'"
    >
      {{ index }}
    </span>
    <span
      class="h-px w-10"
      :class="tone === 'dark' ? 'bg-ink/20' : 'bg-bone/20'"
    />
    <span class="font-oxanium text-[10px] uppercase tracking-[0.3em]">
      {{ label }}
    </span>
  </div>
</template>
