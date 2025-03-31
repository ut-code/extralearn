<script lang="ts">
  let timer = $state(0);
  setInterval(() => {
    timer += 1;
  }, 100);

  const seconds = $derived(timer % 60);
  const minutes = $derived(Math.floor((timer / 60) % 60));
  const hours = $derived(Math.floor(minutes / 60));

  function show(n: number) {
    return n.toString().padStart(2, "0");
  }
</script>

<span>
  {show(hours)}:{show(minutes)}:{show(seconds)}
</span>
