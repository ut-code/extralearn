<script lang="ts">
  import "./app.css";

  let url = $state("http://localhost:3000");
  let result: string = $state("");
  let method: "GET" | "DELETE" = $state("GET");
  let loading = $state(false);
  let failed = $state(false);
  async function fetchData() {
    try {
      loading = true;
      const resp = await fetch(url, {
        method,
      });
      const text = await resp.text();
      if (text.length < 100) {
        result = text;
      } else {
        result = `length: ${text.length} (see console for full result)`;
        console.log(text);
      }
      failed = false;
    } catch (err) {
      result = (err as Error).message;
      failed = true;
    } finally {
      loading = false;
    }
  }
  $effect(() => {
    method;
    url = "";
  });
</script>

<main class="flex flex-col gap-8 max-w-lg mx-auto justify-center h-full">
  <div class="h-80 w-full flex flex-col justify-between">
    <span>
      <select bind:value={method} class="select w-25">
        <option>GET</option>
        <option>DELETE</option>
      </select>
      <select bind:value={url} class="select w-100">
        <option>http://localhost:3000/no-header</option>
        <option>http://localhost:3000/with-header</option>
        {#if method === "DELETE"}
          <option>http://localhost:3000/no-header?options</option>
          <option>http://localhost:3000/with-header?options</option>
        {/if}
      </select>
      <p class="m-8 text-center text-xl" class:text-error={failed}>{result}</p>
      <button
        type="button"
        disabled={loading || url === ""}
        class="btn btn-primary btn-block text-lg"
        onclick={fetchData}
      >
        {#if loading}
          <span class="loading loading-spinner"></span>
        {/if}
        Fetch Data
      </button>
    </span>
  </div>
</main>

<style>
  main {
    margin: auto;
  }
</style>
