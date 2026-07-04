const KEY = 'cognitest_user';

export function getLocalUser() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalUser(user) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    // localStorage tidak tersedia — tanpa ini, identitas user tidak akan
    // persisten antar kunjungan, tapi tes tetap bisa dijalankan.
  }
}

// SENGAJA tidak ada fungsi clearLocalUser/logout yang diekspos ke UI —
// sesuai desain produk: identitas melekat ke device/browser, tidak ada
// tombol "keluar". Mengganti nama tetap mempertahankan userId yang sama
// (lihat pages/index.js), sehingga riwayat & peringkat tetap terhubung
// ke identitas yang sama.

export async function registerUser(username) {
  const res = await fetch('/api/v1/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mendaftar.');
  saveLocalUser({ userId: data.userId, username: data.username });
  return data;
}

export async function renameUser(userId, username) {
  const res = await fetch('/api/v1/user', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, username }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengganti nama.');
  saveLocalUser({ userId: data.userId, username: data.username });
  return data;
}

export async function fetchUser(userId) {
  const res = await fetch(`/api/v1/user?userId=${encodeURIComponent(userId)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'User tidak ditemukan.');
  return data;
}
