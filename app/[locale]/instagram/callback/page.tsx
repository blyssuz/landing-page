const API_URL = process.env.API_URL || 'https://api.blyss.uz';

export default async function InstagramCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; state?: string; error?: string }>;
}) {
  const params = await searchParams;
  const { code, state: businessId, error: oauthError } = params;

  let success = false;
  let igUsername = '';
  let errorMessage = '';

  if (oauthError) {
    errorMessage = 'Avtorizatsiya bekor qilindi';
  } else if (!code || !businessId) {
    errorMessage = 'Avtorizatsiya kodi topilmadi';
  } else {
    try {
      const response = await fetch(`${API_URL}/instagram/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, business_id: businessId }),
      });

      if (response.ok) {
        const data = await response.json();
        success = true;
        igUsername = data.ig_username;
      } else {
        const err = await response.json().catch(() => ({}));
        errorMessage = err.error || 'Instagram ulanishda xatolik';
      }
    } catch {
      errorMessage = 'Serverga ulanib bo\'lmadi. Qayta urinib ko\'ring.';
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: '#fafafa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        {success ? (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'rgba(34, 197, 94, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
              Instagram ulandi!
            </h1>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px' }}>
              @{igUsername} muvaffaqiyatli ulandi. Ilovaga qayting va sozlamalarni yakunlang.
            </p>
            <p style={{ fontSize: '13px', color: '#999' }}>
              Bu oynani yopishingiz mumkin.
            </p>
          </>
        ) : (
          <>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
              Xatolik
            </h1>
            <p style={{ fontSize: '15px', color: '#666', marginBottom: '24px' }}>
              {errorMessage}
            </p>
            <p style={{ fontSize: '13px', color: '#999' }}>
              Bu oynani yopishingiz mumkin va qayta urinib ko&apos;ring.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
