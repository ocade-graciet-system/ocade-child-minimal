<?php

namespace OcadeChild;

function Matomo() {
    ?>
      <!-- Matomo -->
      <script>
      var _paq = window._paq = window._paq || [];
      /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
      var u="https://stats-agence.graciet-co.fr/";
      _paq.push(['setTrackerUrl', u+'matomo.php']);
      _paq.push(['setSiteId', '31']);
      var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
      g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
      })();
      </script>
      <!-- End Matomo Code -->
    <?php
}
add_action('wp_head', 'OcadeChild\Matomo');