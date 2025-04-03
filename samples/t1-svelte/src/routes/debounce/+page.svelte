<script lang="ts">
  let input = $state("");
  let debounced = $state("");

  $effect(() => {
    input;
    const id = setTimeout(() => {
      debounced = input;
    }, 500);
    return () => clearTimeout(id);
  });
</script>

<span>debounced value: {debounced}</span>
<input bind:value={input} />
