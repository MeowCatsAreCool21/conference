<script>
    export let src = "";
    export let alt = "";
    export let caption = "";
  </script>
  
  <figure style="text-align: center; margin: 20px 0;">
    <img src={src} alt={alt} style="max-width: 100%; height: auto; border-radius: 8px;">
    {#if caption}
      <figcaption style="font-style: italic; color: #555; margin-top: 10px;">{caption}</figcaption>
    {/if}
  </figure>
  