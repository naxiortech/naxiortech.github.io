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

/* ─── SUPABASE CONFIG ─── */
const SUPABASE_URL  = 'https://uvqfkhxkjmxrujygflxk.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cWZraHhram14cnVqeWdmbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MTczOTgsImV4cCI6MjA4NzI5MzM5OH0.dwWnQf2jVjnkYU1HjGvy9CcZk42tgOmDICyohgoFhUg';

async function insertLead(data) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
            'Content-Type':  'application/json',
            'apikey':        SUPABASE_ANON,
            'Authorization': 'Bearer ' + SUPABASE_ANON,
            'Prefer':        'return=minimal'
        },
        body: JSON.stringify({
            name:         data.name,
            company:      data.company     || null,
            email:        data.email,
            whatsapp:     data.whatsapp    || null,
            problem_type: data.problemType || null,
            description:  data.description,
            deadline:     data.deadline    || null,
            status:       'new'
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }
}

/* ─── CONTACT FORM ─── */
const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn    = form.querySelector('.btn-primary');
    const status = document.getElementById('formStatus');

    const data = {
        name:        form.querySelector('#fieldName').value.trim(),
        company:     form.querySelector('#fieldCompany').value.trim(),
        email:       form.querySelector('#fieldEmail').value.trim(),
        whatsapp:    form.querySelector('#fieldWhatsapp').value.trim(),
        problemType: form.querySelector('input[name="problemType"]:checked')?.value || '',
        description: form.querySelector('#fieldDescription').value.trim(),
        deadline:    form.querySelector('#fieldDeadline').value,
    };

    if (!data.name || !data.email || !data.description || !data.problemType) {
        showStatus('error', 'Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    btn.textContent = 'Enviando...';
    btn.disabled    = true;

    try {
        await insertLead(data);

        const waMsg = encodeURIComponent(
            `Olá, sou ${data.name}${data.company ? ' da ' + data.company : ''}.\n\n` +
            `Tipo de projeto: ${data.problemType}\n` +
            `Prazo: ${data.deadline || 'a definir'}\n\n` +
            `${data.description}`
        );

        document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
            link.href = `https://wa.me/5561999999999?text=${waMsg}`;
        });

        showStatus('success', '✓ Mensagem enviada! Retorno em até 24h.');
        form.reset();

    } catch (err) {
        console.error('Erro ao salvar lead:', err);
        showStatus('error', 'Erro ao enviar. Tente pelo WhatsApp diretamente.');
    } finally {
        btn.textContent = 'Enviar Briefing';
        btn.disabled    = false;
    }
});

function showStatus(type, msg) {
    const status = document.getElementById('formStatus');
    status.textContent  = msg;
    status.className    = `form-status ${type}`;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 6000);
}

/* ─── WHATSAPP MASK ─── */
document.getElementById('fieldWhatsapp')?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    }
    e.target.value = v;
});