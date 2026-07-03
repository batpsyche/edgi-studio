(function () {
  "use strict";

  function isOtherSelected(group) {
    if (group.tagName === "SELECT") {
      return group.value === "Other";
    }
    // group is the <fieldset data-other-group="..."> itself here, so any
    // checked radio/checkbox inside it with value="Other" is a match --
    // no need to match by `name` (checkbox names carry a "[]" suffix that
    // qs strips server-side, so matching by name here would be brittle).
    return !!group.querySelector('input:checked[value="Other"]');
  }

  function syncOtherField(form, group) {
    var key = group.dataset.otherGroup;
    var otherInput = form.querySelector('[data-other-for="' + key + '"]');
    if (!otherInput) return;
    var show = isOtherSelected(group);
    otherInput.hidden = !show;
    otherInput.required = show;
    if (!show) otherInput.value = "";
  }

  function enforceMaxSelect(fieldset) {
    var max = parseInt(fieldset.dataset.maxSelect, 10);
    var boxes = fieldset.querySelectorAll('input[type="checkbox"]');
    var checkedCount = fieldset.querySelectorAll(
      'input[type="checkbox"]:checked'
    ).length;
    boxes.forEach(function (box) {
      if (!box.checked) {
        box.disabled = checkedCount >= max;
      }
    });
  }

  function checkboxGroupHasSelection(fieldset) {
    return (
      fieldset.querySelectorAll('input[type="checkbox"]:checked').length > 0
    );
  }

  function initForm(form) {
    var errorEl = form.querySelector(".wf-error");

    form.addEventListener("change", function (event) {
      var otherGroup = event.target.closest("[data-other-group]");
      if (otherGroup) {
        syncOtherField(form, otherGroup);
      }

      var checkboxFieldset = event.target.closest(
        ".wf-checkbox-group[data-max-select]"
      );
      if (checkboxFieldset) {
        enforceMaxSelect(checkboxFieldset);
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = "";
      }

      if (!form.reportValidity()) {
        return;
      }

      var missingGroup = null;
      form
        .querySelectorAll(".wf-checkbox-group[required]")
        .forEach(function (fieldset) {
          if (!missingGroup && !checkboxGroupHasSelection(fieldset)) {
            missingGroup = fieldset;
          }
        });
      if (missingGroup) {
        var label = missingGroup.querySelector(".wf-question");
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.textContent =
            "Please select at least one option for: " +
            (label ? label.textContent : "the highlighted question");
        }
        missingGroup.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      var submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      var body = new URLSearchParams(new FormData(form));

      fetch(form.dataset.action, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { ok: response.ok, data: data };
          });
        })
        .then(function (result) {
          if (result.ok && result.data && result.data.success) {
            window.location.href = form.dataset.thankyou;
          } else {
            throw new Error(
              (result.data && result.data.error) || "Something went wrong"
            );
          }
        })
        .catch(function () {
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent =
              "Something went wrong submitting your application. Please try again in a moment.";
          }
          if (submitButton) submitButton.disabled = false;
        });
    });
  }

  document.querySelectorAll(".js-webinar-form").forEach(initForm);
})();
