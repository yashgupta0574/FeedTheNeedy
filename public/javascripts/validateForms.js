(function () {
  "use strict";

  bsCustomFileInput.init(); //dynamic custom file input means we can take more than 2 ducuments from user
  const forms = document.querySelectorAll(".validated-form");
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
