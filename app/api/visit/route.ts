import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

export async function POST(req: NextRequest) {
  try {
    const { lat, lng, page } = await req.json();

    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const ua = req.headers.get('user-agent') || 'unknown';
    const referer = req.headers.get('referer') || '';

    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const now = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });

    const text = [
      `🌐 <b>Новый визит на сайт</b>`,
      ``,
      `📍 <a href="${mapsLink}">Локация</a>: ${lat}, ${lng}`,
      `📄 Страница: <code>${page}</code>`,
      referer ? `🔗 Источник: ${referer}` : null,
      `🖥 UA: <code>${ua.length > 120 ? ua.slice(0, 120) + '…' : ua}</code>`,
      `🌍 IP: <code>${ip}</code>`,
      `🕐 ${now}`,
    ]
      .filter(Boolean)
      .join('\n');

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
