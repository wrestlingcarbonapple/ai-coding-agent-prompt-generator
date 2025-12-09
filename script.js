(function () {
  function byId(id) {
    return document.getElementById(id);
  }

  function sanitize(input) {
    if (!input) return "";
    return String(input).trim();
  }

  function buildPrompt(values) {
    const {
      languageStack,
      goal,
      techStack,
      architecture,
      designPatterns,
      nonFunctional,
      errorHandling,
      configuration,
      unitTestFramework,
      styleQuality
    } = values;

    const parts = [];

    parts.push(
      `You are a senior software engineer specializing in ${languageStack || "[language/stack, e.g. TypeScript + Node.js, Python + FastAPI, etc.]"}.\n`
    );

    parts.push("I need production-ready code for the following feature:");
    parts.push(`Goal: ${goal}`);
    parts.push(""); // blank line

    parts.push("Context & constraints");
    parts.push("");

    if (techStack) {
      parts.push(`Tech stack: ${techStack}`);
    } else {
      parts.push("Tech stack: [e.g. Node.js 22, TypeScript 5, PostgreSQL 16, Docker]");
    }

    if (architecture) {
      parts.push(`Architecture: ${architecture}`);
    } else {
      parts.push("Architecture: [e.g. hexagonal / clean architecture / layered service + repository / event-driven]");
    }

    if (designPatterns) {
      parts.push(`Design patterns you should apply: ${designPatterns}`);
    } else {
      parts.push("Design patterns you should apply: [e.g. Strategy, Command, Factory, Observer, CQRS, etc.]");
    }

    if (nonFunctional) {
      parts.push(`Non-functional requirements: ${nonFunctional}`);
    } else {
      parts.push("Non-functional requirements: [performance, security, observability, scalability, latency targets, etc.]");
    }

    if (errorHandling) {
      parts.push(`Error handling: ${errorHandling}`);
    } else {
      parts.push("Error handling: [how errors should be propagated/logged, retry behavior, circuit breakers, etc.]");
    }

    if (configuration) {
      parts.push(`Configuration: ${configuration}`);
    } else {
      parts.push("Configuration: [env vars, config files, secrets management]");
    }

    parts.push("");
    parts.push("Deliverables");
    parts.push("");

    parts.push("Full, compilable code in [language] organized into realistic modules/files, not pseudocode.");
    parts.push("Clear separation of concerns (domain logic, infrastructure, transport/API).");
    parts.push("Interfaces/abstractions where we might swap implementations later.");
    parts.push("Robust error handling and logging suitable for production.");
    parts.push("Input validation and basic security best practices for [HTTP APIs / message handlers / CLIs, etc.].");

    if (unitTestFramework) {
      parts.push(`Unit tests using ${unitTestFramework} for the key public surfaces.`);
    } else {
      parts.push("Unit tests using [testing framework, e.g. Jest, Pytest, xUnit] for the key public surfaces.");
    }

    parts.push(
      "Brief explanation (max 10–15 lines) of the architecture and why the main design patterns were chosen."
    );
    parts.push("");
    parts.push("Style and quality expectations");
    parts.push("");

    parts.push("Idiomatic, modern [language] using current best practices.");
    parts.push("No unnecessary comments; only where something non-obvious needs explanation.");
    parts.push("Use meaningful names and avoid over-engineering.");
    parts.push("Prefer dependency injection and testability over tight coupling.");
    parts.push("Make sure the code would pass a code review at a FAANG-level company.");

    if (styleQuality) {
      parts.push("");
      parts.push(styleQuality);
    }

    return parts.join("\n");
  }

  function readFormValues(form) {
    const fd = new FormData(form);
    return {
      languageStack: sanitize(fd.get("languageStack")),
      goal: sanitize(fd.get("goal")),
      techStack: sanitize(fd.get("techStack")),
      architecture: sanitize(fd.get("architecture")),
      designPatterns: sanitize(fd.get("designPatterns")),
      nonFunctional: sanitize(fd.get("nonFunctional")),
      errorHandling: sanitize(fd.get("errorHandling")),
      configuration: sanitize(fd.get("configuration")),
      unitTestFramework: sanitize(fd.get("unitTestFramework")),
      styleQuality: sanitize(fd.get("styleQuality"))
    };
  }

  function setCopyStatus(message, type) {
    const statusEl = byId("copyStatus");
    if (!statusEl) return;

    statusEl.textContent = message || "";

    statusEl.classList.remove(
      "output__status--success",
      "output__status--error"
    );

    if (type === "success") {
      statusEl.classList.add("output__status--success");
    } else if (type === "error") {
      statusEl.classList.add("output__status--error");
    }
  }

  function attachEventHandlers() {
    const form = byId("promptForm");
    const output = byId("outputPrompt");
    const copyButton = byId("copyButton");

    if (!form || !output || !copyButton) {
      // Fail silently but clearly in console; page is static.
      console.error("Prompt generator: missing core DOM elements.");
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      setCopyStatus("", null);

      const values = readFormValues(form);

      if (!values.goal) {
        setCopyStatus("Goal is required to generate a prompt.", "error");
        output.value = "";
        return;
      }

      if (!values.languageStack) {
        setCopyStatus("Language / stack is required.", "error");
        output.value = "";
        return;
      }

      const prompt = buildPrompt(values);
      output.value = prompt;

      // Move focus to output for quick keyboard copy if desired.
      output.focus();
      output.select();
    });

    form.addEventListener("reset", function () {
      setTimeout(function () {
        const output = byId("outputPrompt");
        if (output) output.value = "";
        setCopyStatus("", null);
      }, 0);
    });

    copyButton.addEventListener("click", function () {
      const output = byId("outputPrompt");
      if (!output || !output.value) {
        setCopyStatus("Nothing to copy yet. Generate a prompt first.", "error");
        return;
      }

      const text = output.value;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(text)
          .then(function () {
            setCopyStatus("Prompt copied to clipboard.", "success");
          })
          .catch(function () {
            fallbackCopy(text);
          });
      } else {
        fallbackCopy(text);
      }
    });
  }

  function fallbackCopy(text) {
    try {
      const temp = document.createElement("textarea");
      temp.value = text;
      temp.setAttribute("readonly", "");
      temp.style.position = "absolute";
      temp.style.left = "-9999px";
      document.body.appendChild(temp);
      temp.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(temp);

      if (successful) {
        setCopyStatus("Prompt copied to clipboard.", "success");
      } else {
        setCopyStatus("Unable to copy prompt automatically.", "error");
      }
    } catch (err) {
      console.error("Copy failed:", err);
      setCopyStatus("Copy failed. Try selecting and copying manually.", "error");
    }
  }

  document.addEventListener("DOMContentLoaded", attachEventHandlers);
})();
