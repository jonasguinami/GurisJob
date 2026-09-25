const GurisJob = (() => {
  const state = {
    view: "dashboard",
    filter: "Todas",
    selectedJobId: null,
    jobs: [
      {
        id: createId(),
        title: "Apoio de alvenaria em reforma comercial",
        category: "Alvenaria",
        location: "Porto Alegre, RS",
        pay: 680,
        urgency: "Urgente",
        status: "Aberta"
      },
      {
        id: createId(),
        title: "Revisão elétrica em unidade operacional",
        category: "Elétrica",
        location: "Canoas, RS",
        pay: 540,
        urgency: "Pra Hoje",
        status: "Aberta"
      },
      {
        id: createId(),
        title: "Equipe de limpeza pós-obra",
        category: "Limpeza",
        location: "Gravataí, RS",
        pay: 510,
        urgency: "Amanhã",
        status: "Aberta"
      },
      {
        id: createId(),
        title: "Carga e descarga de estoque",
        category: "Carga",
        location: "São Leopoldo, RS",
        pay: 420,
        urgency: "Esta Semana",
        status: "Aberta"
      },
      {
        id: createId(),
        title: "Montagem operacional para evento",
        category: "Eventos",
        location: "Novo Hamburgo, RS",
        pay: 390,
        urgency: "Pra Hoje",
        status: "Aberta"
      }
    ],
    chatOptions: [
      "Como postar lida?",
      "Taxas do brique",
      "Falar com suporte"
    ]
  };

  const dom = {};

  const chatAnswers = {
    "Como postar lida?": {
      answer:
        "Tchê, postar lida é fácil! Vai no painel da Estância, preenche título, categoria, local, valor e urgência. Depois é só clicar em Postar Lida.",
      next: ["Ver exemplo de lida", "Taxas do brique", "Falar com suporte"]
    },
    "Taxas do brique": {
      answer:
        "Bah, as taxas dependem do tipo de operação. Pra protótipo, considera que o GurisJob cobra uma taxa operacional só quando o brique é fechado.",
      next: ["Como postar lida?", "Como arrematar?", "Falar com suporte"]
    },
    "Falar com suporte": {
      answer:
        "Certo, guri. Num app real eu abriria um atendimento humano. Aqui no protótipo, posso te guiar pelo painel, feed ou perfil.",
      next: ["Como postar lida?", "Como arrematar?", "Voltar ao início"]
    },
    "Ver exemplo de lida": {
      answer:
        "Exemplo bom: 'Apoio de alvenaria em reforma comercial', categoria Alvenaria, local Canoas, valor R$ 450 e urgência Pra Hoje.",
      next: ["Como postar lida?", "Como arrematar?", "Voltar ao início"]
    },
    "Como arrematar?": {
      answer:
        "Pra arrematar, entra no Feed de Lidas, escolhe uma empreitada e toca em Arrematar Brique. O GurisJob confirma antes de fechar.",
      next: ["Taxas do brique", "Falar com suporte", "Voltar ao início"]
    },
    "Voltar ao início": {
      answer:
        "Feito. Escolhe o caminho, tchê: postar uma lida, entender taxa ou chamar suporte.",
      next: ["Como postar lida?", "Taxas do brique", "Falar com suporte"]
    }
  };

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function cacheDom() {
    dom.viewTitle = document.getElementById("viewTitle");

    dom.viewButtons = document.querySelectorAll("[data-view-target]");
    dom.navItems = document.querySelectorAll(".nav-item");
    dom.viewSwitches = document.querySelectorAll(".view-switch");
    dom.bottomLinks = document.querySelectorAll(".bottom-link");

    dom.dashboardView = document.getElementById("dashboardView");
    dom.feedView = document.getElementById("feedView");
    dom.profileView = document.getElementById("profileView");

    dom.jobForm = document.getElementById("jobForm");
    dom.jobTitle = document.getElementById("jobTitle");
    dom.jobCategory = document.getElementById("jobCategory");
    dom.jobLocation = document.getElementById("jobLocation");
    dom.jobPay = document.getElementById("jobPay");
    dom.jobUrgency = document.getElementById("jobUrgency");
    dom.postJobButton = document.getElementById("postJobButton");

    dom.dashboardJobs = document.getElementById("dashboardJobs");
    dom.feedJobs = document.getElementById("feedJobs");
    dom.filterChips = document.querySelectorAll(".filter-chip");

    dom.activeJobsLabel = document.getElementById("activeJobsLabel");
    dom.totalJobsMetric = document.getElementById("totalJobsMetric");
    dom.openJobsMetric = document.getElementById("openJobsMetric");

    dom.settingsButton = document.getElementById("settingsButton");
    dom.mobileSettingsButton = document.getElementById("mobileSettingsButton");
    dom.profileSettingsButton = document.getElementById("profileSettingsButton");
    dom.settingsModal = document.getElementById("settingsModal");
    dom.closeSettingsButton = document.getElementById("closeSettingsButton");
    dom.settingActions = document.querySelectorAll("[data-setting-action]");

    dom.dealModal = document.getElementById("dealModal");
    dom.closeDealButton = document.getElementById("closeDealButton");
    dom.cancelDealButton = document.getElementById("cancelDealButton");
    dom.confirmDealButton = document.getElementById("confirmDealButton");
    dom.dealSummary = document.getElementById("dealSummary");

    dom.chatFab = document.getElementById("chatFab");
    dom.chatWindow = document.getElementById("chatWindow");
    dom.closeChatButton = document.getElementById("closeChatButton");
    dom.chatMessages = document.getElementById("chatMessages");
    dom.chatOptions = document.getElementById("chatOptions");

    dom.cookieBanner = document.getElementById("cookieBanner");
    dom.acceptCookiesButton = document.getElementById("acceptCookiesButton");
    dom.readTermsButton = document.getElementById("readTermsButton");

    dom.toastStack = document.getElementById("toastStack");
  }

  function bindEvents() {
    dom.viewButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setView(button.dataset.viewTarget, true);
      });
    });

    dom.filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        setFilter(chip.dataset.filter);
      });
    });

    getFields().forEach((field) => {
      field.addEventListener("input", () => validateField(field));
      field.addEventListener("change", () => validateField(field));
      field.addEventListener("blur", () => validateField(field));
    });

    dom.jobForm.addEventListener("submit", handlePostJob);
    dom.feedJobs.addEventListener("click", handleDealClick);

    dom.settingsButton.addEventListener("click", openSettingsModal);
    dom.mobileSettingsButton.addEventListener("click", openSettingsModal);
    dom.profileSettingsButton.addEventListener("click", openSettingsModal);
    dom.closeSettingsButton.addEventListener("click", closeSettingsModal);

    dom.settingActions.forEach((button) => {
      button.addEventListener("click", () => {
        handleSettingAction(button.dataset.settingAction);
      });
    });

    dom.settingsModal.addEventListener("click", (event) => {
      if (event.target === dom.settingsModal) {
        closeSettingsModal();
      }
    });

    dom.closeDealButton.addEventListener("click", closeDealModal);
    dom.cancelDealButton.addEventListener("click", closeDealModal);
    dom.confirmDealButton.addEventListener("click", confirmDeal);

    dom.dealModal.addEventListener("click", (event) => {
      if (event.target === dom.dealModal) {
        closeDealModal();
      }
    });

    dom.chatFab.addEventListener("click", toggleChat);
    dom.closeChatButton.addEventListener("click", closeChat);

    if (dom.acceptCookiesButton) {
      dom.acceptCookiesButton.addEventListener("click", acceptCookies);
    }

    if (dom.readTermsButton) {
      dom.readTermsButton.addEventListener("click", () => {
        showToast("Termos do GurisJob abertos para leitura.", "success");
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSettingsModal();
        closeDealModal();
        closeChat();
      }
    });
  }

  function getFields() {
    return [
      dom.jobTitle,
      dom.jobCategory,
      dom.jobLocation,
      dom.jobPay,
      dom.jobUrgency
    ];
  }

  function setView(view, scrollToWorkspace = false) {
    state.view = view;

    const titles = {
      dashboard: "A Estância",
      feed: "Lidas no Trecho",
      profile: "Perfil da Estância"
    };

    dom.viewTitle.textContent = titles[view];

    dom.dashboardView.classList.toggle("active-view", view === "dashboard");
    dom.feedView.classList.toggle("active-view", view === "feed");
    dom.profileView.classList.toggle("active-view", view === "profile");

    [...dom.navItems, ...dom.viewSwitches, ...dom.bottomLinks].forEach((item) => {
      item.classList.toggle("active", item.dataset.viewTarget === view);
    });

    if (scrollToWorkspace) {
      window.setTimeout(() => {
        document.getElementById("workspace").scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }, 40);
    }
  }

  function setFilter(filter) {
    state.filter = filter;

    dom.filterChips.forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.filter === filter);
    });

    dom.feedJobs.classList.add("is-filtering");

    window.setTimeout(() => {
      renderFeed();
      dom.feedJobs.classList.remove("is-filtering");
    }, 180);
  }

  function handlePostJob(event) {
    event.preventDefault();

    if (!validateForm()) {
      showToast("Revise os campos da lida antes de postar.", "error");
      return;
    }

    const job = {
      id: createId(),
      title: dom.jobTitle.value.trim(),
      category: dom.jobCategory.value,
      location: dom.jobLocation.value.trim(),
      pay: Number(dom.jobPay.value),
      urgency: dom.jobUrgency.value,
      status: "Aberta"
    };

    setButtonLoading(dom.postJobButton);

    window.setTimeout(() => {
      state.jobs.unshift(job);
      dom.jobForm.reset();
      clearValidation();

      clearButtonLoading(
        dom.postJobButton,
        `<svg><use href="#icon-plus"></use></svg>Postar Lida`
      );

      renderAll();
      showToast("Lida postada com sucesso, patrão.", "success");
    }, 800);
  }

  function validateForm() {
    return getFields().every((field) => validateField(field));
  }

  function validateField(field) {
    const value = field.value.trim();
    let valid = true;
    let message = "";

    if (!value) {
      valid = false;
      message = "Campo obrigatório.";
    }

    if (field.type === "number" && Number(value) <= 0) {
      valid = false;
      message = "Informe um valor válido.";
    }

    field.classList.toggle("is-invalid", !valid);
    field.classList.toggle("is-valid", valid);

    const small = field.parentElement.querySelector("small");

    if (small) {
      small.textContent = message;
    }

    return valid;
  }

  function clearValidation() {
    getFields().forEach((field) => {
      field.classList.remove("is-invalid", "is-valid");

      const small = field.parentElement.querySelector("small");

      if (small) {
        small.textContent = "";
      }
    });
  }

  function handleDealClick(event) {
    const button = event.target.closest("[data-job-id]");

    if (!button) return;

    const job = state.jobs.find((item) => item.id === button.dataset.jobId);

    if (!job) return;

    state.selectedJobId = job.id;
    openDealModal(job);
  }

  function openDealModal(job) {
    dom.dealSummary.innerHTML = `
      <div class="deal-row">
        <svg><use href="#icon-briefcase"></use></svg>
        <strong>${escapeHtml(job.title)}</strong>
      </div>

      <div class="deal-row">
        <svg><use href="#icon-pin"></use></svg>
        ${escapeHtml(job.location)}
      </div>

      <div class="deal-row">
        <svg><use href="#icon-coin"></use></svg>
        ${formatCurrency(job.pay)}
      </div>

      <div class="deal-row">
        <svg><use href="#icon-clock"></use></svg>
        ${escapeHtml(job.urgency)}
      </div>
    `;

    dom.dealModal.classList.add("open");
    dom.dealModal.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      dom.confirmDealButton.focus();
    }, 80);
  }

  function closeDealModal() {
    dom.dealModal.classList.remove("open");
    dom.dealModal.setAttribute("aria-hidden", "true");
    state.selectedJobId = null;

    clearButtonLoading(
      dom.confirmDealButton,
      `<svg><use href="#icon-check"></use></svg>Confirmar Brique`
    );
  }

  function confirmDeal() {
    const job = state.jobs.find((item) => item.id === state.selectedJobId);

    if (!job) {
      showToast("Essa lida não foi encontrada.", "error");
      closeDealModal();
      return;
    }

    setButtonLoading(dom.confirmDealButton);

    window.setTimeout(() => {
      job.status = "Brique Fechado";
      renderAll();
      closeDealModal();
      showToast("Lida arrematada. Brique fechado!", "success");
    }, 800);
  }

  function openSettingsModal() {
    dom.settingsModal.classList.add("open");
    dom.settingsModal.setAttribute("aria-hidden", "false");
  }

  function closeSettingsModal() {
    dom.settingsModal.classList.remove("open");
    dom.settingsModal.setAttribute("aria-hidden", "true");
  }

  function handleSettingAction(action) {
    const messages = {
      profile: "Perfil pronto para edição.",
      notifications: "Preferências de notificação abertas.",
      account: "Ajustes da conta carregados.",
      logout: "Saindo da Estância..."
    };

    showToast(
      messages[action] || "Configuração atualizada.",
      action === "logout" ? "error" : "success"
    );

    if (action !== "logout") {
      closeSettingsModal();
    }
  }

  function toggleChat() {
    const isOpen = dom.chatWindow.classList.toggle("open");

    dom.chatWindow.setAttribute("aria-hidden", String(!isOpen));

    dom.chatFab.innerHTML = isOpen
      ? `<svg><use href="#icon-close"></use></svg>`
      : `<svg><use href="#icon-message"></use></svg>`;

    if (isOpen && dom.chatOptions.children.length === 0) {
      renderChatOptions(state.chatOptions);
      scrollChatToBottom();
    }
  }

  function closeChat() {
    dom.chatWindow.classList.remove("open");
    dom.chatWindow.setAttribute("aria-hidden", "true");
    dom.chatFab.innerHTML = `<svg><use href="#icon-message"></use></svg>`;
  }

  function renderChatOptions(options) {
    dom.chatOptions.innerHTML = "";

    options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "chat-option";
      button.textContent = option;

      button.addEventListener("click", () => {
        handleChatChoice(option);
      });

      dom.chatOptions.appendChild(button);
    });
  }

  function handleChatChoice(choice) {
    appendMessage(choice, "user");
    dom.chatOptions.innerHTML = "";

    const typingNode = appendTyping();

    window.setTimeout(() => {
      typingNode.remove();

      const response = chatAnswers[choice] || chatAnswers["Voltar ao início"];

      appendMessage(response.answer, "bot");
      renderChatOptions(response.next);

      scrollChatToBottom();
    }, 1500);

    scrollChatToBottom();
  }

  function appendMessage(text, type) {
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;

    dom.chatMessages.appendChild(message);
    scrollChatToBottom();

    return message;
  }

  function appendTyping() {
    const typing = document.createElement("div");
    typing.className = "message bot";
    typing.innerHTML = `
      <span class="typing">
        <span></span>
        <span></span>
        <span></span>
      </span>
    `;

    dom.chatMessages.appendChild(typing);
    scrollChatToBottom();

    return typing;
  }

  function scrollChatToBottom() {
    window.requestAnimationFrame(() => {
      dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
    });
  }

  function renderAll() {
    renderMetrics();
    renderDashboard();
    renderFeed();
  }

  function renderMetrics() {
    const total = state.jobs.length;

    dom.totalJobsMetric.textContent = `${total} ${total === 1 ? "lida" : "lidas"}`;
    dom.openJobsMetric.textContent = String(total);
    dom.activeJobsLabel.textContent = `${total} ${total === 1 ? "aberta" : "abertas"}`;
  }

  function renderDashboard() {
    dom.dashboardJobs.innerHTML = "";

    if (state.jobs.length === 0) {
      dom.dashboardJobs.innerHTML = createEmptyState();
      return;
    }

    state.jobs.forEach((job) => {
      dom.dashboardJobs.appendChild(createJobCard(job, false));
    });
  }

  function renderFeed() {
    dom.feedJobs.innerHTML = "";

    const visibleJobs =
      state.filter === "Todas"
        ? state.jobs
        : state.jobs.filter((job) => job.category === state.filter);

    if (visibleJobs.length === 0) {
      dom.feedJobs.innerHTML = createEmptyState();
      return;
    }

    visibleJobs.forEach((job) => {
      dom.feedJobs.appendChild(createJobCard(job, true));
    });
  }

  function createJobCard(job, withAction) {
    const card = document.createElement("article");
    card.className = "job-card";

    card.innerHTML = `
      <div class="job-topline">
        <span class="badge badge-category">
          <svg><use href="#icon-briefcase"></use></svg>
          ${escapeHtml(job.category)}
        </span>

        <span class="badge badge-urgency">
          <svg><use href="#icon-clock"></use></svg>
          ${escapeHtml(job.urgency)}
        </span>
      </div>

      <h4>${escapeHtml(job.title)}</h4>

      <div class="job-meta">
        <span class="job-row">
          <svg><use href="#icon-pin"></use></svg>
          ${escapeHtml(job.location)}
        </span>

        <span class="job-row badge badge-price">
          <svg><use href="#icon-coin"></use></svg>
          ${formatCurrency(job.pay)}
        </span>

        <span class="job-row badge badge-status">
          <svg><use href="#icon-check"></use></svg>
          ${escapeHtml(job.status)}
        </span>
      </div>

      ${
        withAction
          ? `
            <button class="btn btn-primary" data-job-id="${escapeHtml(job.id)}">
              Arrematar Brique
              <svg><use href="#icon-arrow"></use></svg>
            </button>
          `
          : ""
      }
    `;

    return card;
  }

  function createEmptyState() {
    return `
      <div class="empty-state">
        <svg viewBox="0 0 240 150" aria-hidden="true">
          <rect x="34" y="28" width="172" height="96" rx="16" fill="#F1F5F9" stroke="#CBD5E1"/>
          <rect x="52" y="48" width="86" height="9" rx="4.5" fill="#CBD5E1"/>
          <rect x="52" y="70" width="132" height="7" rx="3.5" fill="#E2E8F0"/>
          <rect x="52" y="88" width="108" height="7" rx="3.5" fill="#E2E8F0"/>
          <path d="M74 122c24 18 68 18 92 0" stroke="#CBD5E1" stroke-width="7" stroke-linecap="round" fill="none"/>
          <circle cx="178" cy="52" r="14" fill="#FFFFFF" stroke="#CBD5E1"/>
          <path d="M172 52l4 4 8-9" stroke="#CBD5E1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
        <strong>Nenhuma lida no momento</strong>
        <span>Troque o filtro ou volte mais tarde para novas empreitadas.</span>
      </div>
    `;
  }

  function setButtonLoading(button) {
    button.disabled = true;
    button.classList.add("button-loading");
    button.innerHTML = `<svg class="button-spinner"><use href="#icon-spinner"></use></svg>`;
  }

  function clearButtonLoading(button, html) {
    button.disabled = false;
    button.classList.remove("button-loading");
    button.innerHTML = html;
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon = type === "success" ? "icon-check" : "icon-close";

    toast.innerHTML = `
      <svg><use href="#${icon}"></use></svg>
      <span>${escapeHtml(message)}</span>
    `;

    dom.toastStack.appendChild(toast);

    window.setTimeout(() => {
      toast.classList.add("removing");

      toast.addEventListener("animationend", () => {
        toast.remove();
      }, { once: true });
    }, 3000);
  }

  function setupCookieBanner() {
    if (!dom.cookieBanner) return;

    const accepted = getCookieConsent();

    if (accepted) {
      dom.cookieBanner.remove();
      return;
    }

    window.setTimeout(() => {
      dom.cookieBanner.classList.add("show");
    }, 600);
  }

  function acceptCookies() {
    setCookieConsent();

    dom.cookieBanner.classList.add("hiding");
    dom.cookieBanner.classList.remove("show");

    window.setTimeout(() => {
      dom.cookieBanner.remove();
    }, 300);

    showToast("Cookies aceitos. GurisJob rodando liso.", "success");
  }

  function getCookieConsent() {
    try {
      return localStorage.getItem("cookiesAccepted") === "true";
    } catch (error) {
      return false;
    }
  }

  function setCookieConsent() {
    try {
      localStorage.setItem("cookiesAccepted", "true");
    } catch (error) {
      showToast("Não foi possível salvar tua preferência de cookies.", "error");
    }
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(value);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function init() {
    cacheDom();
    bindEvents();
    renderAll();
    renderChatOptions(state.chatOptions);
    setupCookieBanner();
  }

  return {
    init
  };
})();

document.addEventListener("DOMContentLoaded", GurisJob.init);