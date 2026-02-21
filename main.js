/* ─── SERVICES ACCORDION ─── */
const serviceData = [
    {
        num: '01',
        title: 'Automação de Processos',
        desc: 'Mapeamos o processo manual que consome tempo da sua equipe e entregamos uma solução que roda sozinha — com notificações, logs e tratamento de erros.',
        tags: ['Scripts', 'Agendamento', 'Notificações', 'Relatórios automáticos']
    },
    {
        num: '02',
        title: 'Integração de Sistemas',
        desc: 'Conectamos as ferramentas que você já usa para que elas trabalhem juntas. Chega de exportar planilha, copiar dado e digitar duas vezes.',
        tags: ['REST APIs', 'Webhooks', 'ERP', 'WhatsApp API', 'N8N']
    },
    {
        num: '03',
        title: 'Ferramentas sob Medida',
        desc: 'Quando nenhuma solução pronta resolve, construímos do zero. Dashboard interno, sistema de gestão, portal de clientes — o que o seu negócio realmente precisa.',
        tags: ['Web Apps', 'Dashboards', 'Back-end', 'Documentação inclusa']
    }
];

function selectService(idx) {
    document.querySelectorAll('.service-item').forEach((el, i) => {
        el.classList.toggle('active', i === idx);
    });
    const d = serviceData[idx];
    document.getElementById('visualNum').textContent   = d.num;
    document.getElementById('visualTitle').textContent = d.title;
    document.getElementById('visualDesc').textContent  = d.desc;
    const tagsEl = document.getElementById('visualTags');
    tagsEl.innerHTML = d.tags.map(t => `<span class="tag">${t}</span>`).join('');
}

/* ─── SCROLL REVEAL ─── */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ─── NAV SHRINK ON SCROLL ─── */
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 60) {
        nav.style.padding = '12px 60px';
    } else {
        nav.style.padding = '20px 60px';
    }
});

/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn    = form.querySelector('.btn-primary');
    const status = document.getElementById('formStatus');

    // Collect form data
    const data = {
        name:        form.querySelector('#fieldName').value.trim(),
        company:     form.querySelector('#fieldCompany').value.trim(),
        email:       form.querySelector('#fieldEmail').value.trim(),
        whatsapp:    form.querySelector('#fieldWhatsapp').value.trim(),
        problemType: form.querySelector('input[name="problemType"]:checked')?.value || '',
        description: form.querySelector('#fieldDescription').value.trim(),
        deadline:    form.querySelector('#fieldDeadline').value,
        submittedAt: new Date().toISOString()
    };

    // Basic validation
    if (!data.name || !data.email || !data.description || !data.problemType) {
        showStatus('error', 'Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Loading state
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    try {
        /*
         * ── INTEGRATION POINT ──────────────────────────────────────────────────
         * Substitua a URL abaixo pelo endpoint do seu sistema quando estiver pronto.
         * O payload JSON já está estruturado e pronto para ser consumido por
         * qualquer backend (Node, Python, n8n webhook, Make, etc.)
         *
         * Exemplo com n8n:
         *   const res = await fetch('https://seu-n8n.app.n8n.cloud/webhook/leads', {
         *     method: 'POST',
         *     headers: { 'Content-Type': 'application/json' },
         *     body: JSON.stringify(data)
         *   });
         *
         * Por agora, apenas simulamos o envio com um delay.
         * ───────────────────────────────────────────────────────────────────────
         */
        await new Promise(resolve => setTimeout(resolve, 1200)); // simula request

        // Log estruturado no console para debug/desenvolvimento
        console.group('📋 Novo Lead — Naxior Tech');
        console.table(data);
        console.groupEnd();

        // Montar mensagem WhatsApp como fallback/complemento
        const waMsg = encodeURIComponent(
            `Olá, sou ${data.name}${data.company ? ' da ' + data.company : ''}.\n\n` +
            `Tipo de projeto: ${data.problemType}\n` +
            `Prazo: ${data.deadline || 'a definir'}\n\n` +
            `${data.description}`
        );

        showStatus('success', '✓ Mensagem enviada! Retorno em até 24h. Ou fale agora pelo WhatsApp ↓');

        // Atualiza o link do WhatsApp com os dados do form
        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            link.href = `https://wa.me/5561999999999?text=${waMsg}`;
        });

        form.reset();

    } catch (err) {
        showStatus('error', 'Erro ao enviar. Tente pelo WhatsApp diretamente.');
        console.error('Form error:', err);
    } finally {
        btn.textContent = 'Enviar Briefing';
        btn.disabled = false;
    }
});

function showStatus(type, msg) {
    const status = document.getElementById('formStatus');
    status.textContent = msg;
    status.className = `form-status ${type}`;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 6000);
}

/* ─── WHATSAPP MASK (campo telefone) ─── */
document.getElementById('fieldWhatsapp')?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    }
    e.target.value = v;
});