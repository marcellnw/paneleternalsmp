// Konfigurasi Webhook
const WEBHOOK_ANNOUNCEMENT = "https://discord.com/api/webhooks/1491686276414570611/pf1ZGDg0uFsdwbCE7ZwTPNVfCvr56n-nXaD5Jc9FUSigt3NdHGajUjEXJvkp7slJ-wyZ";
const WEBHOOK_DEFAULT = "https://discord.com/api/webhooks/1396156267994812497/GmgoFVHtJIYVvpzZ_2pLic_Bz5DS3H9vpNNGoN7A5LCTKUkaQZJ9WMWT_CwMZb_JgkRP";

const ROLE_ID = "1472246426414350336"; // Role ID LegendofFeeloria[S15]

let currentCategory = 'announcement';

// Particle Background Initialization
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 80 },
        color: { value: "#DDA0DD" },
        shape: { type: "circle" },
        opacity: { value: 0.5, anim: { enable: true, speed: 1, opacity_min: 0.1 } },
        size: { value: 3, random: true },
        move: { enable: true, speed: 1, direction: "none", out_mode: "out" }
    }
});

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById('navMenu').classList.remove('active');
    if(pageId === 'page2') switchForm('announcement');
}

const formConfig = {
    announcement: ['Judul', 'Kategori', 'Status', 'Description', 'Catatan'],
    quest: ['Nama', 'Type', 'Tier', 'Description', 'Progress', 'Reward'],
    event: ['Nama Event', 'Waktu', 'Lokasi', 'Description', 'Syarat'],
    update: ['Versi', 'Tanggal', 'Log Perubahan', 'New Update', 'Buff', 'Fix'],
    info: ['judul, 'Topik', 'Description']
};

function switchForm(category, btn) {
    currentCategory = category;
    if(btn) {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    
    const fields = formConfig[category];
    let html = '';
    fields.forEach(field => {
        const id = field.toLowerCase().replace(/ /g, '_');
        if (field === 'Description' || field === 'Log Perubahan' || field === 'Reward') {
            html += `<textarea id="${id}" placeholder="${field}" rows="3"></textarea>`;
        } else {
            html += `<input type="text" id="${id}" placeholder="${field}">`;
        }
    });
    document.getElementById('formFields').innerHTML = html;
}

async function sendToDiscord() {
    const fields = formConfig[currentCategory];
    let thumbnail = "https://github.com/marcellnw/paneleternalsmp/blob/main/1775664361126.png?raw=true";

    // Pilih Webhook tujuan berdasarkan kategori
    const targetWebhook = (currentCategory === 'announcement') ? WEBHOOK_ANNOUNCEMENT : WEBHOOK_DEFAULT;

    const embedData = {
        title: currentCategory.toUpperCase(),
        color: parseInt("B22222", 16),
        fields: [],
        timestamp: new Date().toISOString(),
        thumbnail: { url: thumbnail }
    };

    fields.forEach(f => {
        const id = f.toLowerCase().replace(/ /g, '_');
        const val = document.getElementById(id).value;
        if(f === 'Link Gambar' && val) embedData.image = { url: val };
        else if(f === 'Description') embedData.description = val;
        else embedData.fields.push({ name: f, value: val || "-", inline: true });
    });

    // Menyiapkan Payload dengan Mention Role di luar Embed
    const payload = {
        content: `<@&${ROLE_ID}>`, // Tag role LegendofFeeloria[S15]
        embeds: [embedData]
    };

    try {
        const response = await fetch(targetWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(`Notifikasi ${currentCategory.toUpperCase()} berhasil dikirim!`);
            document.getElementById('webhookForm').reset();
        } else {
            alert('Gagal mengirim ke Discord. Pastikan URL Webhook benar.');
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan koneksi.');
    }
}

// Initialize default form
switchForm('announcement');
