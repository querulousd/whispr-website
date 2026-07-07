(function () {
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-nav-menu]");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });

    navMenu.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        navToggle.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      }
    });
  }

  var assetSlots = Array.prototype.slice.call(document.querySelectorAll("[data-asset]"));
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loadAsset(slot) {
    if (slot.dataset.loaded === "true") {
      return;
    }

    var asset = slot.getAttribute("data-asset");
    var webpAsset = slot.getAttribute("data-asset-webp");
    var image = new Image();

    if (!asset) {
      return;
    }

    slot.dataset.loaded = "true";
    image.decoding = "async";

    function applyAsset(path) {
      slot.style.backgroundImage = "url('" + path + "')";
      slot.classList.add("has-asset");
    }

    image.onload = function () {
      applyAsset(image.src);
    };

    image.onerror = function () {
      if (webpAsset && image.src.indexOf(webpAsset) !== -1) {
        var fallback = new Image();
        fallback.decoding = "async";
        fallback.onload = function () {
          applyAsset(asset);
        };
        fallback.src = asset;
      }
    };

    image.src = webpAsset || asset;
  }

  assetSlots.forEach(loadAsset);

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
}());
