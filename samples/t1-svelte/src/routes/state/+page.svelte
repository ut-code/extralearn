<script lang="ts">
  let timer = $state(0);
  setInterval(() => {
    timer += 1;
  }, 1000);
</script>

<span>
  time: {timer}
</span>
