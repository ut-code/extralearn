<script lang="ts">
  let timer = $state(0);
  let enabled = $state(false);
  $effect(() => {
    if (enabled) {
      const timerId = setInterval(() => {
        timer += 1;
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });
</script>

<div>
  timer: {timer}
</div>
<button onclick={() => (enabled = true)} disabled={enabled}> Start </button>
<button onclick={() => (enabled = false)} disabled={!enabled}> Stop </button>
